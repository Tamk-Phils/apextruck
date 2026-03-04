import type { Metadata, ResolvingMetadata } from "next";
import PartDetailsClient from "@/components/PartDetailsClient";
import { supabase } from "@/lib/supabase/client";

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const id = (await params).id;

    const { data: part } = await supabase
        .from("parts")
        .select("name, description, images")
        .eq("id", id)
        .single();

    if (!part) {
        return {
            title: "Part Not Found | Apex Truck Parts",
        };
    }

    const ogImage = part.images && part.images.length > 0
        ? part.images[0]
        : "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&h=630&q=80";

    return {
        title: `${part.name} | Apex Truck Parts`,
        description: part.description || `View technical specifications and pricing for ${part.name} at Apex Truck Parts & Beds.`,
        openGraph: {
            title: `${part.name} | Apex Truck Parts`,
            description: part.description || `View technical specifications and pricing for ${part.name}.`,
            images: [ogImage],
        },
        twitter: {
            card: "summary_large_image",
            title: `${part.name} | Apex Truck Parts`,
            description: part.description || `View technical specifications and pricing for ${part.name}.`,
            images: [ogImage],
        },
    };
}

export default function PartDetailsPage() {
    return <PartDetailsClient />;
}
