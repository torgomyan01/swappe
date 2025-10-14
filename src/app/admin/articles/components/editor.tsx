"use client";

import { useEffect, useRef } from "react";

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  function handleInput() {
    if (!ref.current) return;
    onChange(ref.current.innerHTML);
  }

  function exec(cmd: string, arg?: string) {
    document.execCommand(cmd, false, arg);
    handleInput();
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="px-2 py-1 border rounded"
          onClick={() => exec("bold")}
        >
          B
        </button>
        <button
          type="button"
          className="px-2 py-1 border rounded italic"
          onClick={() => exec("italic")}
        >
          I
        </button>
        <button
          type="button"
          className="px-2 py-1 border rounded underline"
          onClick={() => exec("underline")}
        >
          U
        </button>
        <button
          type="button"
          className="px-2 py-1 border rounded"
          onClick={() => exec("insertUnorderedList")}
        >
          • List
        </button>
        <button
          type="button"
          className="px-2 py-1 border rounded"
          onClick={() => exec("insertOrderedList")}
        >
          1. List
        </button>
        <button
          type="button"
          className="px-2 py-1 border rounded"
          onClick={() => {
            const url = prompt("Введите URL ссылки");
            if (url) exec("createLink", url);
          }}
        >
          Link
        </button>
        <button
          type="button"
          className="px-2 py-1 border rounded"
          onClick={() => exec("removeFormat")}
        >
          Clear
        </button>
      </div>
      <div
        ref={ref}
        className="min-h-40 p-3 border rounded bg-white"
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
        style={{ outline: "none" }}
      />
    </div>
  );
}
