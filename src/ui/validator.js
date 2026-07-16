export function validateRequiredElements(elementMap) {
  const missingNames = Object.entries(elementMap)
    .filter(([, element]) => !element)
    .map(([name]) => name);

  if (missingNames.length > 0) {
    throw new Error(
      `页面中缺少必要元素：${missingNames.join(", ")}`,
    );
  }
}
