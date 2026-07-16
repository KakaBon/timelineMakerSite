import "vis-timeline/styles/vis-timeline-graph2d.css";
import "./style.css";

import { elements } from "./ui/dom.js";
import { validateRequiredElements } from "./ui/validator.js";
import { setupTimelineSynchronization } from "./timeline/timelineSync.js";
import { setupShiftWheelNavigation } from "./timeline/timelineNavigation.js";
import { setupTimelineSearch } from "./timeline/timelineSearch.js";
import { setupTextSearchAndReplace } from "./editor/textSearch.js";
import { setupTextReplaceActions } from "./editor/textReplace.js";
import { handleExternalCsvImport, loadDefaultCsv } from "./data/csvLoader.js";
import { applyEditorChanges, downloadCurrentCsvCopy } from "./data/csvExporter.js";

// 1. 优先进行 DOM 安全检查
validateRequiredElements(elements);

// 2. 统一部署核心交互行为的绑定
function setupMainActions() {
  elements.importCsvButton.addEventListener("click", () => {
    elements.fileInput.click();
  });

  elements.fileInput.addEventListener(
    "change",
    handleExternalCsvImport,
  );

  elements.loadDefaultButton.addEventListener(
    "click",
    loadDefaultCsv,
  );

  elements.applyChangesButton.addEventListener(
    "click",
    applyEditorChanges,
  );

  elements.downloadCsvButton.addEventListener(
    "click",
    downloadCurrentCsvCopy,
  );
}

// 3. 驱动所有相互独立的业务子脚本完成初始化绑定
setupTimelineSynchronization();
setupShiftWheelNavigation();
setupMainActions();
setupTimelineSearch();
setupTextSearchAndReplace();
setupTextReplaceActions();

// 4. 执行应用首次加载生命周期流程
loadDefaultCsv();
