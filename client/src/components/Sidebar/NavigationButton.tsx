import { forwardRef } from "@chakra-ui/react";
import { NavLink, NavLinkProps } from "react-router-dom";

import { SidebarButton, SidebarButtonProps } from "./SidebarButton";

export type NavigationButtonProps = Pick<NavLinkProps, "to"> & SidebarButtonProps;

export const NavigationButton = forwardRef<NavigationButtonProps, "button">(
  (props: NavigationButtonProps, ref) => {
    const { to, ...rest } = props;
    return (
      <>
        <NavLink to={to}>
          {({ isActive }: { isActive: boolean }) => {
            return <SidebarButton {...rest} isActive={isActive} ref={ref} />;
          }}
        </NavLink>
      </>
    );
  },
);
