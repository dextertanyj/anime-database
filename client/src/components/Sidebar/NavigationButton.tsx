import { forwardRef } from "@chakra-ui/react";
import { Link, LinkPropsOptions } from "@tanstack/react-router";

import { SidebarButton, SidebarButtonProps } from "./SidebarButton";

export type NavigationButtonProps = LinkPropsOptions & SidebarButtonProps;

export const NavigationButton = forwardRef<NavigationButtonProps, "button">(
  (props: NavigationButtonProps, ref) => {
    const { from, to, params, search, hash, state, ...rest } = props;
    return (
      <>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <Link from={from} to={to} params={params} search={search} hash={hash} state={state}>
          {({ isActive }: { isActive: boolean }) => {
            return <SidebarButton {...rest} isActive={isActive} ref={ref} />;
          }}
        </Link>
      </>
    );
  },
);
