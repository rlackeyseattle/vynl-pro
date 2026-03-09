export type ShortcutCategory = "Playback" | "Recording" | "Editing" | "Navigation" | "Mixing" | "MIDI" | "View";

export interface Shortcut {
    action: string;
    windows: string;
    mac: string;
    category: ShortcutCategory;
}

export interface TipItem {
    title: string;
    body: string;
    level: "beginner" | "intermediate" | "pro";
}

export interface Section {
    id: string;
    label: string;
    emoji: string;
}

export const TOC_SECTIONS: Section[] = [
    { id: "getting-started", label: "Getting Started", emoji: "🚀" },
    { id: "interface", label: "Interface Overview", emoji: "🖥️" },
    { id: "recording", label: "Recording", emoji: "🎙️" },
    { id: "editing", label: "Editing", emoji: "✂️" },
    { id: "mixing", label: "Mixing & FX", emoji: "🎚️" },
    { id: "midi", label: "MIDI", emoji: "🎹" },
    { id: "routing", label: "Routing & Buses", emoji: "🔀" },
    { id: "customization", label: "Customization", emoji: "⚙️" },
    { id: "hotkeys", label: "Hotkey Cheat Sheet", emoji: "⌨️" },
    { id: "tips", label: "Tips & Tricks", emoji: "💡" },
    { id: "resources", label: "Resources", emoji: "📚" },
];

export const SHORTCUTS: Shortcut[] = [
    // Playback
    { action: "Play / Stop", windows: "Space", mac: "Space", category: "Playback" },
    { action: "Play from edit cursor", windows: "Ctrl + Space", mac: "Cmd + Space", category: "Playback" },
    { action: "Stop", windows: "Space", mac: "Space", category: "Playback" },
    { action: "Rewind to start", windows: "Home / W", mac: "Home / W", category: "Playback" },
    { action: "Go to end", windows: "End", mac: "End", category: "Playback" },
    { action: "Toggle repeat (loop)", windows: "R", mac: "R", category: "Playback" },
    { action: "Tap tempo", windows: "Alt + Shift + T", mac: "Opt + Shift + T", category: "Playback" },

    // Recording
    { action: "Start recording", windows: "Ctrl + R", mac: "Cmd + R", category: "Recording" },
    { action: "Arm selected track", windows: "Ctrl + Alt + R", mac: "Cmd + Opt + R", category: "Recording" },
    { action: "Toggle count-in", windows: "Shift + `", mac: "Shift + `", category: "Recording" },
    { action: "Open render dialog", windows: "Ctrl + Alt + R", mac: "Cmd + Opt + R", category: "Recording" },
    { action: "Enable metronome", windows: "Shift + C", mac: "Shift + C", category: "Recording" },

    // Editing
    { action: "Split item at cursor", windows: "S", mac: "S", category: "Editing" },
    { action: "Undo", windows: "Ctrl + Z", mac: "Cmd + Z", category: "Editing" },
    { action: "Redo", windows: "Ctrl + Shift + Z", mac: "Cmd + Shift + Z", category: "Editing" },
    { action: "Copy", windows: "Ctrl + C", mac: "Cmd + C", category: "Editing" },
    { action: "Paste", windows: "Ctrl + V", mac: "Cmd + V", category: "Editing" },
    { action: "Cut", windows: "Ctrl + X", mac: "Cmd + X", category: "Editing" },
    { action: "Duplicate item", windows: "Ctrl + D", mac: "Cmd + D", category: "Editing" },
    { action: "Select all items", windows: "Ctrl + A", mac: "Cmd + A", category: "Editing" },
    { action: "Delete selected item", windows: "Delete", mac: "Delete", category: "Editing" },
    { action: "Nudge item left", windows: "Alt + ←", mac: "Opt + ←", category: "Editing" },
    { action: "Nudge item right", windows: "Alt + →", mac: "Opt + →", category: "Editing" },
    { action: "Ripple edit toggle", windows: "Alt + P", mac: "Opt + P", category: "Editing" },
    { action: "Crop to time selection", windows: "Ctrl + Shift + C", mac: "Cmd + Shift + C", category: "Editing" },
    { action: "Glue selected items", windows: "G", mac: "G", category: "Editing" },
    { action: "Heal splits in items", windows: "Ctrl + H", mac: "Cmd + H", category: "Editing" },
    { action: "Item properties", windows: "F2", mac: "F2", category: "Editing" },

    // Navigation
    { action: "Zoom in (horizontal)", windows: "Ctrl + →", mac: "Cmd + →", category: "Navigation" },
    { action: "Zoom out (horizontal)", windows: "Ctrl + ←", mac: "Cmd + ←", category: "Navigation" },
    { action: "Zoom to time selection", windows: "Ctrl + Shift + Z", mac: "Cmd + Shift + Z", category: "Navigation" },
    { action: "Set time selection start", windows: "[", mac: "[", category: "Navigation" },
    { action: "Set time selection end", windows: "]", mac: "]", category: "Navigation" },
    { action: "Insert marker", windows: "M", mac: "M", category: "Navigation" },
    { action: "Insert named marker", windows: "Shift + M", mac: "Shift + M", category: "Navigation" },
    { action: "Create region from selection", windows: "Shift + R", mac: "Shift + R", category: "Navigation" },
    { action: "Go to next marker", windows: "→ (numpad)", mac: "→ (numpad)", category: "Navigation" },
    { action: "Go to previous marker", windows: "← (numpad)", mac: "← (numpad)", category: "Navigation" },
    { action: "Move cursor left by grid", windows: "Ctrl + ← (numpad)", mac: "Cmd + ←", category: "Navigation" },
    { action: "Scroll view left/right", windows: "Shift + Scroll", mac: "Shift + Scroll", category: "Navigation" },

    // Mixing
    { action: "Toggle mixer window", windows: "Ctrl + M", mac: "Cmd + M", category: "Mixing" },
    { action: "Toggle master track", windows: "Ctrl + Alt + M", mac: "Cmd + Opt + M", category: "Mixing" },
    { action: "Insert FX on track", windows: "Shift + F", mac: "Shift + F", category: "Mixing" },
    { action: "Bypass all FX on track", windows: "F", mac: "F", category: "Mixing" },
    { action: "Save project", windows: "Ctrl + S", mac: "Cmd + S", category: "Mixing" },
    { action: "Save project as", windows: "Ctrl + Shift + S", mac: "Cmd + Shift + S", category: "Mixing" },
    { action: "New track", windows: "Ctrl + T", mac: "Cmd + T", category: "Mixing" },
    { action: "Mute selected track", windows: "F5", mac: "F5", category: "Mixing" },
    { action: "Solo selected track", windows: "F6", mac: "F6", category: "Mixing" },
    { action: "Arm selected track", windows: "F7", mac: "F7", category: "Mixing" },
    { action: "Show track routing", windows: "Alt + R", mac: "Opt + R", category: "Mixing" },

    // MIDI
    { action: "Open piano roll (MIDI editor)", windows: "Ctrl + Alt + E", mac: "Cmd + Opt + E", category: "MIDI" },
    { action: "Quantize notes", windows: "Q", mac: "Q", category: "MIDI" },
    { action: "Open MIDI event list", windows: "Ctrl + Alt + L", mac: "Cmd + Opt + L", category: "MIDI" },
    { action: "Transpose up semitone", windows: "Shift + ↑", mac: "Shift + ↑", category: "MIDI" },
    { action: "Transpose down semitone", windows: "Shift + ↓", mac: "Shift + ↓", category: "MIDI" },
    { action: "Transpose up octave", windows: "Ctrl + ↑", mac: "Cmd + ↑", category: "MIDI" },
    { action: "Transpose down octave", windows: "Ctrl + ↓", mac: "Cmd + ↓", category: "MIDI" },

    // View
    { action: "Open action list", windows: "?", mac: "?", category: "View" },
    { action: "Open project settings", windows: "Alt + Enter", mac: "Opt + Enter", category: "View" },
    { action: "Open preferences", windows: "Ctrl + P", mac: "Cmd + ,", category: "View" },
    { action: "Toggle transport toolbar", windows: "Ctrl + Alt + T", mac: "Cmd + Opt + T", category: "View" },
    { action: "Open media explorer", windows: "Ctrl + Alt + X", mac: "Cmd + Opt + X", category: "View" },
    { action: "Screenset 1-9", windows: "Ctrl + F1-F9", mac: "Cmd + F1-F9", category: "View" },
    { action: "New project", windows: "Ctrl + N", mac: "Cmd + N", category: "View" },
    { action: "Open project", windows: "Ctrl + O", mac: "Cmd + O", category: "View" },
];

export const TIPS: TipItem[] = [
    {
        title: "Use Screensets for Different Workflows",
        body: "Save your mixer-focused layout as Screenset 1 and your editing layout as Screenset 2. Press Ctrl+F1 / Ctrl+F2 to swap instantly. Game-changer for large sessions.",
        level: "intermediate",
    },
    {
        title: "The Action List Is Your Superpower",
        body: "Press '?' to open the Action List. Every single thing Reaper can do is listed here. Search, bind a hotkey, or chain multiple actions into a custom macro. This is how power users move 10x faster.",
        level: "beginner",
    },
    {
        title: "Ripple Edit for Podcast / Linear Work",
        body: "Toggle Ripple Edit (Alt+P) so that deleting or moving an item automatically shifts everything downstream. Essential for podcast editing and linear projects.",
        level: "intermediate",
    },
    {
        title: "Save Your FX Chains",
        body: "Built a killer vocal chain? Click the FX chain menu → Save FX Chain. It'll appear in your FX browser and you can drop it on any track in any project instantly.",
        level: "intermediate",
    },
    {
        title: "Folders as Buses",
        body: "Create a track, then drag other tracks under it as children (indent them in the TCP). The parent track now acts as a bus — apply a bus compressor or EQ to the whole group.",
        level: "intermediate",
    },
    {
        title: "Track Templates",
        body: "Right-click a track → Save Track as Template. Your routing, FX, input assignments, and track name all save. Load it on any project for consistent drum or vocal setups.",
        level: "intermediate",
    },
    {
        title: "Overlap Crossfades",
        body: "When you overlap two audio items, Reaper creates an automatic crossfade. Grab the crossfade edge to adjust shape and length. Perfect for seamless edits.",
        level: "beginner",
    },
    {
        title: "Mouse Modifier Customization",
        body: "Go to Preferences → Editing Behavior → Mouse Modifiers. You can redefine what Ctrl+drag, Alt+drag, etc. do on items, tracks, and the timeline. Extremely powerful.",
        level: "pro",
    },
    {
        title: "Freeze Tracks to Free CPU",
        body: "Right-click a track header → Freeze → Freeze to stereo. Reaper renders the FX to a temp file and unloads the plugins. Unfreeze anytime you want to edit.",
        level: "intermediate",
    },
    {
        title: "Use the SWS Extension",
        body: "Download the free SWS/S&M Extension. It adds hundreds of extra actions including Loudness tools, Snapshots, Live Config, and advanced item manipulation. Install it immediately.",
        level: "pro",
    },
    {
        title: "MIDI Retroactive Recording",
        body: "Reaper quietly buffers 30 seconds of MIDI input even when not recording. If you played something great and forgot to arm, go to File → MIDI → Import Last MIDI Buffer to recover it.",
        level: "pro",
    },
    {
        title: "Stretch Audio Without Pitch Shift",
        body: "Hold Alt while dragging an item edge to time-stretch without affecting pitch. Ctrl+drag the item edge to slip-edit the audio content inside the item boundary.",
        level: "intermediate",
    },
];

export const SHORTCUT_CATEGORIES: ShortcutCategory[] = [
    "Playback", "Recording", "Editing", "Navigation", "Mixing", "MIDI", "View",
];
