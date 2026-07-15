"use client";

import React, { useState, CSSProperties } from "react";

type HoverBoxProps = {
  as?: React.ElementType;
  style?: CSSProperties;
  hoverStyle?: CSSProperties;
  focusStyle?: CSSProperties;
  children?: React.ReactNode;
} & Record<string, unknown>;

/**
 * Reproduces the original design's `style-hover` / `style-focus` attributes:
 * the extra styles are merged in on hover / focus and removed on leave / blur.
 * Renders as any element via the `as` prop (a, div, span, button, input…).
 */
export default function HoverBox({
  as: Tag = "div",
  style,
  hoverStyle,
  focusStyle,
  children,
  ...rest
}: HoverBoxProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const merged: CSSProperties = {
    ...style,
    ...(hovered && hoverStyle ? hoverStyle : {}),
    ...(focused && focusStyle ? focusStyle : {}),
  };

  return (
    <Tag
      {...rest}
      style={merged}
      onMouseEnter={() => hoverStyle && setHovered(true)}
      onMouseLeave={() => hoverStyle && setHovered(false)}
      onFocus={() => focusStyle && setFocused(true)}
      onBlur={() => focusStyle && setFocused(false)}
    >
      {children}
    </Tag>
  );
}
