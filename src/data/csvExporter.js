import { parseCsv } from "./csvParser.js";
import { elements } from "../ui/dom.js";
import { setStatus, reportError } from "../ui/status.js";
import { renderRows } from "../timeline/timelineRender.js";
import { createFileTimestamp, createCopyFileName } from "../utils/file.js";
import { currentCsvFileName } from "./csvLoader.js";

export function applyEditorChanges() {
  const csvText = elements.csvLiveEditor.value;

  if (!csvText.trim()) {
    setStatus("当前编辑区没有文本内容，无法应用。", "error");
    return;
  }

  try {
    const rows = parseCsv(csvText);

    renderRows(rows, false);

    setStatus(
      `应用修改成功，当前时间轴已渲染 ${rows.length} 个事件。`,
      "success",
    );
  } catch (error) {
    reportError(
      error,
      "CSV 数据格式存在错误，请检查后重试。",
      "解析失败：",
    );
  }
}

export function downloadCurrentCsvCopy() {
  const csvText = elements.csvLiveEditor.value;

  if (!csvText.trim()) {
    setStatus("编辑区无有效数据，无法导出。", "error");
    return;
  }

  try {
    const utf8Text = csvText.startsWith("\uFEFF")
      ? csvText
      : `\uFEFF${csvText}`;

    const blob = new Blob([utf8Text], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = createCopyFileName(
      currentCsvFileName,
      createFileTimestamp(),
    );

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 0);

    setStatus("已生成并下载当前 CSV 副本。", "success");
  } catch (error) {
    reportError(error, "下载 CSV 副本时发生异常。");
  }
}
