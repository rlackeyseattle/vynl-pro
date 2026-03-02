/**
 * VYNL.PRO — Default Username Generator
 * Funny music, audio, tech, and studio puns.
 * Think Discord-style random names but for musicians.
 */

// Adjectives — music/studio/tour vibes
const ADJECTIVES = [
    "fuzzy", "distorted", "overdriven", "clipping", "saturated", "compressed",
    "reverb", "delayed", "phased", "tremolo", "vibrato", "sustaining",
    "flat", "sharp", "modal", "pentatonic", "chromatic", "diatonic",
    "acoustic", "electric", "magnetic", "analog", "digital", "modular",
    "transient", "punchy", "sibilant", "boomy", "nasal", "boxy",
    "shredding", "plucking", "bowing", "strumming", "fingerpicking",
    "dropped", "capo", "detuned", "microtonally", "polyrhythmic",
    "staccato", "legato", "glissando", "arpegiated", "trempicked",
    "loudwared", "warbley", "glitchy", "lo-fi", "hi-fi", "tape-saturated",
    "flanged", "chorus_drenched", "double", "tracked", "layered",
    "bussed", "routed", "patched", "sidechained", "gated", "triggered",
    "phantom_powered", "balanced", "unbalanced", "direct", "amped",
    "maxed", "buried", "upfront", "washy", "tight", "loose", "slamming",
];

// Nouns — music/audio/tech/industry terms
const NOUNS = [
    // Studio
    "fader", "knob", "compressor", "limiter", "preamp",
    "capsule", "diaphragm", "transformer", "headroom", "gainstagin",
    "patchbay", "insert", "aux_send", "buss", "stem",
    "mixdown", "bounce", "session", "take", "overdub",
    "comping", "punch_in", "click_track", "reference", "mastered_mix",
    "meters", "vu_reader", "peak_hold", "rms_level", "noise_floor",

    // Gear
    "pedalboard", "stompbox", "whammy", "talkbox", "octaver",
    "phaser_one", "fuzz_face", "big_muff", "tube_driver", "klone",
    "rack_unit", "poweramp", "di_box", "reamper", "loadbox",
    "snark", "clip_light", "tuner", "strobe_cal", "pitch_pipe",

    // Live/Tour
    "monitor", "wedge", "in_ear", "snake", "stage_box",
    "amp_stand", "guitar_rig", "cabinet", "backline", "riser",
    "duct_tape", "gaffer", "roadcase", "splitter", "rat_pack",
    "laminate", "setlist", "stage_plot", "input_list", "tech_rider",
    "green_room", "per_diem", "hotel_key", "load_out", "tour_bus",
    "merch_bin", "cash_box", "poster", "flycut", "advance",

    // Audio concepts
    "headroom", "transient", "harmonic", "overtone", "undertone",
    "groove", "pocket", "downbeat", "offbeat", "polyrhythm",
    "interval", "fifth", "tritone", "lydian", "dorian",
    "pentatonic", "blue_note", "leading_tone", "resolution", "cadence",

    // Funny spins
    "bassline", "trebleclef", "quarter_note", "eighth_rest", "fermata",
    "crescendo", "decrescendo", "rubato", "ritardando", "accelerando",
];

// Totally unhinged music-pun name formats
const PUNS: string[] = [
    // Artists as puns
    "AussieOxborn",      // Ozzy Osbourne
    "JimmyHendrickson",  // Jimi Hendrix
    "KurtCobaine",       // Kurt Cobain
    "DavidBowieKnife",   // David Bowie
    "FranklinZappadopa", // Frank Zappa
    "PrincePurpleRMS",   // Prince
    "TonniMitchelI",     // Joni Mitchell
    "NeilYoungDB",       // Neil Young
    "StevieNicksBack",   // Stevie Nicks
    "MickJaggernaut",    // Mick Jagger
    "JackWhiteNoise",    // Jack White
    "KeithMoonUnit",     // Keith Moon
    "JohnBonhammerhead", // John Bonham
    "PeteWho",           // Pete Townshend
    "ChuckBerryPicker",  // Chuck Berry
    "BruceSpringverb",   // Bruce Springsteen
    "TomWaitsForOrgan",  // Tom Waits
    "LoLo_Reed",         // Lou Reed
    "PattySmitten",      // Patti Smith
    "IgnyPop",           // Iggy Pop
    "RobertPlantar",     // Robert Plant
    "JimmyPageFile",     // Jimmy Page
    "EricClaptonboard",  // Eric Clapton
    "B_B_Kings",         // B.B. King
    "MuddyWatershed",    // Muddy Waters
    "BobMarleyphone",    // Bob Marley
    "WarrenZevonian",    // Warren Zevon
    "TomPettyphier",     // Tom Petty
    "SteveMillerBand",   // (already funny)
    "PinkFloydian",      // Pink Floyd
    "RadioHeadphones",   // Radiohead
    "TheBeatlesPerMin",  // The Beatles
    "RollingToneBuster", // Rolling Stones
    "NineInchNails_Nail",
    "SoundGardenHose",   // Soundgarden
    "AliceInChainsaws",  // Alice in Chains
    "PearlJamBand",      // Pearl Jam
    "FooFighters_FX",    // Foo Fighters
    "NirvanaCurve",      // Nirvana
    "TheCranberrySauce", // The Cranberries
    "SmashingPumpkinSeed",
    "BeckMonsterCable",  // Beck
    "ElvisPresleyFader", // Elvis
    "JohnnyCache",       // Johnny Cash
    "HankWilliamsGain",  // Hank Williams
    "WillieNelsonFade",  // Willie Nelson
    "WaylonJenningsDB",  // Waylon Jennings
    "MerleHaggardedge",  // Merle Haggard
    "DollyPartone",      // Dolly Parton
    "GarthBrookssend",   // Garth Brooks
    "RebaMcEntireBus",   // Reba McEntire
    "SlashDot_Guitar",   // Slash
    "DimebagPickHolder", // Dimebag Darrell
    "AxelF_Rose",        // Axl Rose
    "OzzyOxborough",     // another Ozzy
    "SantanaClaus",      // Santana
    "CarlosAcoustica",
    "SteveVaioline",     // Steve Vai
    "JoeDepasati",       // Joe Satriani
    "TomMorrellos",      // Tom Morello
    "JohnFruscianteLevel",
    "RhillisClapton",
    "AlbertKingCompressor",
    "BuddyGuyWire",
    "RobbieKriegerLine",
    "DuanAllmanBridge",
    // Studio/tech puns
    "GainBeforeBeauty",
    "NoisFloorSweeper",
    "PatchBayWatcher",
    "AttackAndRelease",
    "TransientResponse",
    "RatioOf5to1",
    "KneePointBreaker",
    "MakeupGainEnjoyer",
    "SideChainSurfer",
    "ParallelBussDriver",
    "VocalBoothHermit",
    "IsoBoothGhost",
    "PhantomPowered",
    "XLR_Ambassador",
    "DI_Box_Dave",
    "SnakeCharmer_Stage",
    "ProToolsDrifter",
    "LogicPro_Zealot",
    "AbletonLiver",
    "ReaperSociety",
    "PlugInYourself",
    "VST_Hoarder",
    "SamplePackRat",
    "LoopLiberator",
    "MidiClipFlinger",
    "CcMessageSender",
    "VelocityLayer8",
    "PolyTouchTerry",
    "ArpeggiatorAndy",
    "StepSequencer",
    "TapeDelay_Dave",
    "SpringReverbRob",
    "PlateEchoPete",
    "RoomMicRay",
    "AmbienceArtist",
    "GoldFoilPickup",
    "P90Preacher",
    "SingleCoilSally",
    "HumbuckerHank",
    "PiezoPickPaul",
    "NutJob_Luthier",
    "IntonationIan",
    "ActionFigureLuther",
    "TrussRodTerry",
    "PickGuardPete",
    "StraplockSteve",
    "CableWranglerWendy",
    "PedalboardPaula",
    "VelcroVictor",
    "ZipTieTed",
    "GafferTapeGary",
    "DigitalMixerMax",
    "AnaloguePurist",
    "TapeHissEnjoyer",
    "VinylSnapCrackle",
    "RecordStoreGhost",
    "CrateDiggerDave",
    "FlipperBinFrederica",
    "TurntableTimothy",
    "CrossfaderCarla",
    "CutScratchCarlos",
    "ToneArmTina",
    "StylusSteve",
    "GainStructureGuy",
    "SquareWaveWayne",
    "WaveformWanda",
    "BitDepthBob",
    "SampleRateSam",
    "JitterJim",
    "LatencyLarry",
    "BufferUnderrunUrsula",
    "DriverConflictDave",
    "AsioDraigon",
    "CoreAudioCarl",
    "ClockingCaroline",
    "WordClockWendy",
];

/** Pick a completely random pun name */
export function randomPunName(): string {
    return PUNS[Math.floor(Math.random() * PUNS.length)];
}

/** Generate a random adj+noun handle */
export function randomMusicHandle(): string {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(Math.random() * 99);
    return `${adj}_${noun}${num}`.toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 28);
}

/** Pick one of several formats at random */
export function generateDefaultHandle(): string {
    const roll = Math.random();
    if (roll < 0.4) return randomPunName().toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 28);
    return randomMusicHandle();
}

/** Generate a suggested list for the signup page */
export function getSuggestedHandles(count = 5): string[] {
    const picks: string[] = [];
    const used = new Set<string>();
    while (picks.length < count) {
        const h = generateDefaultHandle();
        if (!used.has(h)) { picks.push(h); used.add(h); }
    }
    return picks;
}

// ── Avatar system ─────────────────────────────────────────────────────────────
// 20 creative avatar "personas" for new users
export const DEFAULT_AVATARS = [
    { id: "stage-lights", emoji: "🎸", label: "Shredder", bg: "linear-gradient(135deg, #dc2626, #7c3aed)", glow: "#dc2626" },
    { id: "vocal-booth", emoji: "🎤", label: "Vocalist", bg: "linear-gradient(135deg, #2563eb, #06b6d4)", glow: "#06b6d4" },
    { id: "drum-kit", emoji: "🥁", label: "Time Keeper", bg: "linear-gradient(135deg, #d97706, #dc2626)", glow: "#d97706" },
    { id: "mixing-desk", emoji: "🎛️", label: "Engineer", bg: "linear-gradient(135deg, #059669, #06b6d4)", glow: "#059669" },
    { id: "tour-van", emoji: "🚐", label: "Road Dog", bg: "linear-gradient(135deg, #374151, #6b7280)", glow: "#6b7280" },
    { id: "tape-machine", emoji: "📼", label: "Tape Op", bg: "linear-gradient(135deg, #92400e, #d97706)", glow: "#d97706" },
    { id: "vinyl", emoji: "💿", label: "Wax Fanatic", bg: "linear-gradient(135deg, #1e1b4b, #7c3aed)", glow: "#7c3aed" },
    { id: "pedalboard", emoji: "⚡", label: "Tone Chaser", bg: "linear-gradient(135deg, #7c3aed, #ec4899)", glow: "#ec4899" },
    { id: "upright-bass", emoji: "🎷", label: "Low End", bg: "linear-gradient(135deg, #065f46, #34d399)", glow: "#34d399" },
    { id: "keys", emoji: "🎹", label: "Keys Player", bg: "linear-gradient(135deg, #1e40af, #818cf8)", glow: "#818cf8" },
    { id: "green-room", emoji: "🌿", label: "Green Room", bg: "linear-gradient(135deg, #166534, #4ade80)", glow: "#4ade80" },
    { id: "neon-sign", emoji: "✨", label: "Neon Ghost", bg: "linear-gradient(135deg, #0e7490, #22d3ee)", glow: "#22d3ee" },
    { id: "cassette", emoji: "📻", label: "Lo-Fi Wizard", bg: "linear-gradient(135deg, #7c2d12, #f97316)", glow: "#f97316" },
    { id: "spotlight", emoji: "🔦", label: "Front & Center", bg: "linear-gradient(135deg, #fcd34d, #f59e0b)", glow: "#f59e0b" },
    { id: "gaffer-tape", emoji: "🩹", label: "Crew Chief", bg: "linear-gradient(135deg, #374151, #9ca3af)", glow: "#9ca3af" },
    { id: "monitor-wedge", emoji: "📡", label: "Monitor Jockey", bg: "linear-gradient(135deg, #4f46e5, #a78bfa)", glow: "#a78bfa" },
    { id: "whammy", emoji: "🌀", label: "Dive Bomb", bg: "linear-gradient(135deg, #be185d, #f472b6)", glow: "#f472b6" },
    { id: "pickup-truck", emoji: "🛻", label: "Load Out Hero", bg: "linear-gradient(135deg, #1e3a5f, #60a5fa)", glow: "#60a5fa" },
    { id: "reverb-tank", emoji: "🌊", label: "Wash in Reverb", bg: "linear-gradient(135deg, #0c4a6e, #38bdf8)", glow: "#38bdf8" },
    { id: "metronome", emoji: "⏱️", label: "In the Pocket", bg: "linear-gradient(135deg, #422006, #a16207)", glow: "#a16207" },
];

/** Pick a deterministic avatar from a user ID or email hash */
export function getDefaultAvatar(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    return DEFAULT_AVATARS[hash % DEFAULT_AVATARS.length];
}
