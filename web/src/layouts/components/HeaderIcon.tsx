import { ActionIcon, Header, Tooltip } from "@mantine/core";
import React from "react";
import { IconType } from "react-icons";

interface HeaderProps {
  label: string;
  Icon: IconType;
  destination?: string;
  openDelay?: number;
  color?: string;
  iconSize?: number;
  onClick?: () => void;
};

const HeaderIcon: React.FC<HeaderProps> = (props) => {
  return (
    <Tooltip
      label={props.label}
      openDelay={props.openDelay || 500}
    >
      <ActionIcon
        color={props.color}
        onClick={props.onClick}
      >
        <props.Icon fontSize={props.iconSize || 24} />
      </ActionIcon>
    </Tooltip>
  );
};

export default HeaderIcon;
export const MemoHeaderIcon = React.memo(HeaderIcon);
