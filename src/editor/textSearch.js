import { elements } from "../ui/dom.js";
import { setStatus } from "../ui/status.js";

// 独立维护文本搜索模块的状态
export let textSearchMatches = [];
export let textSearchIndex = -1;
let textSearchComposing = false;

export function setupTextSearchAndReplace() {
  elements.textSearchInput.addEventListener(
    "compositionstart",
    () => {
      textSearchComposing = true;
    },
  );

  elements.textSearchInput.addEventListener(
    "compositionend",
    () => {
      textSearchComposing = false;
      refreshTextSearch();
    },
  );

  elements.textSearchInput.addEventListener("input", () => {
    if (!textSearchComposing) {
      refreshTextSearch();
    }
  });

  elements.csvLiveEditor.addEventListener("input", () => {
    refreshTextSearch();
  });

  elements.textSearchRun.addEventListener(
    "click",
    executeTextSearch,
  );

  elements.textSearchPrevious.addEventListener("click", () => {
    showPreviousTextSearchMatch();
  });

  elements.textSearchNext.addEventListener("click", () => {
    showNextTextSearchMatch();
  });

  elements.textSearchInput.addEventListener(
    "keydown",
    (event) => {
      if (
        event.isComposing ||
        textSearchComposing ||
        event.key !== "Enter"
      ) {
        return;
      }

      event.preventDefault();
      executeTextSearch();
    },
  );
}

export function executeTextSearch() {
  refreshTextSearch();

  if (textSearchMatches.length === 0) {
    setStatus("没有找到匹配的 CSV 文本。", "error");
    return;
  }

  showTextSearchMatch(0);
}

export function refreshTextSearch() {
  const query = elements.textSearchInput.value;
  const text = elements.csvLiveEditor.value;

  textSearchMatches = [];
  textSearchIndex = -1;

  if (!query) {
    updateTextSearchCounter();
    return;
  }

  const lowerText = text.toLocaleLowerCase();
  const lowerQuery = query.toLocaleLowerCase();

  let searchFrom = 0;

  while (searchFrom <= lowerText.length) {
    const foundAt = lowerText.indexOf(
      lowerQuery,
      searchFrom,
    );

    if (foundAt === -1) {
      break;
    }

    textSearchMatches.push({
      start: foundAt,
      end: foundAt + query.length,
    });

    searchFrom =
      foundAt +
      Math.max(query.length, 1);
  }

  updateTextSearchCounter();
}

export function updateTextSearchIndex(index) {
  textSearchIndex = index;
}

export function showNextTextSearchMatch() {
  if (textSearchMatches.length === 0) {
    return;
  }

  showTextSearchMatch(
    textSearchIndex < 0
      ? 0
      : textSearchIndex + 1,
  );
}

export function showPreviousTextSearchMatch() {
  if (textSearchMatches.length === 0) {
    return;
  }

  showTextSearchMatch(
    textSearchIndex < 0
      ? textSearchMatches.length - 1
      : textSearchIndex - 1,
  );
}

export function showTextSearchMatch(index) {
  if (textSearchMatches.length === 0) {
    return;
  }

  const newIndex =
    (index + textSearchMatches.length) %
    textSearchMatches.length;
    
  updateTextSearchIndex(newIndex);

  const match = textSearchMatches[textSearchIndex];

  elements.csvLiveEditor.focus();

  elements.csvLiveEditor.setSelectionRange(
    match.start,
    match.end,
  );

  scrollTextareaSelectionIntoView(
    elements.csvLiveEditor,
    match.start,
  );

  updateTextSearchCounter();
}

export function updateTextSearchCounter() {
  const current =
    textSearchIndex >= 0
      ? textSearchIndex + 1
      : 0;

  elements.textSearchCounter.textContent =
    `${current} / ${textSearchMatches.length}`;
}

function scrollTextareaSelectionIntoView(
  textarea,
  selectionStart,
) {
  const textBefore = textarea.value.slice(
    0,
    selectionStart,
  );

  const lineCount = textBefore.split("\n").length;

  const computedStyle = window.getComputedStyle(textarea);

  const lineHeight =
    Number.parseFloat(computedStyle.lineHeight) || 20;

  textarea.scrollTop = Math.max(
    0,
    (lineCount - 3) * lineHeight,
  );
}
