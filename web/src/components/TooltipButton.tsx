import { IconButton, IconButtonProps, Tooltip } from '@chakra-ui/core';
import React from 'react';

type TooltipButtonProps = {
  label: string;
} & Omit<IconButtonProps, 'aria-label'>;

function TooltipButton({ label, ...props }: TooltipButtonProps) {
  return (
    <Tooltip label={label} aria-label={label} placement="bottom">
      <IconButton size="sm" aria-label={label} {...props} />
    </Tooltip>
  );
}

export default TooltipButton;
