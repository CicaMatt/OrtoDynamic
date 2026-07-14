import { useEffect, useState, type RefObject } from 'react';

type ScrollState = { left: number; max: number };

export function TableScrollSlider({ scrollRef }: { scrollRef: RefObject<HTMLElement> }) {
  const [state, setState] = useState<ScrollState>({ left: 0, max: 0 });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () =>
      setState({
        left: el.scrollLeft,
        max: Math.max(0, el.scrollWidth - el.clientWidth),
      });

    update();
    el.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);

    return () => {
      el.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [scrollRef]);

  if (state.max <= 0) return null;

  return (
    <input
      aria-label="Scorri tabella orizzontalmente"
      type="range"
      min={0}
      max={state.max}
      value={Math.min(state.left, state.max)}
      onChange={(event) => {
        const left = Number(event.currentTarget.value);
        if (scrollRef.current) scrollRef.current.scrollLeft = left;
        setState((current) => ({ ...current, left }));
      }}
      className="table-scroll-slider w-40"
    />
  );
}
