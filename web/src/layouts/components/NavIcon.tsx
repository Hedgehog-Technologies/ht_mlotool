import { ActionIcon, ActionIconVariant, Tooltip, createStyles } from "@mantine/core";
import { FloatingPosition } from "@mantine/core/lib/Floating";
import React from "react";
import { IconType } from "react-icons";
import { Link } from "react-router-dom";

interface NavIconProps {
  Icon: IconType;
  destination: string;
  label?: string;
  labelPosition?: FloatingPosition;
  openDelay?: number;
  color?: string;
  iconSize?: number;
  variant?: ActionIconVariant;
  onClick?: () => void;
};

const useStyles = createStyles((theme, color) => ({
  icon: {
    width: "125%",
    height: "100%"
  }
}));

const NavIcon: React.FC<NavIconProps> = (props) => {
  const { classes } = useStyles();

  return (
    <Tooltip
      label={props.label}
      openDelay={props.openDelay || 500}
      position={props.labelPosition ?? "right"}
      withArrow
      arrowSize={10}
    >
      <ActionIcon
        className={classes.icon}
        onClick={props.onClick}
        size={"md"}
        p={"10%"}
        component={Link}
        to={props.destination}
        color={props.color}
        variant={props.variant}
      >
        <props.Icon size={props.iconSize ?? 36} />
      </ActionIcon>
    </Tooltip>
  );
};

export default NavIcon;
export const MemoNavIcon = React.memo(NavIcon);
