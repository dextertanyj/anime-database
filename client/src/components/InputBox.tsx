import { PropsWithChildren, useMemo } from "react";
import { Box, SystemStyleObject, useFormControl, useMultiStyleConfig } from "@chakra-ui/react";

type InputBoxProps = {
  size?: "xs" | "sm" | "md" | "lg";
};

export const InputBox = ({ size = "md", children }: PropsWithChildren<InputBoxProps>) => {
  const styles = useMultiStyleConfig("Input", { size });
  const input = useFormControl<HTMLInputElement>({});

  const sx = useMemo(() => {
    const field: SystemStyleObject & { _focusVisible?: SystemStyleObject } = styles.field;
    const val: SystemStyleObject & {
      _focusVisible?: SystemStyleObject;
      _focusWithin?: SystemStyleObject;
    } = { ...field, _focusWithin: field._focusVisible, w: "fit-content" };
    delete val._focusVisible;
    return val;
  }, [styles.field]);

  return (
    <Box {...input} sx={sx}>
      {children}
    </Box>
  );
};
