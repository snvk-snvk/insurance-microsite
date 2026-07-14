"use client";

import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Resyncs the free-typed buffer when the color changes from the picker,
  // not from typing itself - a real external-source sync, not derived state.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setText(value), [value]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative flex flex-col gap-2" ref={containerRef}>
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="h-11 w-11 shrink-0 rounded-xl border border-black/15"
          style={{ backgroundColor: value }}
          aria-label={`Pick ${label.toLowerCase()}`}
        />
        <input
          value={text}
          onChange={(e) => {
            const v = e.target.value;
            setText(v);
            if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v);
          }}
          className="h-11 w-28 rounded-xl border border-black/15 px-3 text-sm uppercase outline-none focus:border-brand"
          maxLength={7}
        />
      </div>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 rounded-xl border border-black/10 bg-white p-3 shadow-lg">
          <HexColorPicker color={value} onChange={onChange} />
        </div>
      )}
    </div>
  );
}
