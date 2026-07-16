import { parseCsv } from "./csvParser.js";
import { elements } from "../ui/dom.js";
import { setStatus, reportError } from "../ui/status.js";
import { renderRows } from "../timeline/timelineRender.js";
import { refreshTextSearch } from "../editor/textSearch.js";

const DEFAULT_CSV_FILE_NAME = "test-data.csv";

// 外部状态桥接，让 main.js 可以读取或更新文件名
export let currentCsvFileName = DEFAULT_CSV_FILE_NAME;

export function updateCurrentCsvFileName(name) {
  currentCsvFileName = name;
}

export async function handleExternalCsvImport(event) {
  const selectedFile = event.target.files?.[0];

  if (!selectedFile) {
    return;
  }

  try {
    setStatus(`正在解析外部文件 ${selectedFile.name}……`);

    const csvText = await selectedFile.text();
    const rows = parseCsv(csvText);

    updateCurrentCsvFileName(selectedFile.name);
    elements.csvLiveEditor.value = csvText;

    renderRows(rows, true);
    refreshTextSearch();

    setStatus(
      `成功导入 ${selectedFile.name}，共 ${rows.length} 个事件。`,
      "success",
    );
  } catch (error) {
    reportError(error, "外部 CSV 编码或结构有误。");
  } finally {
    elements.fileInput.value = "";
  }
}

export async function loadDefaultCsv() {
  try {
    setStatus(`正在从项目根目录读取 ${DEFAULT_CSV_FILE_NAME}……`);

    const response = await fetch(`/${DEFAULT_CSV_FILE_NAME}`);

    if (!response.ok) {
      throw new Error(
        `未能找到根目录 ${DEFAULT_CSV_FILE_NAME}，请确认文件位置。`,
      );
    }

    const csvText = await response.text();
    const rows = parseCsv(csvText);

    updateCurrentCsvFileName(DEFAULT_CSV_FILE_NAME);
    elements.csvLiveEditor.value = csvText;

    renderRows(rows, true);
    refreshTextSearch();

    setStatus("已成功同步默认测试数据。", "success");
  } catch (error) {
    reportError(error, "读取默认测试数据时发生异常。");
  }
}
