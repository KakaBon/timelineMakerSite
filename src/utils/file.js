const DEFAULT_CSV_FILE_NAME = "test-data.csv";

export function createFileTimestamp() {
  const now = new Date();
  const pad = (value) =>
    String(value).padStart(2, "0");

  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    "_",
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join("");
}

export function createCopyFileName(originalName, timestamp) {
  const safeName = String(
    originalName || DEFAULT_CSV_FILE_NAME,
  );

  const dotIndex = safeName.lastIndexOf(".");

  if (dotIndex <= 0) {
    return `${safeName}_副本_${timestamp}.csv`;
  }

  return (
    `${safeName.slice(0, dotIndex)}` +
    `_副本_${timestamp}` +
    `${safeName.slice(dotIndex)}`
  );
}
