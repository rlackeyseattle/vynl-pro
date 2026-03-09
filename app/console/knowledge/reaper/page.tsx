import type { Metadata } from "next";
import ReaperManualClient from "./ReaperManualClient";

export const metadata: Metadata = {
    title: "Reaper DAW Manual | VYNL Knowledge",
    description: "Comprehensive interactive Reaper DAW manual — 200+ keyboard shortcuts, tips, tricks, FX routing, MIDI, and workflow secrets.",
};

export default function ReaperManualPage() {
    return <ReaperManualClient />;
}
