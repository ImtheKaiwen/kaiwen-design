/**
 * Standard CSS style object for visually hidden elements (accessible to screen readers only).
 */
export const visuallyHiddenStyle = {
  position: "absolute" as const,
  border: 0,
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden" as const,
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap" as const,
  wordWrap: "normal" as const,
};

/**
 * Ensures secure link attributes when target="_blank" is used (Plan.md Section 23).
 */
export function getSafeLinkProps(props: {
  target?: string;
  rel?: string;
  href?: string;
}) {
  const isExternal =
    props.target === "_blank" ||
    (Boolean(props.href) &&
      (props.href?.startsWith("http://") ||
        props.href?.startsWith("https://")));

  let rel = props.rel;
  if (props.target === "_blank") {
    const existing = (rel ?? "").split(" ").filter(Boolean);
    if (!existing.includes("noopener")) existing.push("noopener");
    if (!existing.includes("noreferrer")) existing.push("noreferrer");
    rel = existing.join(" ");
  }

  return {
    ...props,
    rel,
    isExternal,
  };
}
