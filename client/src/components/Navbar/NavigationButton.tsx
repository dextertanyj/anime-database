import { forwardRef } from "@chakra-ui/react";
import { NavLink, NavLinkProps } from "react-router-dom";

import { NavbarButton, NavbarButtonProps } from "./NavbarButton";

export type NavigationButtonProps = Pick<NavLinkProps, "to"> & NavbarButtonProps;

export const NavigationButton = forwardRef<NavigationButtonProps, "button">(
  (props: NavigationButtonProps, ref) => {
    const { to, ...rest } = props;
    return (
      <>
        <NavLink to={to}>
          {({ isActive }: { isActive: boolean }) => {
            return <NavbarButton {...rest} isActive={isActive} ref={ref} />;
          }}
        </NavLink>
      </>
    );
  },
);
