"use client";

import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { dvPrimaryButton, dvPrimaryButtonDisabled } from "./dv-visual";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  style?: CSSProperties;
};

export function CTAButton({ style, disabled, ...rest }: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      style={{
        ...(disabled ? dvPrimaryButtonDisabled : dvPrimaryButton),
        ...style,
      }}
      {...rest}
    />
  );
}
