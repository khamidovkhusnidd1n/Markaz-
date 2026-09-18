export const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a relative path, we prepend the API base URL.
  // Note: VITE_API_URL might be "http://localhost:8000/api" so we need to be careful.
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const stripHtml = (html: string | null | undefined): string => {
  if (!html) return '';
  
  if (typeof DOMParser !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const text = doc.body.textContent || doc.body.innerText || '';
      return text.replace(/\s+/g, ' ').trim();
    } catch (e) {
      // fallback to regex
    }
  }

  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&lsquo;/gi, "‘")
    .replace(/&rsquo;/gi, "’")
    .replace(/&ldquo;/gi, "“")
    .replace(/&rdquo;/gi, "”")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#\d+;/g, (match) => {
      const num = parseInt(match.slice(2, -1), 10);
      return isNaN(num) ? '' : String.fromCharCode(num);
    })
    .replace(/\s+/g, ' ')
    .trim();
};
