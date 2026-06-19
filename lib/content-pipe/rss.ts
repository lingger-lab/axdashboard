const RSS_FEEDS = [
  "https://news.google.com/rss/search?q=AI+%EC%B0%BD%EC%97%85+%EC%88%98%EC%9D%B5%EB%AA%A8%EB%8D%B8&hl=ko&gl=KR&ceid=KR:ko",
  "https://news.google.com/rss/search?q=AI+%EC%86%8C%EC%83%81%EA%B3%B5%EC%9D%B8+%EC%9E%90%EB%8F%99%ED%99%94&hl=ko&gl=KR&ceid=KR:ko",
  "https://news.google.com/rss/search?q=AI+side+hustle+small+business&hl=en&gl=US&ceid=US:en",
];

export interface RssItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

/**
 * Google News RSS에서 최근 48시간 이내 기사를 가져온다.
 * 정규식으로 XML 파싱 (외부 의존성 없음).
 */
export async function fetchNewsFromRSS(): Promise<RssItem[]> {
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const allItems: RssItem[] = [];

  for (const feedUrl of RSS_FEEDS) {
    try {
      const res = await fetch(feedUrl, {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(10_000),
      });

      if (!res.ok) continue;

      const xml = await res.text();
      const items = parseRssXml(xml);

      for (const item of items) {
        const pubTime = new Date(item.pubDate).getTime();
        if (pubTime >= cutoff) {
          allItems.push(item);
        }
      }
    } catch {
      // 개별 피드 실패 시 다음 피드로 계속 진행
      continue;
    }
  }

  // 중복 링크 제거 후 최대 20개
  const seen = new Set<string>();
  const unique: RssItem[] = [];
  for (const item of allItems) {
    if (!seen.has(item.link)) {
      seen.add(item.link);
      unique.push(item);
    }
  }

  return unique.slice(0, 20);
}

function parseRssXml(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const title = extractTag(block, "title");
    const link = extractTag(block, "link");
    const pubDate = extractTag(block, "pubDate");
    const source = extractTag(block, "source") || "";

    if (title && link) {
      items.push({
        title: decodeHtmlEntities(title),
        link,
        pubDate: pubDate || new Date().toISOString(),
        source: decodeHtmlEntities(source),
      });
    }
  }

  return items;
}

function extractTag(xml: string, tag: string): string | null {
  // CDATA 지원
  const cdataRegex = new RegExp(
    `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`,
  );
  const cdataMatch = cdataRegex.exec(xml);
  if (cdataMatch) return cdataMatch[1].trim();

  const simpleRegex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`);
  const simpleMatch = simpleRegex.exec(xml);
  if (simpleMatch) return simpleMatch[1].trim();

  return null;
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}
