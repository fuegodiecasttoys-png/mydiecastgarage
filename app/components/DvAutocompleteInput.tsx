"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { filterPresetOptions } from "../lib/autocomplete/filterPresetOptions";
import { t } from "../ui/dv-tokens";

export type DvAutocompleteInputProps = {
  value: string;
  onChange: (value: string) => void;
  /** Preset strings (BRANDS, COLORS). Pass [] for a plain text field (no dropdown). */
  options: readonly string[];
  placeholder?: string;
  disabled?: boolean;
  inputStyle?: CSSProperties;
  /** Min typed characters before showing suggestions (default 1). */
  minChars?: number;
  maxSuggestions?: number;
  autoComplete?: string;
  id?: string;
  /** Outer wrapper (e.g. flex sizing on detail rows). */
  wrapperStyle?: CSSProperties;
  "aria-label"?: string;
};

const dropdownStyle: CSSProperties = {
  position: "absolute",
  top: "calc(100% + 6px)",
  left: 0,
  right: 0,
  background: t.bgSecondary,
  border: `1px solid ${t.borderSubtle}`,
  borderRadius: 10,
  maxHeight: 180,
  overflowY: "auto",
  zIndex: 40,
  WebkitOverflowScrolling: "touch",
  boxShadow: `0 8px 24px rgba(0,0,0,0.45)`,
};

const suggestionRowStyle: CSSProperties = {
  padding: "10px 12px",
  cursor: "pointer",
  fontSize: 14,
  color: t.textPrimary,
};

export function DvAutocompleteInput({
  value,
  onChange,
  options,
  placeholder,
  disabled,
  inputStyle,
  minChars = 1,
  maxSuggestions = 12,
  autoComplete = "off",
  id,
  wrapperStyle,
  "aria-label": ariaLabel,
}: DvAutocompleteInputProps) {
  const [open, setOpen] = useState(false);
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (options.length === 0) return [];
    return filterPresetOptions(value, options).slice(0, maxSuggestions);
  }, [value, options, maxSuggestions]);

  const showList =
    open &&
    !disabled &&
    options.length > 0 &&
    value.trim().length >= minChars &&
    filtered.length > 0;

  return (
    <div style={{ position: "relative", width: "100%", ...wrapperStyle }}>
      <input
        id={id}
        type="text"
        aria-label={ariaLabel}
        aria-autocomplete="list"
        aria-expanded={showList}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        autoComplete={autoComplete}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setTimeout(() => {
            setOpen(false);
            setHoverKey(null);
          }, 150);
        }}
        style={inputStyle}
      />
      {showList ? (
        <div role="listbox" style={dropdownStyle}>
          {filtered.map((opt) => (
            <div
              key={opt}
              role="option"
              onMouseDown={(e) => e.preventDefault()}
              onPointerEnter={() => setHoverKey(opt)}
              onPointerLeave={() => setHoverKey(null)}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              style={{
                ...suggestionRowStyle,
                background:
                  hoverKey === opt ? t.orangeGlow : "transparent",
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
