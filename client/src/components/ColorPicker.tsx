import { useEffect, useState } from "react";
import {
  Button,
  Center,
  FormControl,
  forwardRef,
  Input,
  InputGroup,
  InputLeftAddon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  useTheme,
} from "@chakra-ui/react";
import tinycolor from "tinycolor2";

const colors = ["Gray", "Red", "Green", "Blue", "Yellow", "Orange", "Purple", "Pink"];

export type ColorPickerProps = {
  onChange?: (color: string) => void;
  onBlur?: () => void;
  value?: string;
  name?: string;
  isDisabled?: boolean;
};

export const ColorPicker = forwardRef<ColorPickerProps, "input">((props: ColorPickerProps, ref) => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onChange = () => {},
    onBlur,
    value = tinycolor.random().toHexString().toUpperCase(),
    name,
    isDisabled,
  } = props;
  const theme = useTheme();

  const [current, setCurrent] = useState<string>(value);

  useEffect(() => {
    setCurrent(value);
  }, [value]);

  return (
    <Popover onClose={onBlur}>
      <PopoverTrigger>
        <Button
          aria-label={name}
          isDisabled={isDisabled}
          _disabled={{ opacity: 1, cursor: "not-allowed" }}
          background={value}
          h={6}
          w={6}
          p={0}
          minW={0}
          borderRadius={3}
          _hover={{ bg: value }}
          flexShrink={0}
          ref={ref}
        ></Button>
      </PopoverTrigger>
      <PopoverContent width="170px">
        <PopoverArrow bg={current} />
        <PopoverCloseButton right={1} color="white" />
        <PopoverHeader
          h={24}
          py={0}
          bgColor={current}
          borderTopLeftRadius={5}
          borderTopRightRadius={5}
          color="white"
        >
          <Center h={24} color={tinycolor(current).isLight() ? "gray.800" : "white"}>
            {current}
          </Center>
        </PopoverHeader>
        <PopoverBody h={32} p={3}>
          <SimpleGrid columns={4} spacing={2}>
            {colors.map((color) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              const code = theme?.["colors"]?.[color.toLowerCase()]?.["500"] as string;
              return (
                <Button
                  key={color}
                  aria-label={color}
                  background={code}
                  h={6}
                  w={6}
                  minW={0}
                  padding={0}
                  borderRadius={3}
                  _hover={{ bg: code }}
                  onClick={() => onChange(code.toUpperCase())}
                />
              );
            })}
          </SimpleGrid>
          <FormControl>
            <InputGroup size="sm" borderRadius={3} my={4}>
              <InputLeftAddon>#</InputLeftAddon>
              <Input
                placeholder="FFFFFF"
                value={current.slice(1)}
                onChange={(e) => {
                  setCurrent(`#${e.target.value.toUpperCase()}`);
                }}
                focusBorderColor={tinycolor(current).isValid() ? "blue.500" : "red.500"}
                onBlur={(e) => {
                  if (!tinycolor(e.target.value).isValid()) {
                    setCurrent(value);
                    return;
                  }
                  const color = tinycolor(e.target.value).toHexString();
                  onChange(color.toUpperCase());
                }}
              />
            </InputGroup>
          </FormControl>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
});
