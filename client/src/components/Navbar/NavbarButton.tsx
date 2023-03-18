import { Button, ButtonProps, forwardRef, HStack, Icon, Text, useTheme } from "@chakra-ui/react";
import { IconType } from "react-icons";

export type NavbarButtonProps = {
  Icon: IconType;
  description?: string;
  collapsed: boolean;
} & ButtonProps;

export const NavbarButton = forwardRef<NavbarButtonProps, "button">(
  (props: NavbarButtonProps, ref) => {
    const { Icon: IconType, description, collapsed, ...rest } = props;
    const theme = useTheme();

    return (
      <Button
        ref={ref}
        w="full"
        bg="transparent"
        color="teal.100"
        _active={{
          bg: "teal.500",
        }}
        _hover={{
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
          background: `${theme["colors"]?.["teal"]?.["500"]}AA`,
        }}
        {...rest}
      >
        {collapsed ? (
          <Icon as={IconType} fontSize="xl" />
        ) : (
          <HStack w="full" justifyContent="left" alignContent="center">
            <Icon as={IconType} fontSize="xl" />
            <Text fontSize="lg">{description ?? ""}</Text>
          </HStack>
        )}
      </Button>
    );
  },
);
