import { elements } from "../ui/dom.js";
import { setStatus } from "../ui/status.js";
import { topTimeline, bottomTimeline } from "./timeline.js";
import { setBothTimelineWindows } from "./timelineSync.js";

const TIMELINE_SEARCH_IGNORED_KEYS = new Set([
  "id",
  "content",
  "start",
  "group",
  "category",
  "side",
  "_timelineItemId",
  "_timelineSide",
]);

export let currentSearchRecords = [];
export let timelineSearchMatches = [];
export let timelineSearchIndex = -1;
let timelineSearchComposing = false;

export function updateCurrentSearchRecords(records) {
  currentSearchRecords = records;
}

export function setupTimelineSearch() {
  elements.timelineSearchInput.addEventListener(
    "compositionstart",
    () => {
      timelineSearchComposing = true;
    },
  );

  elements.timelineSearchInput.addEventListener(
    "compositionend",
    () => {
      timelineSearchComposing = false;
      refreshTimelineSearch();
    },
  );

  elements.timelineSearchInput.addEventListener("input", () => {
    if (!timelineSearchComposing) {
      refreshTimelineSearch();
    }
  });

  elements.timelineSearchRun.addEventListener(
    "click",
    executeTimelineSearch,
  );

  elements.timelineSearchPrevious.addEventListener("click", () => {
    showPreviousTimelineSearchMatch();
  });

  elements.timelineSearchNext.addEventListener("click", () => {
    showNextTimelineSearchMatch();
  });

  elements.timelineSearchInput.addEventListener(
    "keydown",
    (event) => {
      if (
        event.isComposing ||
        timelineSearchComposing ||
        event.key !== "Enter"
      ) {
        return;
      }

      event.preventDefault();
      executeTimelineSearch();
    },
  );
}

export function executeTimelineSearch() {
  refreshTimelineSearch();

  if (timelineSearchMatches.length === 0) {
    setStatus("没有找到匹配的时间轴事件。", "error");
    return;
  }

  showTimelineSearchMatch(0);
}

export function refreshTimelineSearch() {
  const query = elements.timelineSearchInput.value
    .trim()
    .toLocaleLowerCase();

  clearTimelineSelections();
  timelineSearchIndex = -1;

  if (!query) {
    timelineSearchMatches = [];
    updateTimelineSearchCounter();
    return;
  }

  timelineSearchMatches = currentSearchRecords.filter((record) =>
    recordMatchesTimelineQuery(record.row, query),
  );

  updateTimelineSearchCounter();
}

function recordMatchesTimelineQuery(row, query) {
  return Object.entries(row).some(([key, value]) => {
    if (TIMELINE_SEARCH_IGNORED_KEYS.has(key)) {
      return false;
    }

    if (value === null || value === undefined) {
      return false;
    }

    return String(value)
      .toLocaleLowerCase()
      .includes(query);
  });
}

export function showNextTimelineSearchMatch() {
  if (timelineSearchMatches.length === 0) {
    return;
  }

  showTimelineSearchMatch(
    timelineSearchIndex < 0
      ? 0
      : timelineSearchIndex + 1,
  );
}

export function showPreviousTimelineSearchMatch() {
  if (timelineSearchMatches.length === 0) {
    return;
  }

  showTimelineSearchMatch(
    timelineSearchIndex < 0
      ? timelineSearchMatches.length - 1
      : timelineSearchIndex - 1,
  );
}

export function showTimelineSearchMatch(index) {
  if (timelineSearchMatches.length === 0) {
    return;
  }

  timelineSearchIndex =
    (index + timelineSearchMatches.length) %
    timelineSearchMatches.length;

  const match = timelineSearchMatches[timelineSearchIndex];

  focusTimelineSearchMatch(match);
  updateTimelineSearchCounter();
}

function focusTimelineSearchMatch(match) {
  const targetDate = new Date(`${match.row.date}T00:00:00`);

  if (Number.isNaN(targetDate.getTime())) {
    setStatus("匹配事件的日期无效，无法定位。", "error");
    return;
  }

  const currentWindow = topTimeline.getWindow();

  const currentSpan =
    currentWindow.end.getTime() -
    currentWindow.start.getTime();

  const safeSpan =
    Number.isFinite(currentSpan) && currentSpan > 0
      ? currentSpan
      : 1000 * 60 * 60 * 24 * 365 * 4;

  const halfSpan = safeSpan / 2;

  setBothTimelineWindows(
    new Date(targetDate.getTime() - halfSpan),
    new Date(targetDate.getTime() + halfSpan),
    true,
  );

  if (match.side === "top") {
    topTimeline.setSelection([match.itemId], {
      focus: false,
    });

    bottomTimeline.setSelection([]);
  } else {
    bottomTimeline.setSelection([match.itemId], {
      focus: false,
    });

    topTimeline.setSelection([]);
  }

  window.setTimeout(() => {
    revealSelectedTimelineItem(match.side);
  }, 380);

  setStatus(
    `已定位匹配结果 ${timelineSearchIndex + 1} / ${timelineSearchMatches.length}。`,
    "success",
  );
}

function revealSelectedTimelineItem(side) {
  const container =
    side === "top"
      ? elements.topContainer
      : elements.bottomContainer;

  const selectedItem = container.querySelector(
    ".vis-item.vis-selected",
  );

  if (!selectedItem) {
    return;
  }

  selectedItem.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
  });
}

export function clearTimelineSelections() {
  topTimeline.setSelection([]);
  bottomTimeline.setSelection([]);
}

export function updateTimelineSearchCounter() {
  const current =
    timelineSearchIndex >= 0
      ? timelineSearchIndex + 1
      : 0;

  elements.timelineSearchCounter.textContent =
    `${current} / ${timelineSearchMatches.length}`;
}
