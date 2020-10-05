import { Box, Flex, IconButton, Text } from '@chakra-ui/core';
import React, { useState } from 'react';
import {
  PostContentFragment,
  PostSummaryFragment,
  useMeQuery,
  useVoteMutation,
  Vote,
} from '../generated/graphql';
import { isServer } from '../utils/isServer';

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
    <Flex direction="column" justifyContent="center" alignItems="center" mr={2}>
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
        isDisabled={data?.me?.id === post.author.id || !data?.me}
        aria-label="Upvote post"
        title="Upvote"
        icon="chevron-up"
        size="md"
        variantColor={post.voteStatus === 1 ? 'green' : undefined}
      />
      <Flex direction="column" my={2}>
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
        isDisabled={data?.me?.id === post.author.id || fetching || !data?.me}
        aria-label="Downvote post"
        title="Downvote"
        icon="chevron-down"
        size="md"
        variantColor={post.voteStatus === -1 ? 'red' : undefined}
      />
    </Flex>
  );
}

export default VoteSection;
