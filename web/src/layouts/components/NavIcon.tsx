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

const NavIcon: React.FC<NavIconProps> = ({
  Icon,
  destination,
  label,
  labelPosition,
  openDelay,
  color,
  iconSize,
  variant,
  onClick
}) => {
  const { classes } = useStyles();

  return (
    <Tooltip
      label={label}
      openDelay={openDelay || 500}
      position={labelPosition ?? "right"}
      withArrow
      arrowSize={10}
      styles={(theme) => ({
        tooltip: {
          border: `1px solid ${theme.colors.dark[3]}`
        },

        arrow: {
          border: `1px solid ${theme.colors.dark[3]}`
        },
      })}
    >
      <ActionIcon
        className={classes.icon}
        onClick={onClick}
        size={"md"}
        p={"10%"}
        component={Link}
        to={destination}
        color={color}
        variant={variant}
      >
        <Icon size={iconSize ?? 36} />
      </ActionIcon>
    </Tooltip>
  );
};

export default NavIcon;
export const MemoNavIcon = React.memo(NavIcon);
