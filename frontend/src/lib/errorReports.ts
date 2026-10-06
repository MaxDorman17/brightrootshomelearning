import { ERRORS_DSN, STATS_HOSTS } from "@/lib/site";

/**
 * Tells the owner when a page breaks, by sending a short report to our own GlitchTip server.
 *
 * A report holds the error's name and message, where in the code it happened, the page's path
 * and the browser type. It never holds anything a family typed, their names, cookies, or
 * anything after a "?" in the address. Long codes in the path (private links) are blanked out.
 */

const MAX_PER_VISIT = 5;
let sent = 0;
const seen = new Set<string>();

function endpoint(): string | null {
  try {
    const dsn = new URL(ERRORS_DSN);
    const project = dsn.pathname.replace(/\//g, "");
    if (!dsn.username || !project) return null;
    return `${dsn.protocol}//${dsn.host}/api/${project}/store/?sentry_version=7&sentry_key=${dsn.username}&sentry_client=brightroots-web/1.0`;
  } catch {
    return null;
  }
}

/** The page's path with private-looking parts removed: /newsletter/confirm/abc123… becomes /newsletter/confirm/:code */
export function safePath(pathname: string): string {
  return pathname
    .split("/")
    .map((part) => (part.length >= 16 && /^[A-Za-z0-9_.~-]+$/.test(part) ? ":code" : part))
    .join("/");
}

function frames(stack: string) {
  // "at name (https://site/_next/file.js:12:34)" or "name@https://site/file.js:12:34"
  const parsed = [];
  for (const line of stack.split("\n")) {
    const match = line.match(/^\s*(?:at\s+)?(.*?)[\s@(]*((?:https?|webpack-internal):\/\/[^\s)]+?):(\d+):(\d+)\)?\s*$/);
    if (!match) continue;
    parsed.push({
      function: match[1] || "?",
      filename: match[2].split("?")[0],
      lineno: Number(match[3]),
      colno: Number(match[4]),
    });
  }
  return parsed.reverse(); // oldest call first, as the server expects
}

export function buildReport(error: unknown, where: string) {
  const err = error instanceof Error ? error : new Error(typeof error === "string" ? error : "Unknown error");
  const path = safePath(window.location.pathname);
  return {
    event_id: crypto.randomUUID().replace(/-/g, ""),
    timestamp: new Date().toISOString(),
    platform: "javascript",
    level: "error",
    logger: "website",
    transaction: path,
    tags: { where, path },
    request: { url: window.location.origin + path, headers: { "User-Agent": navigator.userAgent } },
    exception: {
      values: [
        {
          type: err.name || "Error",
          value: String(err.message || "").slice(0, 500),
          // Only a real error knows where it happened. For a bare message the stack would be this file's own, which misleads.
          stacktrace: { frames: error instanceof Error ? frames(err.stack || "") : [] },
        },
      ],
    },
  };
}

export function reportError(error: unknown, where = "page") {
  try {
    if (typeof window === "undefined" || !STATS_HOSTS.includes(window.location.hostname)) return;
    const url = endpoint();
    if (!url || sent >= MAX_PER_VISIT) return;
    const report = buildReport(error, where);
    const first = report.exception.values[0];
    const key = `${first.type}:${first.value}`;
    if (seen.has(key)) return;
    seen.add(key);
    sent += 1;
    // text/plain keeps this a "simple" request, so the browser sends it without a pre-check.
    fetch(url, { method: "POST", body: JSON.stringify(report), headers: { "Content-Type": "text/plain" }, keepalive: true }).catch(
      () => {}
    );
  } catch {
    // Reporting must never cause a second problem.
  }
}
