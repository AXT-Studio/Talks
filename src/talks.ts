import type { PresenitDeck } from "@ayaexptech/presen-it/decks";

/** Base URL for viewing a deck's Markdown source on GitHub. */
export const SOURCE_BASE_URL = "https://github.com/AXT-Studio/Talks/blob/main/";

export interface TalkDate {
  /** Text shown to readers, e.g. `2026年11月12日`. */
  readonly label: string;
  /** Machine-readable value for `<time datetime>`; `undefined` when the date could not be parsed. */
  readonly datetime: string | undefined;
  /** UTC timestamp used for sorting; `undefined` when the date could not be parsed. */
  readonly sortKey: number | undefined;
}

export interface Talk {
  readonly key: string;
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly sourceUrl: string;
  readonly slideCount: number;
  readonly theme: "light" | "dark";
  readonly hue: number;
  /** Slide aspect ratio as a CSS value, e.g. `1920 / 1080`. */
  readonly aspectRatio: string;
  readonly date: TalkDate | undefined;
  readonly event: string | undefined;
}

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "long",
  timeZone: "UTC",
});

const DATE_PATTERN = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[T\s].*)?$/;

/**
 * Reads the custom `date` frontmatter key.
 * Accepts `YYYY-MM-DD` (also `/` or `.` separators, with an optional time part).
 * Any other non-empty string is shown as-is but not used for sorting.
 */
export function parseTalkDate(value: unknown): TalkDate | undefined {
  if (typeof value !== "string") return undefined;
  const text = value.trim();
  if (text === "") return undefined;

  const match = DATE_PATTERN.exec(text);
  if (match) {
    const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
    const time = Date.UTC(year, month - 1, day);
    const date = new Date(time);
    if (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    ) {
      return {
        label: dateFormatter.format(date),
        datetime: date.toISOString().slice(0, 10),
        sortKey: time,
      };
    }
  }
  return { label: text, datetime: undefined, sortKey: undefined };
}

/** Reads an optional free-text frontmatter key such as `event`. */
export function readText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const text = value.trim();
  return text === "" ? undefined : text;
}

/** True when frontmatter `hideInList` is the boolean `true`. */
export function isHiddenInList(value: unknown): boolean {
  return value === true;
}

/** Builds the GitHub URL of a deck's Markdown from `deck.source`. */
export function toSourceUrl(source: string): string {
  const path = source.replaceAll("\\", "/").replace(/^\.?\/+/, "");
  return SOURCE_BASE_URL + path.split("/").map(encodeURIComponent).join("/");
}

export function toTalk(deck: PresenitDeck): Talk {
  return {
    key: deck.route,
    title: deck.title,
    description: deck.description.trim(),
    url: deck.url,
    sourceUrl: toSourceUrl(deck.source),
    slideCount: deck.slideCount,
    theme: deck.theme,
    hue: deck.hue,
    aspectRatio: `${deck.width} / ${deck.height}`,
    date: parseTalkDate(deck.frontmatter.date),
    event: readText(deck.frontmatter.event),
  };
}

/**
 * Newest first. Talks without a sortable date come last and keep
 * Presen'it!'s Markdown path order (Array#sort is stable).
 */
export function compareTalks(a: Talk, b: Talk): number {
  const ka = a.date?.sortKey;
  const kb = b.date?.sortKey;
  if (ka !== undefined && kb !== undefined) return kb - ka;
  if (ka !== undefined) return -1;
  if (kb !== undefined) return 1;
  return 0;
}

export function toTalks(decks: readonly PresenitDeck[]): Talk[] {
  return decks
    .filter((deck) => !isHiddenInList(deck.frontmatter.hideInList))
    .map(toTalk)
    .sort(compareTalks);
}
