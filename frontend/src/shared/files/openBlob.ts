/**
 * Show a fetched Blob in a browser tab.
 *
 * To survive popup blockers, the caller opens the tab synchronously inside the
 * click handler (so it stays attributed to the user gesture) and passes the
 * resulting window — possibly `null` if it was blocked — here. The object URL is
 * revoked after a delay so the tab has time to load it before it is released.
 */
export function presentBlobInWindow(win: Window | null, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  if (win) {
    win.location.href = url;
  } else {
    // The pre-opened tab was blocked; fall back to opening one now.
    window.open(url, '_blank', 'noopener');
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
