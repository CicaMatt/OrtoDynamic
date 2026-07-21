import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom does not provide this browser API used by the shared table controls.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

afterEach(() => {
  cleanup();
  localStorage.clear();
});
