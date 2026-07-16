import { escapeHtml } from "../utils/html.js";
import { formatDate } from "../utils/date.js";

/*
 * Tooltip 不应显示的内部字段。
 *
 * 这些字段由程序或 vis-timeline 使用，
 * 不属于用户 CSV 中需要展示的事件信息。
 */
export const TOOLTIP_INTERNAL_KEYS = new Set([
  "id",
  "title",
  "content",
  "date",
  "start",
  "category",
  "group",
  "side",

  // 仅用于事件配色，不属于事件信息。
  "style",

  // 程序内部使用。
  "_timelineItemId",
  "_timelineSide",
]);

export function createTooltip(item) {
  /*
   * 第一行：事件名目。
   */
  const title = escapeHtml(
    item.title ??
    item.content ??
    "",
  );

  /*
   * 第二行：日期 · 分类。
   */
  const date = formatDate(
    item.date ??
    item.start,
  );

  const category = escapeHtml(
    item.category ??
    item.group ??
    "",
  );

  /*
   * 后续行：
   *
   * 读取用户数据中的其它非空字段。
   * 字段名称保持 CSV 中的原文，不进行翻译。
   */
  const extraLines = [];

  for (
    const [key, value]
    of Object.entries(item)
  ) {
    /*
     * 跳过标题、日期、分类以及程序内部字段。
     */
    if (
      TOOLTIP_INTERNAL_KEYS.has(key)
    ) {
      continue;
    }

    /*
     * 空值不显示，也不预留空行。
     */
    if (
      value === null ||
      value === undefined ||
      String(value).trim() === ""
    ) {
      continue;
    }

    extraLines.push(
      `<div><span>${escapeHtml(key)}：</span>${escapeHtml(value)}</div>`,
    );
  }

  return `
    <div class="timeline-tooltip">
      <span>${title}</span>
      <div>${date} · ${category}</div>
      ${extraLines.join("")}
    </div>
  `;
}
