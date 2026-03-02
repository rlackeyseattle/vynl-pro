import { Metadata } from "next";

export const metadata: Metadata = {
    title: "COMMAND CENTER",
    description: "Manage your musician identity and transmissions.",
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
