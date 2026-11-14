'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps, MouseEvent } from 'react';
import { scrollToTop } from '@/lib/scrollToTop';

type NavLinkProps = Omit<ComponentProps<typeof Link>, 'href' | 'scroll'> & {
  href: string;
};

function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
  );
}

export function NavLink({ href, onClick, ...props }: NavLinkProps) {
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (pathname === href && isPlainLeftClick(event)) scrollToTop('smooth');
  };

  return <Link {...props} href={href} scroll={false} onClick={handleClick} />;
}
