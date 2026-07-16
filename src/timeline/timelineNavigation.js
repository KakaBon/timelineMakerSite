import { elements } from "../ui/dom.js";
import { setStatus } from "../ui/status.js";
import { topTimeline } from "./timeline.js";
import { setBothTimelineWindows } from "./timelineSync.js";
import { clearTimelineSelections } from "./timelineSearch.js";
import { resetViewRange } from "./timelineRender.js";

const SHIFT_WHEEL_MOVE_RATIO = 0.18;

export function setupShiftWheelNavigation() {
  const handleShiftWheel = (event) => {
    if (!event.shiftKey) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const windowRange = topTimeline.getWindow();
    const span =
      windowRange.end.getTime() -
      windowRange.start.getTime();

    if (!Number.isFinite(span) || span <= 0) {
      return;
    }

    const rawDirection =
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;

    const direction = Math.sign(rawDirection);

    if (direction === 0) {
      return;
    }

    const movement =
      span *
      SHIFT_WHEEL_MOVE_RATIO *
      direction;

    const nextStart = new Date(
      windowRange.start.getTime() + movement,
    );

    const nextEnd = new Date(
      windowRange.end.getTime() + movement,
    );

    setBothTimelineWindows(
      nextStart,
      nextEnd,
      false,
    );
  };

  elements.topContainer.addEventListener(
    "wheel",
    handleShiftWheel,
    { passive: false },
  );

  elements.bottomContainer.addEventListener(
    "wheel",
    handleShiftWheel,
    { passive: false },
  );
}

export function resetTimelineView() {
  if (!resetViewRange) {
    setStatus("当前没有可用于重置视图的数据。", "error");
    return;
  }

  clearTimelineSelections();

  setBothTimelineWindows(
    resetViewRange.start,
    resetViewRange.end,
    true,
  );

  setStatus("已恢复当前数据的完整时间视图。", "success");
}

// 绑定视图重置按钮
elements.resetViewButton.addEventListener(
  "click",
  resetTimelineView,
);
