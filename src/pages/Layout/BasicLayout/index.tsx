import { useBasicMenu } from '@/hooks/useMenu';
import { BasicLayout as OBUIBasicLayout } from '@oceanbase/ui';
import type { BasicLayoutProps as OBUIBasicLayoutProps } from '@oceanbase/ui/es/BasicLayout';
import { find } from 'lodash';
import React from 'react';
import { Outlet, useLocation } from 'umi';
import './index.less';

type BasicLayoutProps = OBUIBasicLayoutProps;

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const { pathname } = useLocation();

  const menus = useBasicMenu();
  const defaultOpenKey = find(menus, (item) =>
    // 只要子菜单的路径与 pathname 相对应，则当前菜单默认展开
    // 当前只支持一级菜单的默认展开，不过也可以满足需求了，因为现在并没有 >= 三级菜单的场景
    (item.children || []).map((child) => child.link).includes(pathname),
  )?.link;

  return (
    <OBUIBasicLayout
      location={location}
      menus={menus}
      defaultOpenKeys={defaultOpenKey ? [defaultOpenKey] : []}
      topHeader={{
        username: 'admin',
        userMenu: null,
        showLocale: false,
        showHelp: false,
      }}
      {...props}
    >
      <Outlet />
    </OBUIBasicLayout>
  );
};

export default BasicLayout;
