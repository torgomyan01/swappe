import { addToast } from "@heroui/react";
import clsx from "clsx";
import React, { useMemo, useState, useRef, useEffect } from "react";

type Rule = RegExp | ((value: string) => boolean);
type ValidatorPair = { rule: Rule; message: string };

interface IThisProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;

  rules?: Rule[];
  messages?: string[];
  validatorPairs?: ValidatorPair[];

  requiredMessage?: string;

  showAllErrors?: boolean;
  onValueChange?: (value: string) => void;
  bottomElements?: React.ReactNode;

  /** Ծնող ֆորմի ref-ը՝ submit-ը ներսից բռնելու համար */
  formRef?: React.RefObject<HTMLFormElement | null>;
}

function DefInput({
  label,
  required,
  requiredMessage = "Обязательное поле",
  className,
  rules,
  messages,
  validatorPairs,
  showAllErrors = false,
  onValueChange,
  onChange,
  value: controlledValue,
  defaultValue,
  bottomElements,
  formRef,
  onBlur,
  ...rest
}: IThisProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // uncontrolled fallback
  const [uncontrolled, setUncontrolled] = useState(
    (defaultValue as string) ?? "",
  );
  const value = (controlledValue as string) ?? uncontrolled;

  // error visibility control
  const [touched, setTouched] = useState(false);
  const [forceShowErrors, setForceShowErrors] = useState(false);

  // validators normalize
  const allValidators: ValidatorPair[] = useMemo(() => {
    const list: ValidatorPair[] = [];
    if (required) {
      list.push({
        rule: (v: string) => v.trim().length > 0,
        message: requiredMessage,
      });
    }
    if (validatorPairs?.length) {
      list.push(...validatorPairs);
    }
    if (rules && messages) {
      const n = Math.min(rules.length, messages.length);
      if (rules.length !== messages.length) {
        console.warn(
          "[DefInput] rules/messages length mismatch:",
          rules.length,
          messages.length,
        );
      }
      for (let i = 0; i < n; i++) {
        list.push({ rule: rules[i], message: messages[i] });
      }
    }
    return list;
  }, [required, requiredMessage, validatorPairs, rules, messages]);

  // compute errors
  const errors = useMemo(() => {
    const val = value ?? "";
    const errs: string[] = [];
    for (const v of allValidators) {
      const ok = v.rule instanceof RegExp ? v.rule.test(val) : v.rule(val);
      if (!ok) {
        errs.push(v.message);
        if (!showAllErrors) {
          break;
        }
      }
    }
    return errs;
  }, [allValidators, value, showAllErrors]);

  const hasError = errors.length > 0;
  const shouldShowErrors = hasError && (touched || forceShowErrors);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    if (controlledValue === undefined) {
      setUncontrolled(next);
    }
    onValueChange?.(next);
    onChange?.(e);
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    setTouched(true);
    onBlur?.(e);
  }

  useEffect(() => {
    const form = formRef?.current;
    if (!form) {
      return;
    }

    const onFormSubmit = (e: Event) => {
      setForceShowErrors(true);

      if (errors.length > 0) {
        e.preventDefault();
        addToast({
          title: `Пожалуйста, заполните <<${label}>> поля с соответствующими требованиями.`,
          color: "danger",
        });
        inputRef.current?.focus();
      }
    };

    form.addEventListener("submit", onFormSubmit);
    return () => form.removeEventListener("submit", onFormSubmit);
  }, [formRef, errors]);

  return (
    <div className="input-wrap">
      <span className="!flex-js-s gap-1">
        {label} {required && <span className="!text-red-500">*</span>}
      </span>

      <input
        {...rest}
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        required={required}
        aria-invalid={shouldShowErrors || undefined}
        aria-describedby={
          shouldShowErrors ? `${rest.id ?? rest.name}-error` : undefined
        }
        className={clsx(className, { "!border-red-400": shouldShowErrors })}
      />

      {shouldShowErrors && (
        <div id={`${rest.id ?? rest.name}-error`} className="mt-2 space-y-1">
          {errors.map((msg, i) => (
            <p
              key={i}
              className="!text-left !text-red-600 leading-[15px] !text-[14px]"
            >
              {msg}
            </p>
          ))}
        </div>
      )}

      {bottomElements}
    </div>
  );
}

export default DefInput;
