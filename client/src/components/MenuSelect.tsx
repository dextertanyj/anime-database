import { useCallback, useRef } from "react";
import {
  Button,
  ButtonProps,
  forwardRef,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SelectProps,
  useColorMode,
  useTheme,
} from "@chakra-ui/react";

import { BiChevronDown } from "react-icons/bi";

type MenuSelectProps = {
  value: { id: string; value: string } | string;
  options: { id: string; value: string }[];
} & ButtonProps &
  Pick<SelectProps, "isInvalid">;

export const MenuSelect = forwardRef<MenuSelectProps, "select">((props, ref) => {
  const selected = useRef<HTMLButtonElement | null>(null);
  const { colorMode } = useColorMode();
  const theme = useTheme();

  const focusSelected = useCallback(() => {
    setTimeout(() => {
      if (selected.current) {
        selected.current.focus();
      }
    });
  }, []);

  const formattedValue: { id: string; value: string } | undefined =
    typeof props.value === "object"
      ? props.value
      : props.options.find((option) => option.id === props.value || option.value === props.value);

  return (
    <Menu isLazy autoSelect={false} onOpen={focusSelected}>
      <MenuButton
        ref={ref}
        as={Button}
        variant="outline"
        width={props.w || props.width}
        rightIcon={<BiChevronDown />}
        borderColor={props.isInvalid ? "red.500" : "chakra-border-color"}
        color={"chakra-body-text"}
        fontWeight={"normal"}
        textAlign={"left"}
        _hover={{
          borderColor: colorMode === "light" ? "gray.300" : "whiteAlpha.400",
          background: "none",
        }}
        _active={{
          borderColor: "blue.300",
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
          boxShadow: `0 0 0 1px ${theme["colors"]["blue"][300]}`,
          background: "none",
        }}
        {...props}
      >
        {formattedValue?.value || ""}
      </MenuButton>
      <MenuList maxHeight={60} overflowY="auto">
        {props.options.map((option) => (
          <MenuItem
            ref={
              typeof props.value === "object" && props.value.id === option.id ? selected : undefined
            }
            key={option.id}
            value={option.id}
            onClick={props.onChange}
          >
            {option.value}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
});
