import type { PresenitDeck } from "@ayaexptech/presen-it/decks";
import { describe, expect, test } from "vite-plus/test";
import { isHiddenInList, parseTalkDate, readText, toSourceUrl, toTalks } from "./talks.ts";

function deck(overrides: Partial<PresenitDeck> & Pick<PresenitDeck, "route">): PresenitDeck {
  return {
    url: `/Talks${overrides.route}`,
    source: `src${overrides.route}index.md`,
    title: "Untitled",
    description: "",
    slideCount: 1,
    theme: "light",
    hue: 210,
    width: 1920,
    height: 1080,
    frontmatter: {},
    ...overrides,
  };
}

describe("parseTalkDate", () => {
  test("parses YYYY-MM-DD", () => {
    expect(parseTalkDate("2026-11-12")).toEqual({
      label: "2026年11月12日",
      datetime: "2026-11-12",
      sortKey: Date.UTC(2026, 10, 12),
    });
  });

  test("accepts other separators and an ISO time part", () => {
    expect(parseTalkDate("2026/1/5")?.datetime).toBe("2026-01-05");
    expect(parseTalkDate("2026-11-12T00:00:00.000Z")?.datetime).toBe("2026-11-12");
  });

  test("keeps unparsable text as a label without sorting", () => {
    expect(parseTalkDate("2026年秋")).toEqual({
      label: "2026年秋",
      datetime: undefined,
      sortKey: undefined,
    });
    expect(parseTalkDate("2026-02-30")?.sortKey).toBeUndefined();
  });

  test("omits missing or empty values", () => {
    expect(parseTalkDate(undefined)).toBeUndefined();
    expect(parseTalkDate("  ")).toBeUndefined();
    expect(parseTalkDate(20261112)).toBeUndefined();
  });
});

test("readText trims and omits empty values", () => {
  expect(readText(" Tech Conf 2026 ")).toBe("Tech Conf 2026");
  expect(readText("")).toBeUndefined();
  expect(readText(null)).toBeUndefined();
});

test("toSourceUrl builds a GitHub blob URL", () => {
  expect(toSourceUrl("src/slides/my-talk/index.md")).toBe(
    "https://github.com/AXT-Studio/Talks/blob/main/src/slides/my-talk/index.md",
  );
  expect(toSourceUrl("src/slides/日本語 talk/index.md")).toBe(
    "https://github.com/AXT-Studio/Talks/blob/main/src/slides/%E6%97%A5%E6%9C%AC%E8%AA%9E%20talk/index.md",
  );
});

test("toTalks sorts newest first and keeps undated talks last in path order", () => {
  const talks = toTalks([
    deck({ route: "/slides/a/" }),
    deck({ route: "/slides/b/", frontmatter: { date: "2025-06-01" } }),
    deck({ route: "/slides/c/", frontmatter: { date: "2026-11-12", event: "Conf" } }),
    deck({ route: "/slides/d/", frontmatter: { date: "未定" } }),
  ]);
  expect(talks.map((talk) => talk.key)).toEqual([
    "/slides/c/",
    "/slides/b/",
    "/slides/a/",
    "/slides/d/",
  ]);
  expect(talks[0]?.event).toBe("Conf");
  expect(talks[0]?.url).toBe("/Talks/slides/c/");
});

test("toTalks handles zero decks", () => {
  expect(toTalks([])).toEqual([]);
});

test("isHiddenInList accepts only the boolean true", () => {
  expect(isHiddenInList(true)).toBe(true);
  expect(isHiddenInList(false)).toBe(false);
  expect(isHiddenInList("true")).toBe(false);
  expect(isHiddenInList(undefined)).toBe(false);
});

test("toTalks omits decks with hideInList: true", () => {
  const talks = toTalks([
    deck({ route: "/slides/visible/" }),
    deck({ route: "/slides/hidden/", frontmatter: { hideInList: true, date: "2026-11-12" } }),
    deck({ route: "/slides/shown/", frontmatter: { hideInList: false } }),
  ]);
  expect(talks.map((talk) => talk.key)).toEqual(["/slides/visible/", "/slides/shown/"]);
});
