import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Your Cart | Apex Truck Parts & Beds",
    description: "Review your industrial components and custom truck bed selections before checkout at Apex Truck Parts.",
};

export default function CartLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
