import IconFont from '@/components/IconFont';
import type { MenuItem } from '@oceanbase/design/es/BasicLayout';
import { Lottie } from '@oceanbase/design';
import React from 'react';

export const useBasicMenu = (): MenuItem[] => {
  return [
    {
      link: '/instance',
      title: '实例',
      icon: <IconFont type="cluster" />,
      selectedIcon: <IconFont type="cluster-colored" />,
    },
    {
      link: '/chat',
      title: 'Chat',
      icon: <IconFont type="overview" />,
      selectedIcon: (
        <Lottie path="/lottie/overview.json" mode="icon" speed={3} />
      ),
    },
  ];
};
