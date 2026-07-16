import { topTimeline, bottomTimeline } from "./timeline.js";

export let isSynchronizing = false;

export function setupTimelineSynchronization() {
  topTimeline.on("rangechange", ({ start, end }) => {
    synchronizeOneTimeline(bottomTimeline, start, end);
  });

  bottomTimeline.on("rangechange", ({ start, end }) => {
    synchronizeOneTimeline(topTimeline, start, end);
  });
}

export function synchronizeOneTimeline(targetTimeline, start, end) {
  if (isSynchronizing) {
    return;
  }

  isSynchronizing = true;

  try {
    targetTimeline.setWindow(start, end, {
      animation: false,
    });
  } finally {
    isSynchronizing = false;
  }
}

export function setBothTimelineWindows(start, end, animated = false) {
  isSynchronizing = true;

  try {
    const animation = animated
      ? {
          duration: 350,
          easingFunction: "easeInOutQuad",
        }
      : false;

    topTimeline.setWindow(start, end, { animation });
    bottomTimeline.setWindow(start, end, { animation });
  } finally {
    isSynchronizing = false;
  }
}
