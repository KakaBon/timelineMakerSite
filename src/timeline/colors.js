export function getCategoryColors(category) {
  const text = String(category ?? "");

  let hash = 0;

  for (let index = 0; index < text.length; index += 1) {
    hash =
      text.charCodeAt(index) +
      ((hash << 5) - hash);

    hash |= 0;
  }

  /*
   * 使用黄金角色相间隔。
   * 即使 A、B、C、D 的哈希值相邻，
   * 生成的颜色也会明显分开。
   */
  const hue =
    ((hash * 137.508) % 360 + 360) % 360;

  return {
    background: `hsl(${hue}, 72%, 94%)`,
    border: `hsl(${hue}, 58%, 62%)`,
    text: `hsl(${hue}, 48%, 27%)`,
  };
}
