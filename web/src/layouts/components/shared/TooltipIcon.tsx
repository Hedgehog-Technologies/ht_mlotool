import { ActionIcon, Tooltip } from "@mantine/core";
import { IconType } from "react-icons";
import { Link } from "react-router-dom";

interface TTIProps {
  Icon: IconType;
  label?: string;
  destination?: string;
  openDelay?: number;
  color?: string;
  iconSize?: number;
  onClick?: () => void;
};

const TooltipIcon: React.FC<TTIProps> = (props) => {
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

export default TooltipIcon;
