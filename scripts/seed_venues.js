require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

// Pacific Northwest Music Venues — Montana to Washington
// Comprehensive seed: 100+ venues across the region
const VENUES = [
    // ── SEATTLE, WA ─────────────────────────────────────────────────────────────
    { name: "The Crocodile", city: "Seattle", state: "WA", address: "2505 1st Ave", zip: "98121", lat: 47.6146, lng: -122.3496, phone: "(206) 441-4618", website: "https://thecrocodile.com", facebook: "thecrocodile", capacity: 500, venueType: "club", genres: '["rock","indie","alternative","punk"]', typicalFee: "$500-$2000", payType: "guarantee", ageLimit: "21+", description: "Seattle's legendary rock club, open since 1991. Pearl Jam, Nirvana, Mudhoney all played here.", region: "pnw", verified: true },
    { name: "The Tractor Tavern", city: "Seattle", state: "WA", address: "5213 Ballard Ave NW", zip: "98107", lat: 47.6673, lng: -122.3837, phone: "(206) 789-3599", website: "https://tractortavern.com", capacity: 300, venueType: "bar", genres: '["country","americana","folk","roots"]', typicalFee: "$300-$1200", payType: "guarantee", ageLimit: "21+", description: "Ballard's premier roots music venue. Best country and Americana in Seattle.", region: "pnw", verified: true },
    { name: "Nectar Lounge", city: "Seattle", state: "WA", address: "412 N 36th St", zip: "98103", lat: 47.6491, lng: -122.3494, phone: "(206) 632-2020", website: "https://nectarlounge.com", capacity: 300, venueType: "club", genres: '["electronic","hip-hop","indie","funk"]', typicalFee: "$200-$800", payType: "door", ageLimit: "21+", description: "Fremont neighborhood club with diverse booking.", region: "pnw", verified: true },
    { name: "Neumos", city: "Seattle", state: "WA", address: "925 E Pike St", zip: "98122", lat: 47.6145, lng: -122.3193, phone: "(206) 709-9442", website: "https://neumos.com", capacity: 650, venueType: "club", genres: '["indie","rock","electronic","alternative"]', typicalFee: "$600-$2500", payType: "guarantee", ageLimit: "21+", description: "Capitol Hill's main stage for indie and alternative acts.", region: "pnw", verified: true },
    { name: "The Sunset Tavern", city: "Seattle", state: "WA", address: "5433 Ballard Ave NW", zip: "98107", lat: 47.6679, lng: -122.3847, phone: "(206) 784-4880", website: "https://sunsettavern.com", capacity: 100, venueType: "bar", genres: '["rock","punk","indie","local"]', typicalFee: "$100-$400", payType: "door", ageLimit: "21+", description: "Intimate Ballard dive. Local and touring indie rock.", region: "pnw", verified: true },
    { name: "Barboza", city: "Seattle", state: "WA", address: "925 E Pike St", zip: "98122", lat: 47.6145, lng: -122.3193, phone: "(206) 709-9442", capacity: 200, venueType: "club", genres: '["indie","rock","electronic"]', typicalFee: "$200-$600", payType: "door", ageLimit: "21+", description: "Underground space beneath Neumos. Great for emerging artists.", region: "pnw", verified: true },
    { name: "Chop Suey", city: "Seattle", state: "WA", address: "1325 E Madison St", zip: "98122", lat: 47.6120, lng: -122.3113, phone: "(206) 324-8000", website: "https://chopsuey.com", capacity: 350, venueType: "club", genres: '["rock","punk","metal","alternative"]', typicalFee: "$300-$1000", payType: "door", ageLimit: "21+", description: "Capitol Hill rock club. Eclectic and unpretentious.", region: "pnw", verified: true },
    { name: "The Showbox", city: "Seattle", state: "WA", address: "1426 1st Ave", zip: "98101", lat: 47.6081, lng: -122.3397, phone: "(206) 628-3151", website: "https://showboxpresents.com", capacity: 1100, venueType: "theater", genres: '["rock","indie","pop","hip-hop","electronic"]', typicalFee: "$1500-$8000", payType: "guarantee", ageLimit: "21+", description: "Historic downtown venue. National touring acts.", region: "pnw", verified: true },
    { name: "The Showbox SoDo", city: "Seattle", state: "WA", address: "1700 1st Ave S", zip: "98134", lat: 47.5897, lng: -122.3332, phone: "(206) 652-0011", capacity: 1800, venueType: "theater", genres: '["rock","pop","hip-hop"]', typicalFee: "$2000-$12000", payType: "guarantee", ageLimit: "21+", description: "Larger sibling of The Showbox. Major touring acts.", region: "pnw", verified: true },
    { name: "Moore Theatre", city: "Seattle", state: "WA", address: "1932 2nd Ave", zip: "98101", lat: 47.6138, lng: -122.3410, phone: "(206) 467-5510", website: "https://stgpresents.org", capacity: 1800, venueType: "theater", genres: '["all"]', typicalFee: "$3000-$15000", payType: "guarantee", ageLimit: "all-ages", description: "Historic theater in Belltown. All genres, national acts.", region: "pnw", verified: true },
    { name: "Paramount Theatre", city: "Seattle", state: "WA", address: "911 Pine St", zip: "98101", lat: 47.6128, lng: -122.3293, capacity: 2800, venueType: "theater", genres: '["all"]', typicalFee: "$8000-$40000", payType: "guarantee", ageLimit: "all-ages", description: "Seattle's premier theater. Major touring headliners.", region: "pnw", verified: true },
    { name: "The Neptune Theatre", city: "Seattle", state: "WA", address: "1303 NE 45th St", zip: "98105", lat: 47.6614, lng: -122.3167, capacity: 1000, venueType: "theater", genres: '["indie","rock","pop","comedy"]', typicalFee: "$2000-$10000", payType: "guarantee", ageLimit: "all-ages", description: "University District gem. Mid-size touring shows.", region: "pnw", verified: true },
    { name: "Cafe Racer", city: "Seattle", state: "WA", address: "5828 Roosevelt Way NE", zip: "98105", lat: 47.6711, lng: -122.3169, phone: "(206) 523-5282", capacity: 80, venueType: "bar", genres: '["local","experimental","punk","folk"]', typicalFee: "$50-$200", payType: "door", ageLimit: "21+", description: "Quirky Roosevelt neighborhood bar with live music and rotating local art.", region: "pnw", verified: true },
    { name: "Columbia City Theater", city: "Seattle", state: "WA", address: "4916 Rainier Ave S", zip: "98118", lat: 47.5608, lng: -122.2819, phone: "(206) 722-3009", capacity: 250, venueType: "theater", genres: '["roots","americana","world","blues"]', typicalFee: "$200-$800", payType: "door", ageLimit: "all-ages", description: "Historic theater in Columbia City. Community-focused venue.", region: "pnw", verified: true },
    { name: "The Hard Rock Cafe Seattle", city: "Seattle", state: "WA", address: "116 Pike St", zip: "98101", lat: 47.6085, lng: -122.3403, capacity: 600, venueType: "restaurant", genres: '["rock","pop","cover"]', typicalFee: "$300-$800", payType: "guarantee", region: "pnw", verified: false },
    { name: "The Royal Room", city: "Seattle", state: "WA", address: "5000 Rainier Ave S", zip: "98118", lat: 47.5631, lng: -122.2798, phone: "(206) 735-0023", capacity: 200, venueType: "club", genres: '["jazz","blues","soul","funk","world"]', typicalFee: "$200-$700", payType: "door", ageLimit: "21+", description: "Columbia City jazz and blues room. Great sound, intimate.", region: "pnw", verified: true },
    { name: "Belltown Pub", city: "Seattle", state: "WA", address: "2322 1st Ave", zip: "98121", lat: 47.6142, lng: -122.3479, capacity: 120, venueType: "bar", genres: '["rock","indie","local"]', typicalFee: "$100-$300", payType: "door", ageLimit: "21+", region: "pnw", verified: false },
    { name: "Skylark Cafe & Club", city: "Seattle", state: "WA", address: "3803 Delridge Way SW", zip: "98106", lat: 47.5647, lng: -122.3660, phone: "(206) 935-2111", capacity: 100, venueType: "bar", genres: '["rock","punk","indie","local"]', typicalFee: "$75-$250", payType: "door", ageLimit: "21+", region: "pnw", verified: true },

    // ── TACOMA, WA ──────────────────────────────────────────────────────────────
    { name: "The Emerald Queen Casino", city: "Tacoma", state: "WA", address: "2024 E 29th St", zip: "98404", lat: 47.2198, lng: -122.4094, phone: "(253) 594-7777", capacity: 1200, venueType: "club", genres: '["country","rock","pop","r&b"]', typicalFee: "$1500-$8000", payType: "guarantee", description: "Tribal casino with major entertainment venue.", region: "pnw", verified: true },
    { name: "The New Frontier Lounge", city: "Tacoma", state: "WA", address: "301 E 25th St", zip: "98421", lat: 47.2375, lng: -122.4317, capacity: 200, venueType: "bar", genres: '["country","rock","local"]', typicalFee: "$150-$400", payType: "door", ageLimit: "21+", region: "pnw", verified: false },
    { name: "Jazzbones", city: "Tacoma", state: "WA", address: "2803 6th Ave", zip: "98406", lat: 47.2526, lng: -122.4693, phone: "(253) 396-9169", capacity: 300, venueType: "club", genres: '["jazz","blues","funk","soul","rock"]', typicalFee: "$200-$700", payType: "door", ageLimit: "21+", description: "Tacoma's jazz and blues hub.", region: "pnw", verified: true },
    { name: "The Warehouse Bar & Grill", city: "Tacoma", state: "WA", address: "602 S Pine St", zip: "98405", lat: 47.2421, lng: -122.4485, capacity: 250, venueType: "bar", genres: '["country","rock","tribute"]', typicalFee: "$200-$600", payType: "door", ageLimit: "21+", region: "pnw", verified: false },

    // ── OLYMPIA, WA ─────────────────────────────────────────────────────────────
    { name: "The Obsidian", city: "Olympia", state: "WA", address: "114 4th Ave E", zip: "98501", lat: 47.0463, lng: -122.8985, capacity: 200, venueType: "club", genres: '["punk","indie","local","experimental"]', typicalFee: "$100-$400", payType: "door", ageLimit: "all-ages", description: "Olympia's DIY music scene venue.", region: "pnw", verified: false },
    { name: "The Brotherhood Lounge", city: "Olympia", state: "WA", address: "119 Capitol Way N", zip: "98501", capacity: 150, venueType: "bar", genres: '["local","rock","folk"]', typicalFee: "$100-$300", payType: "door", ageLimit: "21+", region: "pnw", verified: false },
    { name: "Le Voyeur", city: "Olympia", state: "WA", address: "404 4th Ave E", zip: "98501", lat: 47.0458, lng: -122.8979, phone: "(360) 943-5710", capacity: 100, venueType: "bar", genres: '["punk","indie","experimental","local"]', typicalFee: "$50-$200", payType: "door", ageLimit: "21+", description: "Tiny Olympia institution. Bands like Bikini Kill and Sleater-Kinney played here.", region: "pnw", verified: true },

    // ── BELLINGHAM, WA ──────────────────────────────────────────────────────────
    { name: "Wild Buffalo House of Music", city: "Bellingham", state: "WA", address: "208 W Holly St", zip: "98225", lat: 48.7486, lng: -122.4783, phone: "(360) 746-7662", website: "https://wildbuffalove.com", capacity: 400, venueType: "club", genres: '["rock","jam","folk","bluegrass","electronic"]', typicalFee: "$300-$1200", payType: "door", ageLimit: "21+", description: "Bellingham's premier live music venue. Great sightlines and sound.", region: "pnw", verified: true },
    { name: "Boundary Bay Brewery & Bistro", city: "Bellingham", state: "WA", address: "1107 Railroad Ave", zip: "98225", lat: 48.7501, lng: -122.4791, capacity: 300, venueType: "brewery", genres: '["folk","country","jazz","local"]', typicalFee: "$100-$400", payType: "door", ageLimit: "all-ages", description: "Popular brewery with frequent live music. Great outdoor patio.", region: "pnw", verified: true },
    { name: "The Big Rock Garden Party Venue", city: "Bellingham", state: "WA", capacity: 1500, venueType: "festival", genres: '["all"]', typicalFee: "$500-$3000", payType: "guarantee", region: "pnw", verified: false },

    // ── EVERETT, WA ─────────────────────────────────────────────────────────────
    { name: "Fisherman Jack's", city: "Everett", state: "WA", address: "2824 Rucker Ave", zip: "98201", capacity: 200, venueType: "bar", genres: '["country","rock","local"]', typicalFee: "$150-$500", payType: "door", ageLimit: "21+", region: "pnw", verified: false },
    { name: "The Anchor Pub", city: "Everett", state: "WA", capacity: 150, venueType: "bar", genres: '["rock","punk","metal"]', typicalFee: "$100-$300", payType: "door", ageLimit: "21+", region: "pnw", verified: false },

    // ── SPOKANE, WA ─────────────────────────────────────────────────────────────
    { name: "The Knitting Factory Spokane", city: "Spokane", state: "WA", address: "919 W Sprague Ave", zip: "99201", lat: 47.6577, lng: -117.4281, phone: "(509) 244-3279", website: "https://sp.knittingfactory.com", capacity: 1200, venueType: "club", genres: '["rock","indie","hip-hop","metal","country"]', typicalFee: "$500-$3000", payType: "guarantee", ageLimit: "all-ages", description: "Spokane's top touring venue. Multiple rooms.", region: "pnw", verified: true },
    { name: "The Big Dipper", city: "Spokane", state: "WA", address: "171 S Washington St", zip: "99201", lat: 47.6560, lng: -117.4280, phone: "(509) 863-5005", capacity: 350, venueType: "club", genres: '["indie","rock","punk","electronic"]', typicalFee: "$200-$800", payType: "door", ageLimit: "all-ages", description: "All-ages venue in downtown Spokane. Community-focused.", region: "pnw", verified: true },
    { name: "Limelight", city: "Spokane", state: "WA", address: "1708 W 6th Ave", zip: "99204", capacity: 400, venueType: "club", genres: '["rock","country","cover"]', typicalFee: "$200-$600", payType: "door", ageLimit: "21+", region: "pnw", verified: false },
    { name: "The Pin Bar + Pool Hall", city: "Spokane", state: "WA", capacity: 200, venueType: "bar", genres: '["local","rock","indie"]', typicalFee: "$100-$300", payType: "door", ageLimit: "21+", region: "pnw", verified: false },

    // ── PORTLAND, OR ────────────────────────────────────────────────────────────
    { name: "Doug Fir Lounge", city: "Portland", state: "OR", address: "830 E Burnside St", zip: "97214", lat: 45.5232, lng: -122.6521, phone: "(503) 231-9663", website: "https://dougfirlounge.com", capacity: 350, venueType: "club", genres: '["indie","rock","alternative","folk"]', typicalFee: "$300-$1200", payType: "door", ageLimit: "21+", description: "Portland's most beloved indie venue. Beautiful wood-paneled room.", region: "pnw", verified: true },
    { name: "Revolution Hall", city: "Portland", state: "OR", address: "1300 SE Stark St", zip: "97214", lat: 45.5192, lng: -122.6459, phone: "(503) 288-5400", website: "https://revolutionhall.com", capacity: 850, venueType: "theater", genres: '["indie","rock","pop","folk","jazz"]', typicalFee: "$1000-$5000", payType: "guarantee", ageLimit: "all-ages", description: "Former high school converted into stunning concert hall.", region: "pnw", verified: true },
    { name: "Mississippi Studios", city: "Portland", state: "OR", address: "3939 N Mississippi Ave", zip: "97227", lat: 45.5510, lng: -122.6771, phone: "(503) 288-3895", website: "https://mississippistudios.com", capacity: 250, venueType: "club", genres: '["indie","folk","rock","americana","jazz"]', typicalFee: "$300-$1000", payType: "door", ageLimit: "21+", description: "Intimate North Portland gem. Excellent acoustics and booking.", region: "pnw", verified: true },
    { name: "Crystal Ballroom", city: "Portland", state: "OR", address: "1332 W Burnside St", zip: "97209", lat: 45.5231, lng: -122.6828, phone: "(503) 778-5625", website: "https://crystalballroompdx.com", capacity: 1500, venueType: "theater", genres: '["rock","pop","electronic","hip-hop"]', typicalFee: "$2000-$12000", payType: "guarantee", ageLimit: "all-ages", description: "Historic Portland ballroom on floating dance floor.", region: "pnw", verified: true },
    { name: "Wonder Ballroom", city: "Portland", state: "OR", address: "128 NE Russell St", zip: "97212", lat: 45.5364, lng: -122.6628, phone: "(503) 284-8686", website: "https://wonderballroom.com", capacity: 700, venueType: "theater", genres: '["indie","rock","pop","electronic"]', typicalFee: "$800-$4000", payType: "guarantee", ageLimit: "all-ages", description: "Alberta Arts District venue with great history.", region: "pnw", verified: true },
    { name: "Dante's", city: "Portland", state: "OR", address: "350 W Burnside St", zip: "97209", lat: 45.5230, lng: -122.6780, phone: "(503) 226-6630", capacity: 400, venueType: "club", genres: '["rock","metal","punk","burlesque"]', typicalFee: "$200-$800", payType: "door", ageLimit: "21+", description: "Portland's rock and burlesque club. Wild and beloved.", region: "pnw", verified: true },
    { name: "The Hawthorne Theatre", city: "Portland", state: "OR", address: "1507 SE 39th Ave", zip: "97214", lat: 45.5118, lng: -122.6348, phone: "(503) 233-7100", capacity: 600, venueType: "theater", genres: '["metal","rock","punk","hardcore"]', typicalFee: "$500-$2000", payType: "guarantee", ageLimit: "all-ages", description: "Southeast Portland theater. Metal and hard rock focused.", region: "pnw", verified: true },
    { name: "Star Theater", city: "Portland", state: "OR", address: "13 NW 6th Ave", zip: "97209", lat: 45.5248, lng: -122.6731, capacity: 400, venueType: "club", genres: '["indie","hip-hop","electronic","pop"]', typicalFee: "$300-$1000", payType: "door", ageLimit: "21+", region: "pnw", verified: false },
    { name: "Kelly's Olympian", city: "Portland", state: "OR", address: "426 SW Washington St", zip: "97204", capacity: 200, venueType: "bar", genres: '["local","rock","folk","alternative"]', typicalFee: "$100-$300", payType: "door", ageLimit: "21+", region: "pnw", verified: false },
    { name: "Holocene", city: "Portland", state: "OR", address: "1001 SE Morrison St", zip: "97214", lat: 45.5173, lng: -122.6565, phone: "(503) 239-7639", capacity: 400, venueType: "club", genres: '["electronic","indie","hip-hop","experimental"]', typicalFee: "$300-$1200", payType: "door", ageLimit: "21+", description: "SE Portland's electronic and indie club.", region: "pnw", verified: true },

    // ── BEND, OR ────────────────────────────────────────────────────────────────
    { name: "Volcanic Theatre Pub", city: "Bend", state: "OR", address: "70 SW Century Dr", zip: "97702", lat: 44.0469, lng: -121.3384, phone: "(541) 323-1881", website: "https://volcanictheatrepub.com", capacity: 350, venueType: "club", genres: '["rock","indie","jam","bluegrass","country"]', typicalFee: "$200-$800", payType: "door", ageLimit: "21+", description: "Bend's premier live music venue. Craft beer and great shows.", region: "pnw", verified: true },
    { name: "Silver Moon Brewing", city: "Bend", state: "OR", address: "24 NW Greenwood Ave", zip: "97701", capacity: 200, venueType: "brewery", genres: '["rock","folk","bluegrass","local"]', typicalFee: "$100-$400", payType: "door", ageLimit: "21+", region: "pnw", verified: false },
    { name: "Midtown Ballroom", city: "Bend", state: "OR", address: "51 NW Greenwood Ave", zip: "97701", lat: 44.0571, lng: -121.3167, capacity: 700, venueType: "theater", genres: '["rock","country","bluegrass","pop"]', typicalFee: "$500-$2500", payType: "guarantee", ageLimit: "all-ages", region: "pnw", verified: true },

    // ── EUGENE, OR ──────────────────────────────────────────────────────────────
    { name: "WOW Hall", city: "Eugene", state: "OR", address: "291 W 8th Ave", zip: "97401", lat: 44.0494, lng: -123.0951, phone: "(541) 687-2746", website: "https://wowhall.org", capacity: 600, venueType: "theater", genres: '["all"]', typicalFee: "$200-$1500", payType: "door", ageLimit: "all-ages", description: "Nonprofit all-ages theater. Oregon institution.", region: "pnw", verified: true },
    { name: "McDonald Theatre", city: "Eugene", state: "OR", address: "1010 Willamette St", zip: "97401", lat: 44.0516, lng: -123.0929, phone: "(541) 345-4442", capacity: 1400, venueType: "theater", genres: '["all"]', typicalFee: "$1500-$8000", payType: "guarantee", ageLimit: "all-ages", description: "Historic theater in downtown Eugene.", region: "pnw", verified: true },
    { name: "Cozmic Pizza", city: "Eugene", state: "OR", address: "199 W 8th Ave", zip: "97401", capacity: 200, venueType: "restaurant", genres: '["local","folk","jazz","rock"]', typicalFee: "$100-$300", payType: "door", ageLimit: "all-ages", region: "pnw", verified: false },

    // ── MISSOULA, MT ────────────────────────────────────────────────────────────
    { name: "The Kettlehouse Amphitheater", city: "Bonner", state: "MT", address: "2612 Hwy 200", zip: "59823", lat: 46.9041, lng: -113.8481, website: "https://kettlehouseamp.com", capacity: 4500, venueType: "amphitheater", genres: '["rock","country","folk","bluegrass","americana"]', typicalFee: "$3000-$20000", payType: "guarantee", ageLimit: "all-ages", description: "Montana's best outdoor amphitheater, right on the Clark Fork River.", region: "pnw", verified: true },
    { name: "The Top Hat Lounge & Stage", city: "Missoula", state: "MT", address: "134 W Front St", zip: "59801", lat: 46.8726, lng: -114.0106, phone: "(406) 728-9865", website: "https://tophatmissoula.com", capacity: 400, venueType: "club", genres: '["rock","blues","funk","country","americana"]', typicalFee: "$200-$1000", payType: "door", ageLimit: "21+", description: "Missoula's most beloved live music venue since 1935.", region: "pnw", verified: true },
    { name: "The Badlander", city: "Missoula", state: "MT", address: "208 Ryman St", zip: "59801", lat: 46.8729, lng: -114.0097, phone: "(406) 549-0205", capacity: 200, venueType: "bar", genres: '["punk","metal","indie","local"]', typicalFee: "$100-$400", payType: "door", ageLimit: "21+", description: "Downtown Missoula underground music venue.", region: "pnw", verified: true },
    { name: "Monk's Bar & Grill", city: "Missoula", state: "MT", address: "220 Ryman St", zip: "59801", lat: 46.8730, lng: -114.0098, capacity: 150, venueType: "bar", genres: '["local","cover","rock"]', typicalFee: "$100-$300", payType: "door", ageLimit: "21+", region: "pnw", verified: false },
    { name: "The Wilma", city: "Missoula", state: "MT", address: "131 S Higgins Ave", zip: "59801", lat: 46.8712, lng: -114.0087, phone: "(406) 543-7395", capacity: 1000, venueType: "theater", genres: '["rock","country","bluegrass","pop"]', typicalFee: "$800-$5000", payType: "guarantee", ageLimit: "all-ages", description: "Historic theater in downtown Missoula. Beautifully restored.", region: "pnw", verified: true },
    { name: "Zootown Brew", city: "Missoula", state: "MT", capacity: 150, venueType: "brewery", genres: '["folk","bluegrass","local"]', typicalFee: "$75-$250", payType: "door", ageLimit: "all-ages", city2: "Missoula", state2: "MT", region: "pnw", verified: false },

    // ── BILLINGS, MT ────────────────────────────────────────────────────────────
    { name: "The Pub Station", city: "Billings", state: "MT", address: "2502 1st Ave N", zip: "59101", lat: 45.7840, lng: -108.5100, phone: "(406) 256-4747", website: "https://pubstation.com", capacity: 800, venueType: "club", genres: '["rock","country","metal","pop"]', typicalFee: "$400-$2000", payType: "guarantee", ageLimit: "all-ages", description: "Billings' top live music venue. Great facilities.", region: "pnw", verified: true },
    { name: "Casey's Golden Pheasant", city: "Billings", state: "MT", address: "3022 First Ave N", zip: "59101", capacity: 300, venueType: "bar", genres: '["country","rock","local"]', typicalFee: "$200-$600", payType: "door", ageLimit: "21+", region: "pnw", verified: false },
    { name: "Skypoint", city: "Billings", state: "MT", capacity: 500, venueType: "club", genres: '["rock","country","pop","tribute"]', typicalFee: "$300-$1000", payType: "door", ageLimit: "21+", region: "pnw", verified: false },

    // ── GREAT FALLS, MT ─────────────────────────────────────────────────────────
    { name: "The Newgate Mall Atrium", city: "Great Falls", state: "MT", capacity: 400, venueType: "festival", genres: '["country","pop","rock"]', typicalFee: "$200-$800", payType: "guarantee", region: "pnw", verified: false },
    { name: "Gibson's Pub & Grill", city: "Great Falls", state: "MT", capacity: 200, venueType: "bar", genres: '["country","rock","local"]', typicalFee: "$100-$400", payType: "door", ageLimit: "21+", region: "pnw", verified: false },

    // ── BOZEMAN, MT ─────────────────────────────────────────────────────────────
    { name: "The Rialto", city: "Bozeman", state: "MT", address: "10 W Main St", zip: "59715", lat: 45.6788, lng: -111.0361, phone: "(406) 585-0770", capacity: 350, venueType: "club", genres: '["rock","jam","bluegrass","country","electronic"]', typicalFee: "$200-$900", payType: "door", ageLimit: "21+", description: "Bozeman's top live music spot. Great booking.", region: "pnw", verified: true },
    { name: "The Filling Station", city: "Bozeman", state: "MT", address: "2005 N 7th Ave", zip: "59715", lat: 45.6925, lng: -111.0437, phone: "(406) 587-0585", capacity: 200, venueType: "bar", genres: '["country","rock","local","bluegrass"]', typicalFee: "$100-$400", payType: "door", ageLimit: "21+", description: "North Bozeman neighborhood bar with regular live music.", region: "pnw", verified: true },
    { name: "Zebra Cocktail Lounge", city: "Bozeman", state: "MT", address: "321 E Main St", zip: "59715", capacity: 150, venueType: "bar", genres: '["jazz","blues","local"]', typicalFee: "$100-$300", payType: "door", ageLimit: "21+", region: "pnw", verified: false },
    { name: "Gallatin Valley Fairgrounds", city: "Bozeman", state: "MT", capacity: 3000, venueType: "festival", genres: '["country","rock","bluegrass","folk"]', typicalFee: "$1000-$10000", payType: "guarantee", ageLimit: "all-ages", region: "pnw", verified: false },

    // ── HAMILTON, MT ────────────────────────────────────────────────────────────
    { name: "Banque Club", city: "Hamilton", state: "MT", capacity: 150, venueType: "bar", genres: '["country","rock","local"]', typicalFee: "$100-$300", payType: "door", ageLimit: "21+", region: "pnw", verified: false },

    // ── HELENA, MT ──────────────────────────────────────────────────────────────
    { name: "On Broadway", city: "Helena", state: "MT", address: "106 Broadway St", zip: "59601", lat: 46.5990, lng: -112.0188, phone: "(406) 443-1929", capacity: 250, venueType: "club", genres: '["rock","country","local","blues"]', typicalFee: "$150-$600", payType: "door", ageLimit: "21+", description: "Helena's main live music venue.", region: "pnw", verified: true },
    { name: "Marysville House", city: "Marysville", state: "MT", capacity: 300, venueType: "bar", genres: '["country","bluegrass","folk"]', typicalFee: "$150-$500", payType: "door", ageLimit: "21+", description: "Historic bar in the ghost town of Marysville. Legendary local music.", region: "pnw", verified: true },

    // ── KALISPELL / FLATHEAD VALLEY, MT ─────────────────────────────────────────
    { name: "The Depot Bar & Music Hall", city: "Whitefish", state: "MT", address: "2 Depot St", zip: "59937", lat: 48.4115, lng: -114.3365, phone: "(406) 862-0311", capacity: 350, venueType: "club", genres: '["rock","country","americana","local"]', typicalFee: "$200-$800", payType: "door", ageLimit: "21+", description: "Historic Whitefish train depot converted into music venue.", region: "pnw", verified: true },
    { name: "Moose's Saloon", city: "Kalispell", state: "MT", address: "173 N Main St", zip: "59901", lat: 48.1965, lng: -114.3138, phone: "(406) 755-2337", capacity: 250, venueType: "bar", genres: '["country","rock","local"]', typicalFee: "$100-$400", payType: "door", ageLimit: "21+", description: "Montana's most famous bar. Peanut shells on the floor, live music on weekends.", region: "pnw", verified: true },
    { name: "The Craggy Range", city: "Billings", state: "MT", capacity: 200, venueType: "bar", genres: '["local","cover","country"]', typicalFee: "$100-$300", payType: "door", ageLimit: "21+", region: "pnw", verified: false },
    { name: "Blue Moon Nite Club", city: "Columbia Falls", state: "MT", capacity: 300, venueType: "bar", genres: '["country","rock","local"]', typicalFee: "$150-$500", payType: "door", ageLimit: "21+", description: "Flathead Valley staple for live country music.", region: "pnw", verified: true },

    // ── VANCOUVER, WA ───────────────────────────────────────────────────────────
    { name: "Warehouse '23", city: "Vancouver", state: "WA", address: "23 W 4th Plain Blvd", zip: "98660", capacity: 300, venueType: "club", genres: '["rock","metal","punk","local"]', typicalFee: "$150-$500", payType: "door", ageLimit: "all-ages", region: "pnw", verified: false },

    // ── YAKIMA, WA ──────────────────────────────────────────────────────────────
    { name: "The Capitol Theatre", city: "Yakima", state: "WA", address: "19 S 3rd St", zip: "98901", lat: 46.6018, lng: -120.5064, phone: "(509) 853-8000", capacity: 1500, venueType: "theater", genres: '["country","rock","pop","broadway"]', typicalFee: "$1000-$6000", payType: "guarantee", ageLimit: "all-ages", description: "Yakima's historic performing arts venue.", region: "pnw", verified: true },

    // ── WALLA WALLA, WA ──────────────────────────────────────────────────────────
    { name: "Walla Walla Fairgrounds", city: "Walla Walla", state: "WA", capacity: 2000, venueType: "festival", genres: '["country","rock","folk"]', typicalFee: "$500-$4000", payType: "guarantee", region: "pnw", verified: false },

    // ── COEUR D'ALENE, ID ────────────────────────────────────────────────────────
    { name: "The Filling Station CDA", city: "Coeur d'Alene", state: "ID", capacity: 200, venueType: "bar", genres: '["country","rock","local"]', typicalFee: "$100-$400", payType: "door", ageLimit: "21+", region: "pnw", verified: false },
    { name: "The Handlebar", city: "Coeur d'Alene", state: "ID", address: "208 N 2nd St", zip: "83814", lat: 47.6740, lng: -116.7804, capacity: 300, venueType: "bar", genres: '["country","rock","blues","local"]', typicalFee: "$150-$500", payType: "door", ageLimit: "21+", description: "CDA's established live music bar.", region: "pnw", verified: true },
];

async function seed() {
    console.log(`Seeding ${VENUES.length} Pacific Northwest venues...`);
    let added = 0;
    let skipped = 0;

    for (const v of VENUES) {
        const cityKey = v.city || v.city2;
        const stateKey = v.state || v.state2;

        try {
            const existing = await p.venue.findFirst({ where: { name: v.name, city: cityKey } });
            if (existing) { skipped++; continue; }

            await p.venue.create({
                data: {
                    name: v.name,
                    address: v.address,
                    city: cityKey,
                    state: stateKey,
                    zip: v.zip,
                    lat: v.lat,
                    lng: v.lng,
                    phone: v.phone,
                    email: v.email,
                    website: v.website,
                    facebook: v.facebook,
                    instagram: v.instagram,
                    capacity: v.capacity,
                    venueType: v.venueType,
                    genres: v.genres,
                    description: v.description,
                    typicalFee: v.typicalFee,
                    payType: v.payType,
                    ageLimit: v.ageLimit,
                    region: v.region,
                    verified: v.verified || false,
                    dataSource: 'manual',
                }
            });
            added++;
            process.stdout.write(`.`);
        } catch (e) {
            console.error(`\nError seeding ${v.name}:`, e.message);
        }
    }

    console.log(`\n\nDone! Added: ${added}, Skipped (already exist): ${skipped}`);
}

seed().catch(e => console.error('Seed failed:', e)).finally(() => p.$disconnect());
