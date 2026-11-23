/** Tapping finger. Plain SVG, so it never loads a player or keeps a timer. */
export const HAND_SVG =
  '<svg class="finger-hand" viewBox="0 0 64 64" width="46" height="46" aria-hidden="true" focusable="false"><defs><linearGradient id="finger-grad" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse"><stop stop-color="#3A64F6"/><stop offset="1" stop-color="#f5b602"/></linearGradient></defs><path fill="url(#finger-grad)" d="M38.2 8.4c-2.2 0-4 1.8-4 4v14.2h-1.6V16.2c0-2.2-1.8-4-4-4s-4 1.8-4 4v18.6l-4.4-3.6c-1.8-1.5-4.4-1.2-5.8.6-1.4 1.8-1.1 4.4.7 5.8l12.2 10.1c2.2 1.8 5 2.8 7.9 2.8h4.4c6.6 0 12-5.4 12-12V20.4c0-2.2-1.8-4-4-4s-4 1.8-4 4v6.2h-1.6V12.4c0-2.2-1.8-4-4-4z"/></svg>'

export default function FingerHand({ className }: { className?: string }) {
  return <span className={className} aria-hidden dangerouslySetInnerHTML={{ __html: HAND_SVG }} />
}
