'use client';

import { useReveal } from '@/hooks/use-reveal';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: 1 | 2 | 3 | 4;
  as?: 'div' | 'section' | 'article' | 'li' | 'span';
}

export function Reveal({
  children,
  className,
  delay,
  as: Component = 'div',
}: RevealProps) {
  const { ref: revealRef, isVisible } = useReveal<HTMLElement>();

  const setRevealRef = (element: HTMLElement | null) => {
    revealRef.current = element;
  };

  const delayClass = delay ? `reveal-delay-${delay}` : '';

  return (
    <Component
      ref={setRevealRef}
      className={cn('reveal', delayClass, isVisible && 'is-visible', className)}
    >
      {children}
    </Component>
  );
}
