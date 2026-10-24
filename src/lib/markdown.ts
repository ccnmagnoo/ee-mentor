import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { parse as parseYaml } from 'yaml';

export function stripFrontmatter(markdown: string): string {
  if (!markdown.startsWith('---')) return markdown;
  const end = markdown.indexOf('\n---', 3);
  if (end === -1) return markdown;
  return markdown.slice(end + 4).replace(/^\r?\n/, '');
}

export function parseFrontmatter(markdown: string): Record<string, unknown> {
  if (!markdown.startsWith('---')) return {};
  const end = markdown.indexOf('\n---', 3);
  if (end === -1) return {};
  try {
    const result = parseYaml(markdown.slice(3, end));
    return typeof result === 'object' && result !== null
      ? (result as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

export function renderMarkdown(markdown: string): string {
  const raw = marked.parse(stripFrontmatter(markdown), {
    async: false,
    gfm: true,
    breaks: false,
  }) as string;

  return sanitizeHtml(raw, {
    allowedTags: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'p',
      'ul',
      'ol',
      'li',
      'strong',
      'em',
      'del',
      'code',
      'pre',
      'blockquote',
      'hr',
      'br',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'a',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      th: ['align'],
      td: ['align'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', {
        target: '_blank',
        rel: 'noopener noreferrer',
      }),
    },
  });
}

export function htmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function reportStandaloneHtml(markdown: string, title: string): string {
  const body = renderMarkdown(markdown);
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${htmlEscape(title)}</title>
<style>
  :root { --ink:#0f2e2a; --muted:#5b6f6b; --line:#dbe5e2; --accent:#0f766e; --soft:#f4f8f7; }
  * { box-sizing: border-box; }
  body { margin:0; background:#eef3f2; color:var(--ink); font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height:1.65; }
  main { max-width: 900px; margin: 32px auto; background:#fff; padding: 56px 64px; border-radius: 12px; box-shadow: 0 10px 40px rgba(15,46,42,.08); }
  h1 { font-size:1.9rem; line-height:1.2; letter-spacing:-.02em; margin: 0 0 .4em; }
  h2 { font-size:1.35rem; margin-top:2.1em; padding-top:.6em; border-top:1px solid var(--line); }
  h3 { font-size:1.08rem; margin-top:1.6em; color:var(--accent); }
  h4 { font-size:.98rem; margin-top:1.3em; }
  p, li { font-size:.94rem; }
  table { width:100%; border-collapse:collapse; margin:1.2em 0; font-size:.86rem; }
  th, td { border:1px solid var(--line); padding:.5em .65em; text-align:left; vertical-align:top; }
  th { background:var(--soft); font-weight:600; }
  a { color:var(--accent); }
  hr { border:none; border-top:1px solid var(--line); margin:2em 0; }
  code { background:var(--soft); padding:.1em .3em; border-radius:4px; font-size:.85em; }
  blockquote { border-left:3px solid var(--accent); margin:1em 0; padding:.2em 1em; color:var(--muted); }
  @media print {
    body { background:#fff; }
    main { max-width:none; margin:0; padding:0; box-shadow:none; border-radius:0; }
    h2, h3 { break-after: avoid; }
    table, pre, blockquote { break-inside: avoid; }
    a { color:inherit; text-decoration:none; }
    @page { margin: 18mm 16mm; }
  }
</style>
</head>
<body>
<main>
${body}
</main>
</body>
</html>`;
}
