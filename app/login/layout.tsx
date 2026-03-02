import { Metadata } from "next";

export const metadata: Metadata = {
    title: "COMMAND ACCESS",
    description: "Secure baseline access to the VYNL Pro ecosystem.",
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
