import { PostContentFragment, PostSummaryFragment } from '../generated/graphql';

export function isSummary(
  obj: PostSummaryFragment | PostContentFragment
): obj is PostSummaryFragment {
  return (obj as PostSummaryFragment).textSnippet !== undefined;
}
