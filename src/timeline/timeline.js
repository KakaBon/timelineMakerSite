import { Timeline, DataSet } from "vis-timeline/standalone";
import { elements } from "../ui/dom.js";
import { createTooltip } from "./tooltip.js";

// 在这里统一创建和管理数据集状态，供其他文件单向引用
export const topItems = new DataSet([]);
export const topGroups = new DataSet([]);
export const bottomItems = new DataSet([]);
export const bottomGroups = new DataSet([]);

const sharedOptions = {
  start: "2014-01-01",
  end: "2027-01-01",
  stack: true,
  groupOrder: "order",
  groupHeightMode: "fixed",
  moveable: true,
  zoomable: true,
  horizontalScroll: true,
  verticalScroll: true,
  zoomKey: "ctrlKey",

  margin: {
    axis: 52,
    item: {
      horizontal: 18,
      vertical: 12,
    },
  },

  tooltip: {
    followMouse: true,
    delay: 150,
    template(item) {
      return createTooltip(item);
    },
  },
};

// 实例化上下时间轴
export const topTimeline = new Timeline(
  elements.topContainer,
  topItems,
  topGroups,
  {
    ...sharedOptions,
    height: "620px",
    orientation: {
      axis: "bottom",
      item: "bottom",
    },
  },
);

export const bottomTimeline = new Timeline(
  elements.bottomContainer,
  bottomItems,
  bottomGroups,
  {
    ...sharedOptions,
    height: "560px",
    orientation: {
      axis: "top",
      item: "top",
    },
  },
);
