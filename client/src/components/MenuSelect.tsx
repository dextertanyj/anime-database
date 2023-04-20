import { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  forwardRef,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuItem,
  MenuList,
  SystemStyleObject,
  useFormControl,
  useMultiStyleConfig,
} from "@chakra-ui/react";

import { BiChevronDown } from "react-icons/bi";

type MenuSelectProps = {
  options: { value: string; label?: string }[];
  value?: string;
  onChange?: (event: MouseEvent<HTMLButtonElement>) => void;
} & MenuButtonProps;

export const MenuSelect = forwardRef<MenuSelectProps, "button">(
  ({ value, options, onChange, sx: style, ...props }, ref) => {
    const internalRef = useRef<{ value: string } | null>(null);
    const state = useFormControl<HTMLButtonElement>({});
    const [label, setLabel] = useState<string>(() => {
      const label = options.find((option) => option.value === (value ?? internalRef.current));
      return label?.label ?? label?.value ?? "";
    });

    const styles = useMultiStyleConfig("Input");
    const sx = useMemo(() => {
      const field: SystemStyleObject & { _focusVisible?: SystemStyleObject } = styles.field;
      const sx: SystemStyleObject & {
        _focusVisible?: SystemStyleObject;
        _active?: SystemStyleObject;
      } = { ...field, _active: field._focusVisible };
      sx.color = "chakra-body-text";
      sx.textAlign = "left";
      sx.fontWeight = "normal";
      return { ...sx, ...style };
    }, [styles.field, style]);

    const selected = useRef<HTMLButtonElement | null>(null);

    const internalRefHandler = useCallback(
      (ref: HTMLButtonElement | null) => {
        if (!ref?.value) {
          return;
        }
        internalRef.current = { value: ref.value };
        const label = options.find((option) => option.value === ref.value);
        setLabel(label?.label ?? label?.value ?? "");
      },
      [options],
    );

    const onClickHandler = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        internalRef.current = { value: event.currentTarget.value };
        if (onChange) {
          onChange(event);
        }
        setLabel(event.currentTarget.textContent ?? "");
      },
      [onChange],
    );

    useEffect(() => {
      if (value === undefined) {
        return;
      }
      setLabel(options.find((option) => option.value === value)?.label ?? "");
    }, [options, value]);

    return (
      <Menu matchWidth initialFocusRef={selected}>
        <MenuButton
          ref={(r) => {
            if (typeof ref === "function") {
              ref(r);
            } else if (ref) {
              ref.current = r;
            }
            // Sync default value provided by react-hook-form for uncontrolled usage
            internalRefHandler(r);
          }}
          // Use internalRef to sync changes during uncontrolled usage
          value={value ?? internalRef.current?.value ?? ""}
          as={Button}
          variant="outline"
          rightIcon={<BiChevronDown />}
          sx={sx}
          {...state}
          {...props}
        >
          {label}
        </MenuButton>
        <MenuList maxHeight={60} overflowY="auto">
          {!state.required && (
            <MenuItem value={value ? "" : undefined} onClick={onClickHandler}>
              {"\u00A0"}
            </MenuItem>
          )}
          {options.map((option) => (
            <MenuItem
              ref={internalRef.current?.value === option.value ? selected : undefined}
              key={option.value}
              value={option.value}
              onClick={onClickHandler}
            >
              {option.label ?? option.value}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    );
  },
);
