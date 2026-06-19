/**
 * URL에서 기사 본문 텍스트를 추출한다.
 * HTML 태그 제거 후 최대 3000자로 제한.
 * 실패 시 null 반환 (파이프라인 차단하지 않음).
 */
export async function scrapeUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AXDashboard/1.0; +https://enterlab.co.kr)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(10_000),
      redirect: "follow",
    });

    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) return null;

    const html = await res.text();
    return extractText(html);
  } catch {
    return null;
  }
}

function extractText(html: string): string | null {
  // <script>, <style>, <nav>, <header>, <footer> 등 불필요 요소 제거
  let cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<aside[\s\S]*?<\/aside>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // <article> 또는 <main> 영역이 있으면 해당 영역만 사용
  const articleMatch = /<article[\s\S]*?>([\s\S]*?)<\/article>/i.exec(cleaned);
  const mainMatch = /<main[\s\S]*?>([\s\S]*?)<\/main>/i.exec(cleaned);
  const bodyMatch = /<body[\s\S]*?>([\s\S]*?)<\/body>/i.exec(cleaned);

  const content = articleMatch?.[1] || mainMatch?.[1] || bodyMatch?.[1] || cleaned;

  // HTML 태그 제거 후 텍스트만 추출
  const text = content
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length < 50) return null;

  return text.slice(0, 3000);
}
