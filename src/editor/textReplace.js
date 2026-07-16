import { elements } from "../ui/dom.js";
import { setStatus } from "../ui/status.js";
import { escapeRegExp } from "../utils/regex.js";
import { textSearchMatches, textSearchIndex, refreshTextSearch } from "./textSearch.js";

export function setupTextReplaceActions() {
  elements.textReplaceInput.addEventListener(
    "keydown",
    (event) => {
      if (event.isComposing || event.key !== "Enter") {
        return;
      }

      event.preventDefault();
      replaceCurrentTextMatch();
    },
  );

  elements.replaceCurrentButton.addEventListener(
    "click",
    replaceCurrentTextMatch,
  );

  elements.replaceAllButton.addEventListener(
    "click",
    replaceAllTextMatches,
  );
}

export function replaceCurrentTextMatch() {
  if (textSearchMatches.length === 0) {
    refreshTextSearch();
  }

  if (textSearchMatches.length === 0) {
    setStatus("当前没有可替换的文本匹配结果。", "error");
    return;
  }

  const activeIndex =
    textSearchIndex >= 0
      ? textSearchIndex
      : 0;

  const match = textSearchMatches[activeIndex];
  const replacement = elements.textReplaceInput.value;
  const text = elements.csvLiveEditor.value;

  elements.csvLiveEditor.value =
    text.slice(0, match.start) +
    replacement +
    text.slice(match.end);

  refreshTextSearch();

  setStatus(
    "已替换当前匹配文本；点击“应用修改”后时间轴才会更新。",
    "success",
  );
}

export function replaceAllTextMatches() {
  const query = elements.textSearchInput.value;

  if (!query) {
    setStatus("请先输入要查找的文本。", "error");
    return;
  }

  const replacement = elements.textReplaceInput.value;
  const originalText = elements.csvLiveEditor.value;

  const expression = new RegExp(
    escapeRegExp(query),
    "gi",
  );

  const replacedText = originalText.replace(
    expression,
    replacement,
  );

  if (replacedText === originalText) {
    setStatus("没有找到可替换的文本。", "error");
    return;
  }

  elements.csvLiveEditor.value = replacedText;
  refreshTextSearch();

  setStatus(
    "已完成全部替换；点击“应用修改”后时间轴才会更新。",
    "success",
  );
}
