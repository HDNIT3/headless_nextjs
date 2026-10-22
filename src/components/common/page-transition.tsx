import { ViewTransition } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Wraps page content so route changes animate.
 *
 * - Links tagged with `transitionTypes={['nav-forward']}` slide the new page in
 *   from the right (old page leaves to the left).
 * - Links tagged with `transitionTypes={['nav-back']}` play the reverse motion.
 * - Every other navigation (top-level nav, browser back, redirects) cross-fades.
 *
 * Must live in each `page.tsx`, never in a layout: layouts persist across
 * navigations so their enter/exit would never fire.
 */
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <ViewTransition
      enter={{
        'nav-forward': 'nav-forward',
        'nav-back': 'nav-back',
        default: 'page-fade-in',
      }}
      exit={{
        'nav-forward': 'nav-forward',
        'nav-back': 'nav-back',
        default: 'page-fade-out',
      }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
