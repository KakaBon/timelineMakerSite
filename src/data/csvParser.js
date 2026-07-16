const REQUIRED_COLUMNS = [
  "date",
  "title",
  "side",
];

export function parseCsv(csvText) {
  const normalizedText = csvText
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  const lines = normalizedText
    .split("\n")
    .filter((line) => line.trim() !== "");

  if (lines.length < 2) {
    throw new Error("CSV 中没有可读取的数据。");
  }

  const headers = parseCsvLine(lines[0]).map(
    (header) => header.trim().toLowerCase(),
  );

  /*
   * date、title、side 必须存在。
   */
  const missingColumns = REQUIRED_COLUMNS.filter(
    (column) => !headers.includes(column),
  );

  if (missingColumns.length > 0) {
    throw new Error(
      `CSV 缺少必要列：${missingColumns.join(", ")}`,
    );
  }

  /*
   * 分类列允许叫 category，也允许叫 group。
   * 两者至少存在一个。
   */
  const hasCategoryColumn =
    headers.includes("category");

  const hasGroupColumn =
    headers.includes("group");

  if (!hasCategoryColumn && !hasGroupColumn) {
    throw new Error(
      "CSV 缺少分类列：需要 category 或 group。",
    );
  }

  return lines
    .slice(1)
    .map((line, index) => {
      const values = parseCsvLine(line);

      const rawRow = Object.fromEntries(
        headers.map((header, columnIndex) => [
          header,
          (values[columnIndex] ?? "").trim(),
        ]),
      );

      /*
       * 在这里统一分类字段。
       *
       * CSV 使用 category：
       * rawRow.category 有内容。
       *
       * CSV 使用 group：
       * rawRow.group 有内容。
       *
       * 进入程序以后全部统一叫 category。
       */
      const category =
        rawRow.category?.trim() ||
        rawRow.group?.trim() ||
        "";

      const normalizedRow = {
        ...rawRow,
        date: rawRow.date,
        title: rawRow.title,
        category,
        side: normalizeSide(rawRow.side),
      };

      validateRow(
        normalizedRow,
        index + 2,
      );

      return normalizedRow;
    });
}

function validateRow(row, lineNumber) {
  if (!row.date) {
    throw new Error(
      `CSV 第 ${lineNumber} 行缺少 date。`,
    );
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date)) {
    throw new Error(
      `CSV 第 ${lineNumber} 行日期格式错误：${row.date}`,
    );
  }

  if (!row.title) {
    throw new Error(
      `CSV 第 ${lineNumber} 行缺少 title。`,
    );
  }

  /*
   * 到这里时，无论原表头是 category 还是 group，
   * 分类内容都已经统一存进 row.category。
   */
  if (!row.category) {
    throw new Error(
      `CSV 第 ${lineNumber} 行缺少分类内容。`,
    );
  }

  if (!["top", "bottom"].includes(row.side)) {
    throw new Error(
      `CSV 第 ${lineNumber} 行 side 必须是 top 或 bottom。`,
    );
  }
}

function normalizeSide(value) {
  const side = String(value ?? "")
    .trim()
    .toLowerCase();

  if (
    side === "bottom" ||
    side === "下方"
  ) {
    return "bottom";
  }

  if (
    side === "top" ||
    side === "上方"
  ) {
    return "top";
  }

  return side;
}

function parseCsvLine(line) {
  const values = [];
  let currentValue = "";
  let insideQuotes = false;

  for (
    let index = 0;
    index < line.length;
    index += 1
  ) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"') {
      if (
        insideQuotes &&
        nextCharacter === '"'
      ) {
        currentValue += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }

      continue;
    }

    if (
      character === "," &&
      !insideQuotes
    ) {
      values.push(currentValue);
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  values.push(currentValue);

  return values;
}