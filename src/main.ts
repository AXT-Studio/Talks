import { decks } from "@ayaexptech/presen-it/decks";
import { toTalks, type Talk } from "./talks.ts";

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: { className?: string; text?: string } = {},
  ...children: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (props.className) node.className = props.className;
  if (props.text !== undefined) node.textContent = props.text;
  node.append(...children);
  return node;
}

function visuallyHidden(text: string): HTMLSpanElement {
  return el("span", { className: "visually-hidden", text });
}

function renderTalk(talk: Talk): HTMLLIElement {
  const article = el("article", { className: "talk" });
  article.style.setProperty("--hue", String(talk.hue));

  // Decorative miniature of the deck, coloured with its own theme and hue.
  const thumb = el("div", { className: "media thumb" });
  thumb.dataset.theme = talk.theme;
  thumb.style.setProperty("--ratio", talk.aspectRatio);
  thumb.setAttribute("aria-hidden", "true");

  const titleLink = el("a", { className: "card-link", text: talk.title });
  titleLink.href = talk.url;
  const header = el("header", {}, el("h3", { className: "talk-title" }, titleLink));

  const meta: Node[] = [];
  if (talk.date) {
    const time = el("time", { text: talk.date.label });
    if (talk.date.datetime) time.dateTime = talk.date.datetime;
    meta.push(el("span", { className: "talk-date" }, visuallyHidden("講演日："), time));
  }
  if (talk.event) {
    meta.push(el("span", { className: "talk-event" }, visuallyHidden("イベント："), talk.event));
  }
  meta.push(
    el(
      "span",
      { className: "talk-slides" },
      visuallyHidden("スライド枚数："),
      `${talk.slideCount}枚`,
    ),
  );
  header.append(el("p", { className: "talk-meta" }, ...meta));

  article.append(thumb, header);
  if (talk.description) {
    article.append(el("p", { className: "talk-description", text: talk.description }));
  }

  const open = el(
    "a",
    { className: "action action-primary" },
    "スライドを開く",
    visuallyHidden(`：${talk.title}`),
  );
  open.href = talk.url;
  const source = el(
    "a",
    { className: "action" },
    "Markdownソース",
    visuallyHidden(`：${talk.title}`),
  );
  source.href = talk.sourceUrl;
  article.append(el("footer", { className: "talk-footer" }, open, source));

  return el("li", {}, article);
}

const talks = toTalks(decks);
const list = document.querySelector<HTMLOListElement>("#talks");
const empty = document.querySelector<HTMLElement>("#talks-empty");
const count = document.querySelector<HTMLElement>("#talk-count");

if (list && empty && count) {
  list.replaceChildren(...talks.map(renderTalk));
  list.hidden = talks.length === 0;
  empty.hidden = talks.length > 0;
  count.hidden = talks.length === 0;
  count.textContent = `${talks.length}件`;
}
