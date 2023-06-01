import { createFromIconfontCN } from '@ant-design/icons';
import React from 'react';

interface IconFontProps {
  type: string;
  className?: string;
  style?: React.CSSProperties;
}

const CustomIcon = createFromIconfontCN({
  // OceanBase 图标库地址: https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=3786261
  // OCP Express 需要引入本地资源，保证离线环境下自定义图标的可访问性
  scriptUrl: '/js/iconfont.js',
});

export type IconFontType =
  | 'backup'
  | 'backup-colored'
  | 'cluster'
  | 'cluster-colored'
  | 'data-source'
  | 'data-source-colored'
  | 'docs'
  | 'diagnosis'
  | 'diagnosis-colored'
  | 'host'
  | 'host-colored'
  | 'log'
  | 'log-colored'
  | 'migration'
  | 'migration-colored'
  | 'monitor'
  | 'monitor-colored'
  | 'notification'
  | 'obproxy'
  | 'obproxy-colored'
  | 'package'
  | 'package-colored'
  | 'overview'
  | 'overview-colored'
  | 'property'
  | 'property-colored'
  | 'tenant'
  | 'tenant-colored'
  | 'sync'
  | 'sync-colored'
  | 'system'
  | 'system-colored'
  | 'user';

const IconFont = (props: IconFontProps) => {
  const { type, className, ...restProps } = props;
  return <CustomIcon type={type} className={className} {...restProps} />;
};

export default IconFont;
