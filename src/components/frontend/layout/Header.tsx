'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLUListElement>(null);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const navItems = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/about', label: 'Hakkımızda' },
    { href: '/projects', label: 'Projeler' },
    { href: '/properties', label: 'Gayrimenkul' },
    { href: '/contact', label: 'İletişim' },
  ];

  useEffect(() => {
    const updateIndicator = () => {
      if (!navRef.current) return;

      const activeLink = navRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeLink) {
        const padding = 16;
        setIndicatorStyle({
          left: activeLink.offsetLeft + padding / 2,
          width: activeLink.offsetWidth - padding,
        });
      }
    };

    const timer = setTimeout(updateIndicator, 50);
    window.addEventListener('resize', updateIndicator);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [pathname]);

  return (
    <nav className="fixed top-0 z-50 w-full bg-surface start-0">
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl p-4 mx-auto">
        <Link href="/" className="flex items-center">
          <img
            src="/logo.svg"
            alt="Aydınlar İnşaat"
            className="h-10 sm:h-12 md:h-14 w-auto"
          />
        </Link>

        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center justify-center w-10 h-10 p-2 text-sm text-hero rounded-lg md:hidden hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-hero/20"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="sr-only">Ana menüyü aç</span>
          <div className="relative w-6 h-6 flex flex-col justify-center items-center">
            <span
              className={`absolute h-0.5 w-6 bg-hero transform transition-all duration-300 ease-in-out ${
                isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
              }`}
            />
            <span
              className={`absolute h-0.5 w-6 bg-hero transition-all duration-300 ease-in-out ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute h-0.5 w-6 bg-hero transform transition-all duration-300 ease-in-out ${
                isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
              }`}
            />
          </div>
        </button>

        <div
          className={`${
            isMenuOpen
              ? 'max-h-screen opacity-100'
              : 'max-h-0 opacity-0 md:max-h-screen md:opacity-100'
          } w-full md:block md:w-auto overflow-hidden transition-all duration-300 ease-in-out`}
          id="navbar-default"
        >
          <ul
            ref={navRef}
            className="relative flex flex-col p-2 mt-4 font-medium rounded-lg md:p-0 md:flex-row md:mt-0 bg-surface md:bg-transparent"
          >
            <li
              className="hidden md:block absolute bottom-2 h-0.5 bg-hero rounded-full transition-all duration-600 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
              aria-hidden="true"
            />

            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  data-active={isActive(item.href)}
                  className={`block px-4 py-3 md:px-5 md:py-4 rounded-lg md:rounded-none transition-all duration-300 ${
                    isActive(item.href)
                      ? 'text-text-white bg-hero md:text-hero md:bg-transparent font-semibold'
                      : 'text-hero bg-surface md:bg-transparent hover:bg-surface-hover md:hover:bg-transparent md:hover:text-hero/70'
                  }`}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
