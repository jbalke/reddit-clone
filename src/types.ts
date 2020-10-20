import { PostContentFragment } from './generated/graphql';

export type Breakpoints = string[] & {
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
};

export type postAction = (
  p: PostContentFragment
) => (event: React.MouseEvent<any, globalThis.MouseEvent>) => void;
