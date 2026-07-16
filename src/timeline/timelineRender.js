import { getCategoryColors } from "./colors.js";
import { topTimeline, bottomTimeline, topItems, topGroups, bottomItems, bottomGroups } from "./timeline.js";
import { setBothTimelineWindows } from "./timelineSync.js";
import { refreshTimelineSearch, updateCurrentSearchRecords } from "./timelineSearch.js";

export let currentRows = [];
export let resetViewRange = null;

export function renderRows(rows, shouldFitBoth = true) {
  const previousWindow = topTimeline.getWindow();

  currentRows = rows.map((row) => ({ ...row }));

  const topRows = currentRows.filter(
    (row) => row.side === "top",
  );

  const bottomRows = currentRows.filter(
    (row) => row.side === "bottom",
  );

  const topItemValues = createItems(topRows, "top");
  const bottomItemValues = createItems(bottomRows, "bottom");

  replaceDataSet(topGroups, createGroups(topRows));
  replaceDataSet(bottomGroups, createGroups(bottomRows));
  replaceDataSet(topItems, topItemValues);
  replaceDataSet(bottomItems, bottomItemValues);

  const newSearchRecords = [
    ...topItemValues.map((item) => ({
      row: item,
      itemId: item.id,
      side: "top",
    })),
    ...bottomItemValues.map((item) => ({
      row: item,
      itemId: item.id,
      side: "bottom",
    })),
  ];
  
  updateCurrentSearchRecords(newSearchRecords);

  resetViewRange = getFullDateRange(currentRows);
  refreshTimelineSearch();

  requestAnimationFrame(() => {
    topTimeline.redraw();
    bottomTimeline.redraw();

    requestAnimationFrame(() => {
      if (shouldFitBoth && resetViewRange) {
        setBothTimelineWindows(
          resetViewRange.start,
          resetViewRange.end,
          false,
        );
        return;
      }

      setBothTimelineWindows(
        previousWindow.start,
        previousWindow.end,
        false,
      );
    });
  });
}

function replaceDataSet(dataSet, values) {
  dataSet.clear();
  if (values.length > 0) {
    dataSet.add(values);
  }
}

function createGroups(rows) {
  return [...new Set(rows.map((row) => row.category))].map(
    (groupName, index) => ({
      id: groupName,
      content: groupName,
      order: index + 1,
    }),
  );
}

function createItems(rows, prefix) {
  return rows.map((row, index) => {
    const id = `${prefix}-${index + 1}`;
    const colors = getCategoryColors(row.category);

    return {
      ...row,
      id,
      content: row.title,
      start: row.date,
      group: row.category,
      category: row.category,
      style: [
        `--category-background:${colors.background}`,
        `--category-border:${colors.border}`,
        `--category-text:${colors.text}`,
      ].join(";"),
      _timelineItemId: id,
      _timelineSide: prefix,
    };
  });
}

function getFullDateRange(rows) {
  if (rows.length === 0) {
    return null;
  }

  const timestamps = rows
    .map((row) => new Date(`${row.date}T00:00:00`).getTime())
    .filter(Number.isFinite);

  if (timestamps.length === 0) {
    return null;
  }

  const start = new Date(Math.min(...timestamps));
  const end = new Date(Math.max(...timestamps));

  start.setMonth(start.getMonth() - 6);
  end.setMonth(end.getMonth() + 6);

  return { start, end };
}
