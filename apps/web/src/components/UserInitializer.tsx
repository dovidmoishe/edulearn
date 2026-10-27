'use client';

import { useEffect } from 'react';
import useUserStore from '../../core/userState';

export default function UserInitializer() {
  const { setUserAsync, loadTheme } = useUserStore();

  useEffect(() => {
    loadTheme();
    setUserAsync();
  }, [setUserAsync, loadTheme]);

  return null;
}