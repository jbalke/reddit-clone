import { Flex } from '@chakra-ui/core';
import React, { Dispatch } from 'react';
import { Sort, SortBy } from '../generated/graphql';
import { ReducerAction } from '../state/posts';
import TooltipButton from './TooltipButton';

type SortControlsProps = {
  dispatch: Dispatch<ReducerAction>;
};

function SortControls({ dispatch }: SortControlsProps) {
  return (
    <Flex justifyContent="flex-start">
      <TooltipButton
        label="Newest"
        icon="time"
        onClick={() =>
          dispatch({
            type: 'SET_SORTOPTIONS',
            payload: { sortBy: SortBy.Age, sortDirection: Sort.Desc },
          })
        }
      />
      <TooltipButton
        label="Most Discussed"
        icon="chat"
        onClick={() =>
          dispatch({
            type: 'SET_SORTOPTIONS',
            payload: { sortBy: SortBy.Replies, sortDirection: Sort.Desc },
          })
        }
      />
      <TooltipButton
        label="Highest Score"
        icon="arrow-up-down"
        onClick={() =>
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
