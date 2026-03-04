import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Apex Truck Parts & Beds",
    description: "Get in touch with the Apex engineering team. Inquiries for fleet orders, custom truck beds, and heavy-duty parts.",
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
