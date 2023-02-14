import { useState } from "react";
import {
  forwardRef,
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
} from "@chakra-ui/react";

import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

export const PasswordInput = forwardRef<InputProps, "input">((props: InputProps, ref) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const onClick = () => setIsVisible((isVisible) => !isVisible);

  return (
    <InputGroup>
      <Input
        ref={ref}
        id="password"
        name="password"
        type={isVisible ? "text" : "password"}
        autoComplete="current-password"
        {...props}
      />
      <InputRightElement>
        <IconButton
          variant="link"
          icon={isVisible ? <BsEyeSlashFill /> : <BsEyeFill />}
          onClick={onClick}
          aria-label={isVisible ? "Mask password" : "Show password"}
        />
      </InputRightElement>
    </InputGroup>
  );
});

PasswordInput.displayName = "PasswordField";
