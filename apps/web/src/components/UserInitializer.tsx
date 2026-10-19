'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import useUserStore from '../../core/userState';

export default function UserInitializer() {
  const { setUserAsync, loadTheme } = useUserStore();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.includes('/twitter-callback')) {
      loadTheme();
      return;
    }

    loadTheme();
    setUserAsync();
  }, [setUserAsync, loadTheme, pathname]);

  return null;
}