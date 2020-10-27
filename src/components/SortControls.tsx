import { Flex, Tooltip, IconButton } from '@chakra-ui/core';
import { Icons } from '@chakra-ui/core/dist/theme/icons';
import React, { Dispatch, SetStateAction } from 'react';
import { Sort, SortBy, SortOptions } from '../generated/graphql';
import { ReducerAction } from '../pages';

type SortControlsProps = {
  dispatch: Dispatch<ReducerAction>;
};

type TooltipIconProps = {
  label: string;
  icon: Icons;
  setSortOptions: () => void;
};

function TooltipIcon({ label, icon, setSortOptions }: TooltipIconProps) {
  return (
    <Tooltip label={label} aria-label={label} placement="bottom">
      <IconButton
        size="sm"
        icon={icon}
        aria-label={label}
        onClick={() => setSortOptions()}
      />
    </Tooltip>
  );
}
function SortControls({ dispatch }: SortControlsProps) {
  return (
    <Flex justifyContent="flex-start">
      <TooltipIcon
        label="Newest"
        icon="time"
        setSortOptions={() =>
          dispatch({
            type: 'SET_SORTOPTIONS',
            payload: { sortBy: SortBy.Age, sortDirection: Sort.Desc },
          })
        }
      />
      <TooltipIcon
        label="Most Discussed"
        icon="chat"
        setSortOptions={() =>
          dispatch({
            type: 'SET_SORTOPTIONS',
            payload: { sortBy: SortBy.Replies, sortDirection: Sort.Desc },
          })
        }
      />
      <TooltipIcon
        label="Highest Score"
        icon="arrow-up-down"
        setSortOptions={() =>
          dispatch({
            type: 'SET_SORTOPTIONS',
            payload: { sortBy: SortBy.Score, sortDirection: Sort.Desc },
          })
        }
      />
    </Flex>
  );
}

export default SortControls;
