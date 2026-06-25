import { useEffect, useState, type ReactNode } from 'react';
import { useDragScroll } from '../hooks/useDragScroll';

const DEFAULT_SURFACE_CLASS =
  'bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-sm';

/**
 * The shared horizontally-scrollable table surface: it supplies click-and-drag
 * panning (see `useDragScroll`) and a subtle shadow at whichever edge still
 * hides content, so it's clear there is more to scroll to.
 *
 * `surfaceClassName` overrides the visual styling of the scroll container (its
 * border/background/radius) for callers that sit on a different surface, e.g.
 * the item tables embedded in a `DataCard`. The edge shadows assume a rounded
 * 1px-bordered box, which any override should keep. `overflow-x-auto` is always
 * applied and is not overridable.
 */
export function ScrollableTable({
  children,
  surfaceClassName = DEFAULT_SURFACE_CLASS,
}: {
  children: ReactNode;
  surfaceClassName?: string;
}) {
  const scrollRef = useDragScroll<HTMLDivElement>();
  const [edges, setEdges] = useState({ left: false, right: false });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      const left = el.scrollLeft > 0;
      // At the far right `scrollLeft + clientWidth` can trail `scrollWidth` by a
      // sub-pixel, so round before deciding there is still content to reveal.
      const right = Math.round(el.scrollLeft + el.clientWidth) < el.scrollWidth;
      setEdges((current) =>
        current.left === left && current.right === right ? current : { left, right },
      );
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    // Observe both the viewport and the table within it, so the indicators react
    // to viewport resizes and to rows loading/changing the content width alike.
    const observer = new ResizeObserver(update);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);

    return () => {
      el.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [scrollRef]);

  return (
    <div className="relative">
      <div ref={scrollRef} className={`${surfaceClassName} overflow-x-auto`}>
        {children}
      </div>
      <EdgeShadow side="left" visible={edges.left} />
      <EdgeShadow side="right" visible={edges.right} />
    </div>
  );
}

/** A soft inward shadow hugging one edge, faded in only while that side hides content. */
function EdgeShadow({ side, visible }: { side: 'left' | 'right'; visible: boolean }) {
  const placement =
    side === 'left'
      ? 'left-px rounded-l-xl bg-gradient-to-r'
      : 'right-px rounded-r-xl bg-gradient-to-l';
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-px w-8 from-black/10 to-transparent transition-opacity duration-200 ${placement} ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    />
  );
}
