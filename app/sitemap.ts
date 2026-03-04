import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://apextruckparts.com";

    // Static routes
    const routes = [
        "",
        "/about",
        "/browse",
        "/contact",
        "/faq",
        "/shipping",
        "/maintenance",
        "/warranty",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1 : 0.8,
    }));

    // Dynamic part routes
    try {
        const { data: parts } = await supabase
            .from("parts")
            .select("id, updated_at");

        const partRoutes = (parts || []).map((part) => ({
            url: `${baseUrl}/parts/${part.id}`,
            lastModified: part.updated_at || new Date().toISOString(),
            changeFrequency: "weekly" as const,
            priority: 0.6,
        }));

        return [...routes, ...partRoutes];
    } catch (error) {
        console.error("Sitemap generation error:", error);
        return routes;
    }
}
