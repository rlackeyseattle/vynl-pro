import { NextRequest, NextResponse } from "next/server";

const RSS_FEEDS = [
    { url: "https://www.rollingstone.com/music/music-news/feed/", source: "Rolling Stone", category: "Music News" },
    { url: "https://pitchfork.com/rss/news/", source: "Pitchfork", category: "Music News" },
    { url: "https://www.billboard.com/feed/", source: "Billboard", category: "Industry" },
    { url: "https://www.nme.com/news/music/feed", source: "NME", category: "Music News" },
    { url: "https://consequence.net/feed/", source: "Consequence", category: "Music News" },
    { url: "https://www.musicradar.com/feeds/all", source: "MusicRadar", category: "Tech & Gear" },
    { url: "https://www.pollstar.com/rss", source: "Pollstar", category: "Touring" },
];

let cache: { items: NewsItem[]; ts: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 min

interface NewsItem {
    id: string;
    title: string;
    source: string;
    url: string;
    image?: string;
    publishedAt: string;
    category: string;
    description?: string;
}

async function parseFeed(feedUrl: string, source: string, category: string): Promise<NewsItem[]> {
    try {
        const res = await fetch(feedUrl, {
            headers: { "User-Agent": "VYNL.PRO/1.0 RSS Reader" },
            signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) return [];
        const text = await res.text();

        const items: NewsItem[] = [];
        const itemRx = /<item>([\s\S]*?)<\/item>/g;
        let m;
        while ((m = itemRx.exec(text)) !== null && items.length < 8) {
            const block = m[1];
            const title = block.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1]?.trim() || "";
            const link = block.match(/<link>(.*?)<\/link>/)?.[1]?.trim()
                || block.match(/<guid[^>]*>(https?[^<]+)<\/guid>/)?.[1]?.trim() || "";
            const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]?.trim() || "";
            const desc = block.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1]
                ?.replace(/<[^>]+>/g, "")?.trim()?.slice(0, 200) || "";
            const imgUrl = block.match(/<media:content[^>]+url="([^"]+)"/)?.[1]
                || block.match(/<enclosure[^>]+url="([^"]+)"/)?.[1]
                || block.match(/<img[^>]+src="([^"]+)"/)?.[1] || undefined;

            if (title && link) {
                items.push({
                    id: `${source}-${Buffer.from(link).toString("base64").slice(0, 12)}`,
                    title,
                    source,
                    url: link,
                    image: imgUrl,
                    publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
                    category,
                    description: desc,
                });
            }
        }
        return items;
    } catch {
        return [];
    }
}

export async function GET(req: NextRequest) {
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "30");
    const categoryFilter = req.nextUrl.searchParams.get("category");

    // Serve from cache if fresh
    if (cache && Date.now() - cache.ts < CACHE_TTL) {
        let items = cache.items;
        if (categoryFilter && categoryFilter !== "All") {
            items = items.filter(i => i.category === categoryFilter);
        }
        return NextResponse.json({ items: items.slice(0, limit) });
    }

    // Fetch all feeds in parallel
    const results = await Promise.all(
        RSS_FEEDS.map(f => parseFeed(f.url, f.source, f.category))
    );

    const all = results.flat().sort((a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    cache = { items: all, ts: Date.now() };

    let items = all;
    if (categoryFilter && categoryFilter !== "All") {
        items = items.filter(i => i.category === categoryFilter);
    }

    return NextResponse.json({ items: items.slice(0, limit) });
}
