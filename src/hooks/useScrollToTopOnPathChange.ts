import { useLayoutEffect, useRef } from 'react';
import { scrollToTop } from '@/lib/scrollToTop';

export function useScrollToTopOnPathChange(pathname: string) {
  const previousPathname = useRef(pathname);

  useLayoutEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    if (window.location.hash) return;
    scrollToTop('instant');
  }, [pathname]);
}
