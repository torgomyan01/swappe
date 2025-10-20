import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface UrlInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onValueChange?: (value: string) => void;
}

function isModifierKey(event: React.KeyboardEvent<HTMLInputElement>) {
  const { key, ctrlKey, metaKey, altKey } = event;
  if (ctrlKey || metaKey || altKey) return true;
  const nonCharKeys = new Set([
    "Shift",
    "Control",
    "Alt",
    "CapsLock",
    "Tab",
    "Escape",
    "Enter",
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Home",
    "End",
    "PageUp",
    "PageDown",
    "Insert",
    "Delete",
    "Backspace",
  ]);
  return nonCharKeys.has(key);
}

const HTTPS_PREFIX = "https://";

export default function UrlInput({
  onValueChange,
  className,
  placeholder = "https://",
  value: controlledValue,
  defaultValue,
  ...rest
}: UrlInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internal, setInternal] = useState<string>(
    (defaultValue as string) ?? "",
  );
  const isControlled = controlledValue !== undefined;
  const value = (controlledValue as string) ?? internal;

  const [skipNextAutoPrefix, setSkipNextAutoPrefix] = useState(false);

  useEffect(() => {
    if (!skipNextAutoPrefix) return;
    const t = setTimeout(() => setSkipNextAutoPrefix(false), 0);
    return () => clearTimeout(t);
  }, [skipNextAutoPrefix]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
    // @ts-expect-error - rest may include onChange even if not present in UrlInputProps
    rest?.onChange?.(e);
  }

  function handlePaste() {
    setSkipNextAutoPrefix(true);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (skipNextAutoPrefix) return;
    if (isModifierKey(e)) return;
    if (e.key.length !== 1) return; // Only character keys

    const current = (value ?? "").trim();
    if (current.length === 0) {
      // User starts typing; auto-insert https:// and append the typed character
      e.preventDefault();
      const next = `${HTTPS_PREFIX}${e.key}`;
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
      // place caret at end after update
      requestAnimationFrame(() => {
        const el = inputRef.current;
        if (el) {
          el.value = next; // ensure DOM reflects state immediately
          el.setSelectionRange(next.length, next.length);
        }
      });
    }
  }

  return (
    <input
      {...rest}
      ref={inputRef}
      className={clsx(className)}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      placeholder={placeholder}
      type="text"
      inputMode="url"
      autoComplete="url"
    />
  );
}
