import { PostSummaryFragment } from '../generated/graphql';

export function isSummary(obj: any): obj is PostSummaryFragment {
  return !!obj && 'textSnippet' in obj;
}
