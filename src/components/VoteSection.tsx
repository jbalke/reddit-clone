import { Box, Flex, IconButton, Text } from '@chakra-ui/core';
import React, { useState } from 'react';
import {
  PostContentFragment,
  PostSummaryFragment,
  useMeQuery,
  useVoteMutation,
  Vote,
} from '../generated/graphql';

type VoteSectionProps = {
  post: PostSummaryFragment | PostContentFragment;
};

function VoteSection({ post }: VoteSectionProps) {
  const [, vote] = useVoteMutation();
  const [loadingState, setLoadingState] = useState<
    'upvote-loading' | 'downvote-loading' | 'not-loading'
  >('not-loading');
  const [{ data, fetching }] = useMeQuery();

  return (
    <Flex
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      mr={3}
    >
      <IconButton
        onClick={async () => {
          if (post.voteStatus === 1) {
            return;
          }
          setLoadingState('upvote-loading');
          await vote({ vote: Vote.Up, postId: post.id });
          setLoadingState('not-loading');
        }}
        isLoading={loadingState === 'upvote-loading' || fetching}
        isDisabled={
          data?.me?.id === post.author.id ||
          post.isLocked ||
          data?.me?.bannedUntil ||
          fetching ||
          !data?.me
        }
        aria-label="Upvote post"
        title="Upvote"
        icon="chevron-up"
        size="xs"
        variantColor={post.voteStatus === 1 ? 'green' : undefined}
      />
      <Flex direction="column" my={1}>
        <Box>
          <Text
            fontWeight="bold"
            color={
              post.score > 0 ? 'green.500' : post.score < 0 ? 'red.500' : ''
            }
            title="Score"
          >
            {post.score}
          </Text>
        </Box>
        <hr />
        <Box>
          <Text title="Votes">{post.voteCount}</Text>
        </Box>
      </Flex>
      <IconButton
        onClick={async () => {
          if (post.voteStatus === -1) {
            return;
          }
          setLoadingState('downvote-loading');
          await vote({ vote: Vote.Down, postId: post.id });
          setLoadingState('not-loading');
        }}
        isLoading={loadingState === 'downvote-loading'}
        isDisabled={
          data?.me?.id === post.author.id ||
          post.isLocked ||
          data?.me?.bannedUntil ||
          fetching ||
          !data?.me
        }
        aria-label="Downvote post"
        title="Downvote"
        icon="chevron-down"
        size="xs"
        variantColor={post.voteStatus === -1 ? 'red' : undefined}
      />
    </Flex>
  );
}

export default VoteSection;
