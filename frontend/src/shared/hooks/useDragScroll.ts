import { useEffect, useRef } from 'react';

// Horizontal travel (px) a press must exceed before it counts as a pan rather
// than a click — small enough to feel immediate, large enough to absorb jitter.
const DRAG_THRESHOLD = 6;

/**
 * Enables click-and-drag horizontal panning on a scrollable element (one with
 * `overflow-x-auto`). Returns a ref to attach to that element.
 *
 * A primary-button press that moves horizontally past `DRAG_THRESHOLD` pans the
 * element and is treated as a drag, not a click: the `click` that the browser
 * fires on release is swallowed so an underlying row or link doesn't also
 * activate. A press that stays put remains an ordinary click. A "grab" cursor is
 * shown only while the content actually overflows, so it never lies.
 */
export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let pointerId: number | null = null;
    let startX = 0;
    let startScrollLeft = 0;
    let dragging = false;

    // Reflect whether there is anything to pan to in the resting cursor.
    const refreshCursor = () => {
      el.style.cursor = el.scrollWidth > el.clientWidth ? 'grab' : '';
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return; // primary button only
      pointerId = event.pointerId;
      startX = event.clientX;
      startScrollLeft = el.scrollLeft;
      dragging = false;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (pointerId === null) return;
      const dx = event.clientX - startX;
      if (!dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        dragging = true;
        el.setPointerCapture(pointerId);
        el.style.cursor = 'grabbing';
        el.style.userSelect = 'none';
      }
      el.scrollLeft = startScrollLeft - dx;
    };

    const endPress = () => {
      if (pointerId !== null && el.hasPointerCapture(pointerId)) {
        el.releasePointerCapture(pointerId);
      }
      pointerId = null;
      el.style.userSelect = '';
      refreshCursor();
      // `dragging` stays true so the trailing click is swallowed; it is reset
      // there (or on the next press).
    };

    // Capture phase: stop a drag's trailing click before it reaches the rows.
    const onClickCapture = (event: MouseEvent) => {
      if (!dragging) return;
      event.stopPropagation();
      event.preventDefault();
      dragging = false;
    };

    refreshCursor();
    const resizeObserver = new ResizeObserver(refreshCursor);
    resizeObserver.observe(el);

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', endPress);
    el.addEventListener('pointercancel', endPress);
    el.addEventListener('click', onClickCapture, true);

    return () => {
      resizeObserver.disconnect();
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', endPress);
      el.removeEventListener('pointercancel', endPress);
      el.removeEventListener('click', onClickCapture, true);
    };
  }, []);

  return ref;
}
