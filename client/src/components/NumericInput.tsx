import { KeyboardEvent } from "react";
import { forwardRef, Input, InputProps } from "@chakra-ui/react";

const ArrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
const MovementKeys = [...ArrowKeys, "Tab", "Home", "End"];
const EditKeys = [
  "Delete",
  "Backspace",
  "Clear",
  "Copy",
  "Cut",
  "Paste",
  "Undo",
  "Redo",
  "Insert",
  "ExSel",
];
const ControlKeys = ["a", "c", "v", "x", "z"];

const isPermittedEvent = (event: KeyboardEvent) => {
  if (MovementKeys.includes(event.key) || EditKeys.includes(event.key)) {
    return true;
  }
  if (ControlKeys.includes(event.key) && event.ctrlKey) {
    return true;
  }
  return false;
};

export const NumericInput = forwardRef<InputProps, "input">((props, ref) => {
  return (
    <Input
      ref={ref}
      inputMode="decimal"
      onKeyDown={(e) => {
        if (isPermittedEvent(e)) {
          return;
        }
        if (!e.key.match(/^[0-9]+$/)) {
          e.preventDefault();
        }
      }}
      {...props}
      value={
        props.value === undefined
          ? undefined
          : isNaN(props.value as number)
          ? ""
          : (props.value as number).toString()
      }
    />
  );
});
