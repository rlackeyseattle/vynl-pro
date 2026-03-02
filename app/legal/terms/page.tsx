import Link from "next/link";
import { Guitar, ArrowLeft, Shield, FileText, Copyright, Lock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | VYNL.PRO",
    description: "VYNL.PRO Terms of Service and User Agreement",
};

export default function TermsPage() {
    return <LegalPage title="Terms of Service" icon={<FileText size={20} />} lastUpdated="February 25, 2026">
        <Section title="1. Agreement to Terms">
            By accessing or using VYNL.PRO ("the Platform," "we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not use the Platform. VYNL.PRO is a professional platform for independent musicians, artists, bands, and music industry professionals.
        </Section>

        <Section title="2. Eligibility">
            You must be at least 13 years of age to create an account. If you are under 18, you must have parental consent. By creating an account, you represent that the information you provide is accurate and that you are eligible under these requirements.
        </Section>

        <Section title="3. Your Account">
            You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to notify us immediately of any unauthorized access to your account. VYNL.PRO reserves the right to terminate accounts that violate these Terms.
        </Section>

        <Section title="4. Acceptable Use">
            You agree NOT to: (a) upload content that infringes on third-party intellectual property rights; (b) use the Platform to harass, threaten, or defame other users; (c) attempt to gain unauthorized access to other accounts or our systems; (d) use automated bots or scrapers against the Platform without permission; (e) misrepresent your identity or affiliation; (f) use the Platform for any unlawful purpose.
        </Section>

        <Section title="5. Content Ownership and License">
            You retain full ownership of all content you upload to VYNL.PRO, including music, photos, videos, and text. By uploading content, you grant VYNL.PRO a non-exclusive, royalty-free, worldwide license to display, distribute, and promote your content within the Platform solely for the purpose of operating the service. We will never sell your music, recordings, or likeness to third parties without your explicit consent.
        </Section>

        <Section title="6. Booking and Contracts">
            VYNL.PRO provides tools to facilitate booking inquiries and contract generation. We are not a party to any agreement between artists and venues. Any contracts executed through the Platform are between the artist and the venue. VYNL.PRO is not liable for disputes arising from such agreements.
        </Section>

        <Section title="7. Payments and Subscriptions">
            Certain features of VYNL.PRO may require a paid subscription. All fees are non-refundable unless otherwise stated. We reserve the right to change pricing with 30 days' notice to existing subscribers.
        </Section>

        <Section title="8. Disclaimer of Warranties">
            VYNL.PRO is provided "as is" without warranty of any kind. We do not guarantee the Platform will be uninterrupted, error-free, or secure. Venue and directory information is provided for informational purposes and may be inaccurate — always verify independently.
        </Section>

        <Section title="9. Limitation of Liability">
            To the fullest extent permitted by law, VYNL.PRO shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Platform.
        </Section>

        <Section title="10. Governing Law">
            These Terms are governed by the laws of the State of Washington, United States, without regard to its conflict of laws provisions. Any disputes shall be resolved in the courts of King County, Washington.
        </Section>

        <Section title="11. Changes to Terms">
            We reserve the right to update these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the new Terms. We will make reasonable efforts to notify users of significant changes.
        </Section>

        <Section title="12. Contact">
            Questions about these Terms? Contact us at <span className="text-cyan-400">legal@vynl.pro</span>
        </Section>
    </LegalPage>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-8">
            <h2 className="text-base font-bold text-white mb-3">{title}</h2>
            <p className="text-neutral-400 leading-relaxed text-sm">{children}</p>
        </div>
    );
}

function LegalPage({ title, icon, lastUpdated, children }: {
    title: string; icon: React.ReactNode; lastUpdated: string; children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#07070e] text-white">
            {/* Header */}
            <div className="border-b border-white/5 px-6 py-4 flex items-center gap-3">
                <Link href="/" className="flex items-center gap-2 mr-auto">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center">
                        <span className="font-black text-black text-sm italic">V</span>
                    </div>
                    <span className="font-black text-sm tracking-tight">VYNL.PRO</span>
                </Link>
                <Link href="/" className="flex items-center gap-1 text-xs text-neutral-500 hover:text-white transition-colors">
                    <ArrowLeft size={12} /> Home
                </Link>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-16">
                {/* Title */}
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-600/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        {icon}
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">{title}</h1>
                </div>
                <p className="text-xs text-neutral-600 mb-12 ml-[52px]">Last updated: {lastUpdated}</p>

                {/* Legal nav */}
                <div className="flex flex-wrap gap-2 mb-12">
                    {[
                        { label: "Terms of Service", href: "/legal/terms" },
                        { label: "Privacy Policy", href: "/legal/privacy" },
                        { label: "License Agreement", href: "/legal/license" },
                        { label: "Trademark & Copyright", href: "/legal/trademark" },
                    ].map(l => (
                        <Link key={l.href} href={l.href}
                            className="text-xs px-3 py-1.5 rounded-full border transition-all hover:border-cyan-500/40 hover:text-cyan-400"
                            style={{ borderColor: "rgba(255,255,255,0.1)", color: "#6b7280" }}>
                            {l.label}
                        </Link>
                    ))}
                </div>

                {children}
            </div>

            {/* Footer */}
            <div className="border-t border-white/5 px-6 py-8 text-center">
                <p className="text-xs text-neutral-700">
                    © {new Date().getFullYear()} VYNL.PRO. All rights reserved. Built for independent artists, by musicians.
                </p>
            </div>
        </div>
    );
}
