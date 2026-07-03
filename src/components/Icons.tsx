/**
 * Small inline SVGs inherit their color from the surrounding text via CSS.
 * They are decorative because the adjacent link/button text already describes the action.
 */
export function ArrowUpRightIcon() {
  return (
    // viewBox supplies an internal coordinate system so the icon scales without losing sharpness.
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path d="M3 13 13 3M6 3h7v7" />
    </svg>
  );
}

export function ArrowDownIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path d="M8 2v12m0 0 4-4m-4 4-4-4" />
    </svg>
  );
}
