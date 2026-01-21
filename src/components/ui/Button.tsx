'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'link' | 'scroll' | 'logout' | 'login' | 'plain' | 'delete' | 'save' | 'add' | 'cancel' | 'back';
  size?: 'default' | 'small';
  rounded?: boolean;
  children?: React.ReactNode;
  href?: string;
  showArrow?: boolean;
  loading?: boolean;
  scaleOnHover?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'plain',
  size = 'default',
  rounded = false,
  children,
  href,
  showArrow = true,
  loading = false,
  scaleOnHover = false,
  className = '',
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (href) {
      window.location.href = href;
    }
    if (onClick) {
      onClick(e);
    }
  };

  const baseStyles = 'p-0 m-0 border-none cursor-pointer font-inherit transition-all duration-300 shadow-sm hover:shadow-lg';

  const linkStyles = size === 'default'
    ? `relative flex font-semibold gap-2 items-center text-base group bg-hero text-text-white px-5 py-2.5 ${rounded ? 'rounded-3xl' : 'rounded-xl'} hover:opacity-90`
    : `relative flex font-semibold gap-2 items-center text-sm group bg-hero text-text-white px-4 py-2 ${rounded ? 'rounded-3xl' : 'rounded-xl'} hover:opacity-90`;

  const scrollStyles = 'block bg-transparent border-none cursor-pointer outline-none p-0 m-0 relative w-48 h-[61px] max-[900px]:w-40 max-[900px]:h-[51px]';

  const logoutStyles = `flex items-center justify-center px-4 py-2 ${rounded ? 'rounded-3xl' : 'rounded-xl'} bg-danger hover:bg-danger-hover text-text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed`;

  const loginStyles = `flex items-center justify-center w-full py-3 px-4 ${rounded ? 'rounded-3xl' : 'rounded-xl'} bg-admin-primary hover:bg-admin-primary-hover text-text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-primary disabled:opacity-50 disabled:cursor-not-allowed`;

  const saveStyles = `flex items-center justify-center px-4 py-2 ${rounded ? 'rounded-3xl' : 'rounded-xl'} bg-success hover:bg-success-hover text-text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed`;

  const deleteStyles = `flex items-center justify-center px-4 py-2 ${rounded ? 'rounded-3xl' : 'rounded-xl'} bg-danger hover:bg-danger-hover text-text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed`;

  const plainStyles = `px-5 py-2.5 ${rounded ? 'rounded-3xl' : 'rounded-xl'} bg-surface text-text-secondary border border-border font-medium hover:border-border-dark disabled:opacity-50 disabled:cursor-not-allowed`;

  const addStyles = `flex items-center justify-center px-4 py-2 ${rounded ? 'rounded-3xl' : 'rounded-xl'} bg-admin-primary hover:bg-admin-primary-hover text-text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed`;

  const cancelStyles = `flex items-center justify-center px-4 py-2 ${rounded ? 'rounded-3xl' : 'rounded-xl'} bg-text-tertiary hover:bg-text-secondary text-text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed`;

  const backStyles = `relative flex gap-2 items-center justify-center py-3 px-4 ${rounded ? 'rounded-3xl' : 'rounded-xl'} bg-admin-primary hover:bg-admin-primary-hover text-text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-primary disabled:opacity-50 disabled:cursor-not-allowed group`;

  const variantStyles = {
    link: linkStyles,
    scroll: scrollStyles,
    logout: logoutStyles,
    login: loginStyles,
    delete: deleteStyles,
    save: saveStyles,
    plain: plainStyles,
    add: addStyles,
    cancel: cancelStyles,
    back: backStyles,
  };

  const scaleClass = scaleOnHover ? 'hover:scale-105' : '';
  const buttonClass = `${baseStyles} ${variantStyles[variant]} ${scaleClass} ${className}`.trim();

  return (
    <button
      className={buttonClass}
      onClick={handleClick}
      {...props}
    >
      {variant === 'link' ? (
        <>
          <p className="m-0 relative text-text-white text-inherit before:absolute before:content-[attr(data-text)] before:w-0 before:inset-0 before:text-primary-bg-hover before:overflow-hidden before:transition-all before:duration-300 before:ease-out group-hover:before:w-full after:absolute after:content-[''] after:w-0 after:left-0 after:-bottom-[3px] after:bg-primary-bg-hover after:h-[2px] after:transition-all after:duration-300 after:ease-out group-hover:after:w-full">
            {children}
          </p>
          {showArrow && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`text-text-white transition-all duration-200 delay-200 relative shrink-0 group-hover:translate-x-1 group-hover:text-primary-bg-hover ${
                size === 'default' ? 'w-[18px] h-[18px]' : 'w-[14px] h-[14px]'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          )}
        </>
      ) : variant === 'scroll' ? (
        <>
          <svg
            className="w-48 h-[61px] block m-0 p-0 max-[900px]:w-40 max-[900px]:h-[51px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 160.7 61.5"
          >
            <path
              className="fill-surface"
              d="M80.3,61.5c0,0,22.1-2.7,43.1-5.4s41-5.4,36.6-5.4c-21.7,0-34.1-12.7-44.9-25.4S95.3,0,80.3,0c-15,0-24.1,12.7-34.9,25.4S22.3,50.8,0.6,50.8c-4.3,0-6.5,0,3.5,1.3S36.2,56.1,80.3,61.5z"
            ></path>
          </svg>
          <svg
            className="w-[1.2em] text-[1.5em] text-black absolute bottom-3 left-1/2 -translate-x-1/2 z-[2] max-[900px]:text-[1.2em] max-[900px]:bottom-[3px] group-hover:[animation-play-state:paused] group-hover:-translate-y-[3px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            style={{
              animation: 'scroll-bounce 2s infinite 1s'
            }}
          >
            <path
              fill="#000000"
              d="M360.5 217.5l-152 143.1C203.9 365.8 197.9 368 192 368s-11.88-2.188-16.5-6.562L23.5 217.5C13.87 208.3 13.47 193.1 22.56 183.5C31.69 173.8 46.94 173.5 56.5 182.6L192 310.9l135.5-128.4c9.562-9.094 24.75-8.75 33.94 .9375C370.5 193.1 370.1 208.3 360.5 217.5z"
            />
          </svg>
        </>
      ) : variant === 'logout' ? (
        <>
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 013 3v10a3 3 0 01-3 3h-2"/>
          </svg>
          <span className="flex-1 text-left ms-3 whitespace-nowrap">{children}</span>
        </>
      ) : variant === 'login' ? (
        <>
          {loading ? (
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {children}
            </span>
          ) : (
            children
          )}
        </>
      ) : variant === 'save' ? (
        <>
          {loading ? (
            <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          )}
          <span className="flex-1 text-left ms-3 whitespace-nowrap">{loading ? 'Kaydediliyor...' : children}</span>
        </>
      ) : variant === 'delete' ? (
        <>
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
          </svg>
          <span className="flex-1 text-center ms-3 whitespace-nowrap">{children}</span>
        </>
      ) : variant === 'plain' ? (
        <>{children}</>
      ) : variant === 'add' ? (
        <>
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          <span className="flex-1 text-left ms-3 whitespace-nowrap">{children}</span>
        </>
      ) : variant === 'cancel' ? (
        <>{children}</>
      ) : variant === 'back' ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-[18px] h-[18px] transition-transform duration-200 delay-200 group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>{children}</span>
        </>
      ) : null}
    </button>
  );
};

export default Button;
