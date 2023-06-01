import * as Charts from '@oceanbase/charts';
import { sortByMoment } from '@oceanbase/util';
import { isObject } from 'lodash';
import React from 'react';

export type ChartType =
  | 'Bar'
  | 'Column'
  | 'Area'
  | 'GroupBar'
  | 'RangeBar'
  | 'GroupedColumn'
  | 'Gauge'
  | 'Line'
  | 'Pie'
  | 'Radar'
  | 'Ring'
  | 'StackedBar'
  | 'StackColumn'
  | 'StackArea'
  | 'TinyArea'
  | 'TinyColumn'
  | 'TinyLine'
  | 'Progress'
  | 'RingProgress'
  | 'DualAxes';

export interface TooltipScrollProps {
  maxHeight: string;
}

export type TooltipScroll = boolean | TooltipScrollProps;

export interface ChartProps {
  type?: ChartType;
  autoFit?: boolean;
  data?: any[];
  percent?: number;
  title?: React.ReactNode;
  description?: React.ReactNode;
  height?: number;
  xField?: string;
  yField?: string;
  colorField?: string;
  seriesField?: string;
  animation?: boolean;
  meta?: Record<
    string,
    {
      alias?: string;
      formatter?: (value: any) => any;
    }
  >;
  xAxis?: any;
  yAxis?: any;
  legend?: any;
  tooltip?: any;
  interactions?: {
    type: string;
  }[];
  // 图表的 tooltip 是否可进入且可滚动，常用于 tooltip 数过多、需要滚动查看的场景
  tooltipScroll?: TooltipScroll;
  style?: React.CSSProperties;
  className?: string;
}

const Chart: React.FC<ChartProps> = ({
  type = 'Line',
  data,
  xField,
  xAxis,
  yAxis,
  tooltip,
  tooltipScroll,
  style = {},
  ...restProps
}) => {
  let newData = data;
  // 对于折线图和混合图，如果 xAxis 是时间轴，则需要对 data 按照 xField 进行排序
  // issue: https://github.com/antvis/G2/issues/3194
  if (
    (type === 'Line' || type === 'Area') &&
    (xAxis?.type === 'time' || xAxis?.type === 'timeCat')
  ) {
    newData = data?.sort((a, b) => sortByMoment(a, b, xField));
  } else if (
    type === 'DualAxes' &&
    (xAxis?.type === 'time' || xAxis?.type === 'timeCat')
  ) {
    newData = [
      (data && data[0] && data[0].sort((a, b) => sortByMoment(a, b, xField))) ||
        [],
      (data && data[1] && data[1].sort((a, b) => sortByMoment(a, b, xField))) ||
        [],
    ];
  }
  const config = {
    data: newData,
    padding: 'auto',
    autoFit: true,
    xField,
    xAxis,
    yAxis,
    tooltip: {
      ...(tooltipScroll
        ? {
            follow: true,
            shared: true,
            enterable: true,
            // 允许鼠标滑入 tooltip 会导致框选很难选中区间，因此加大鼠标和 tooltip 之间的间距，以缓解该问题
            // issue: https://aone.alipay.com/issue/40683708
            offset: 40,
            domStyles: {
              'g2-tooltip': {
                maxHeight: '164px',
                overflow: 'auto',
                ...(isObject(tooltipScroll)
                  ? (tooltipScroll as TooltipScrollProps)
                  : {}),
              },
            },
          }
        : {}),
      ...tooltip,
    },
    style: {
      // 设置 style 会直接覆盖掉官方默认样式，设置 overflow 为 visible，暂时解决 tooltip 被遮挡的问题
      // issue:https://aone.alipay.com/v2/project/742021/bug/100279157
      height: 'inherit',
      overflow: 'visible',
      ...style,
    },
    ...restProps,
  };
  const ChartComp = Charts[type];
  return <ChartComp {...config} />;
};

export default Chart;
