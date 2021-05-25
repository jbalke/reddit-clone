import { SortBy, SortOptions } from '../generated/graphql';

type ReducerState = {
  limit: number;
  cursor: { value: number | undefined; timeStamp: string } | undefined;
  sortOptions: SortOptions;
};
type ActionTypes = 'SET_CURSOR' | 'SET_SORTOPTIONS';
export type ReducerAction = { type: ActionTypes; payload: any };

export function reducer(
  state: ReducerState,
  action: ReducerAction
): ReducerState {
  switch (action.type) {
    case 'SET_CURSOR':
      let newCursor;
      switch (state.sortOptions?.sortBy) {
        case SortBy.Score:
          newCursor = {
            value: action.payload.lastPost.score,
            timeStamp: action.payload.lastPost.createdAt,
          };
          break;
        case SortBy.Replies:
          newCursor = {
            value: action.payload.lastPost.replies,
            timeStamp: action.payload.lastPost.createdAt,
          };
          break;
        default:
          newCursor = {
            value: undefined,
            timeStamp: action.payload.lastPost.createdAt,
          };
          break;
      }
      const newState = { ...state, cursor: newCursor };
      return newState;

    case 'SET_SORTOPTIONS':
      const newSortState = {
        ...state,
        cursor: undefined,
        sortOptions: action.payload,
      };
      return newSortState;

    default:
      return state;
  }
}
