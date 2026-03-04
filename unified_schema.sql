-- =====================================================================
-- Ellie's Bichon Frise Sanctuary — FINAL Clean Unified Schema
-- =====================================================================
-- HOW TO USE:
--   1. Paste this entire file into the Supabase SQL Editor
--   2. Click "Run"
--   3. Done — all tables, RLS policies, and triggers are set up.
--
-- SAFE TO RUN MULTIPLE TIMES (fully idempotent).
-- All tables are dropped and recreated to eliminate legacy constraints.
-- =====================================================================


-- ============================================================
-- STEP 1: DROP ALL TABLES (clears all legacy constraints)
-- ============================================================
DROP TABLE IF EXISTS public.order_items         CASCADE;
DROP TABLE IF EXISTS public.orders              CASCADE;
DROP TABLE IF EXISTS public.push_subscriptions  CASCADE;
DROP TABLE IF EXISTS public.messages            CASCADE;
DROP TABLE IF EXISTS public.conversations       CASCADE;
DROP TABLE IF EXISTS public.notifications       CASCADE;
DROP TABLE IF EXISTS public.inquiries           CASCADE;
DROP TABLE IF EXISTS public.parts               CASCADE;
-- NOTE: public.users is NOT dropped — it references auth.users.
--       We clean it with ALTER TABLE instead.


-- ============================================================
-- STEP 2: USERS — clean existing table without dropping it
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  name       TEXT,
  role       TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add any missing columns for existing installations
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS name       TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role       TEXT NOT NULL DEFAULT 'user';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Remove the role CHECK constraint if it exists (we'll re-add it cleanly)
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD  CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'));

-- Dynamically drop ANY other unexpected legacy columns
DO $$
DECLARE col TEXT;
BEGIN
  FOR col IN
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'users'
      AND column_name  NOT IN ('id', 'email', 'name', 'role', 'created_at')
  LOOP
    EXECUTE format('ALTER TABLE public.users DROP COLUMN IF EXISTS %I CASCADE', col);
  END LOOP;
END $$;


-- ============================================================
-- STEP 3: AUTO-CREATE USER PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- STEP 4: PARTS INVENTORY
-- ============================================================
CREATE TABLE public.parts (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  model_year  TEXT,
  category    TEXT        CHECK (category IN ('heavy-duty', 'performance')),
  price       NUMERIC,
  status      TEXT        NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  images      TEXT[]      NOT NULL DEFAULT '{}',
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- STEP 5: ORDERS (One per purchase)
-- ============================================================
CREATE TABLE public.orders (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        REFERENCES public.users(id)   ON DELETE CASCADE,
  status      TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  payment_status TEXT     NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid')),
  shipping_status TEXT    NOT NULL DEFAULT 'pending' CHECK (shipping_status IN ('pending', 'shipped', 'delivered')),
  total_price NUMERIC     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Recipient Information
  first_name        TEXT,
  last_name         TEXT,
  email             TEXT,
  phone             TEXT,
  address           TEXT,
  city              TEXT,
  state             TEXT,
  zip               TEXT,

  -- Payment & Notes
  payment_method    TEXT,
  notes             TEXT
);

-- ============================================================
-- STEP 5.1: ORDER ITEMS
-- ============================================================
CREATE TABLE public.order_items (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID        REFERENCES public.orders(id)  ON DELETE CASCADE,
  part_id     UUID        REFERENCES public.parts(id)   ON DELETE SET NULL,
  quantity    INTEGER     NOT NULL DEFAULT 1,
  unit_price  NUMERIC     NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- STEP 6: NOTIFICATIONS
-- ============================================================
CREATE TABLE public.notifications (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        REFERENCES public.users(id) ON DELETE CASCADE,
  message    TEXT        NOT NULL,
  read       BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- STEP 7: CONVERSATIONS (one per user)
-- ============================================================
CREATE TABLE public.conversations (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);


-- ============================================================
-- STEP 8: MESSAGES
-- ============================================================
CREATE TABLE public.messages (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID        REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id       UUID        REFERENCES public.users(id)         ON DELETE SET NULL,
  content         TEXT        NOT NULL,
  is_admin        BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- STEP 9: PUSH SUBSCRIPTIONS
-- ============================================================
CREATE TABLE public.push_subscriptions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        REFERENCES public.users(id) ON DELETE CASCADE,
  subscription TEXT        NOT NULL,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);


-- ============================================================
-- STEP 10: ENABLE ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- STEP 11: RLS POLICIES
-- ============================================================

-- Helper function to check if the current user is an admin
-- Checks both JWT metadata (fast) and public.users table (reliable)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin') OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── users ──
DROP POLICY IF EXISTS "users_own"        ON public.users;
DROP POLICY IF EXISTS "users_admin_read" ON public.users;

CREATE POLICY "users_own" ON public.users
  FOR ALL USING (id = auth.uid());

CREATE POLICY "users_admin_read" ON public.users
  FOR SELECT USING (public.is_admin());

-- ── parts ──
DROP POLICY IF EXISTS "parts_public_read" ON public.parts;
DROP POLICY IF EXISTS "parts_admin_insert" ON public.parts;
DROP POLICY IF EXISTS "parts_admin_update" ON public.parts;
DROP POLICY IF EXISTS "parts_admin_delete" ON public.parts;

CREATE POLICY "parts_public_read" ON public.parts
  FOR SELECT USING (true);

CREATE POLICY "parts_admin_insert" ON public.parts
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "parts_admin_update" ON public.parts
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "parts_admin_delete" ON public.parts
  FOR DELETE USING (public.is_admin());

-- ── orders ──
DROP POLICY IF EXISTS "orders_own"   ON public.orders;
DROP POLICY IF EXISTS "orders_admin" ON public.orders;

CREATE POLICY "orders_own" ON public.orders
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "orders_admin" ON public.orders
  FOR ALL USING (public.is_admin());

-- ── order_items ──
DROP POLICY IF EXISTS "order_items_own"   ON public.order_items;
DROP POLICY IF EXISTS "order_items_admin" ON public.order_items;

CREATE POLICY "order_items_own" ON public.order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "order_items_admin" ON public.order_items
  FOR ALL USING (public.is_admin());

-- ── notifications ──
DROP POLICY IF EXISTS "notifications_own" ON public.notifications;
DROP POLICY IF EXISTS "notifications_admin" ON public.notifications;

CREATE POLICY "notifications_own" ON public.notifications
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "notifications_admin" ON public.notifications
  FOR ALL USING (public.is_admin());

-- ── conversations ──
DROP POLICY IF EXISTS "conversations_own"   ON public.conversations;
DROP POLICY IF EXISTS "conversations_admin" ON public.conversations;

CREATE POLICY "conversations_own" ON public.conversations
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "conversations_admin" ON public.conversations
  FOR ALL USING (public.is_admin());

-- ── messages ──
DROP POLICY IF EXISTS "messages_own"   ON public.messages;
DROP POLICY IF EXISTS "messages_admin" ON public.messages;

-- Users can read messages in their own conversations
CREATE POLICY "messages_select" ON public.messages
  FOR SELECT USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id AND c.user_id = auth.uid()
    )
  );

-- Users can insert messages into their own conversations
CREATE POLICY "messages_insert" ON public.messages
  FOR INSERT WITH CHECK (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id AND c.user_id = auth.uid()
    )
  );

-- ── push_subscriptions ──
DROP POLICY IF EXISTS "push_own"   ON public.push_subscriptions;
DROP POLICY IF EXISTS "push_admin" ON public.push_subscriptions;

CREATE POLICY "push_own" ON public.push_subscriptions
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "push_admin" ON public.push_subscriptions
  FOR ALL USING (public.is_admin());


-- ============================================================
-- STEP 13: ENABLE REALTIME
-- ============================================================
-- Enable Realtime for the messages table
-- ============================================================
-- STEP 13: ENABLE REALTIME
-- ============================================================
-- Ensure the publication exists (Supabase default) and add the table safely
DO $$
BEGIN
  -- 1. Create publication if it doesn't already exist
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;

  -- 2. Add the messages table to the publication if it's not already there
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;
END $$;

-- Set replica identity to FULL so that all columns are available in the Realtime stream
ALTER TABLE public.messages REPLICA IDENTITY FULL;

NOTIFY pgrst, 'reload schema';
