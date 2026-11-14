const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

type ScrollToTopBehavior = 'instant' | 'smooth';

function resolveBehavior(behavior: ScrollToTopBehavior): ScrollToTopBehavior {
  if (behavior === 'smooth' && window.matchMedia(REDUCED_MOTION_QUERY).matches) return 'instant';
  return behavior;
}

export function scrollToTop(behavior: ScrollToTopBehavior) {
  window.scrollTo({ top: 0, left: 0, behavior: resolveBehavior(behavior) });
}
