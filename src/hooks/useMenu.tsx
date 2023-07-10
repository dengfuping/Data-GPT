import IconFont from '@/components/IconFont';
import type { MenuItem } from '@oceanbase/ui/es/BasicLayout';
import { Lottie } from '@oceanbase/ui';
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
