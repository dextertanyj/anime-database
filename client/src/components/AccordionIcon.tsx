import { Icon, IconProps } from "@chakra-ui/react";

import { BiChevronDown } from "react-icons/bi";

export const AccordionIcon = ({ isExpanded, ...rest }: { isExpanded: boolean } & IconProps) => {
  return (
    <Icon
      as={BiChevronDown}
      transform={isExpanded ? "rotate(-180deg)" : undefined}
      transitionProperty="transform"
      transitionDuration="0.2s"
      transitionTimingFunction="ease"
      {...rest}
    />
  );
};
