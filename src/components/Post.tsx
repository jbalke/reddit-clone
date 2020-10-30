import {
  Flex,
  FlexProps,
  Heading,
  Icon,
  IconButton,
  Link as ChakraLink,
  Text,
} from '@chakra-ui/core';
import Link from 'next/link';
import React from 'react';
import Linkify from 'react-linkify';
import {
  PostContentFragment,
  PostSummaryFragment,
  useMeQuery,
} from '../generated/graphql';
import { isSummary } from '../utils/isSummary';
import { relativeTime } from '../utils/relativeTime';
import AdminControls from './AdminControls';
import EditDeletePostButtons from './EditDeletePostButtons';
import { NextChakraLink } from './NextChakraLink';
import VoteSection from './VoteSection';

type PostProps = {
  post: PostContentFragment | PostSummaryFragment;
  preview?: boolean;
} & FlexProps;

function Post({ post, preview = false, ...flexProps }: PostProps) {
  const [{ data }] = useMeQuery();

  return (
    <Flex {...flexProps}>
      {!preview && <VoteSection post={post} />}
      <Flex direction="column" flexGrow={1} justifyContent="space-between">
        <Flex mb={1} justifyContent="space-between">
          <Text fontSize="xs">
            {!post.originalPost ? `Posted by ` : ' '}
            <NextChakraLink
              fontSize="xs"
              href={`/user-profile/${post.author.id}`}
            >
              {`${post.author.username}`}
            </NextChakraLink>{' '}
            {relativeTime(post.createdAt)}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Flex direction="column">
            <NextChakraLink href={`/post/${post.id}`}>
              <Heading fontSize="xl">{post.title}</Heading>
            </NextChakraLink>
          </Flex>
          <Flex direction="column" alignItems="flex-end"></Flex>
        </Flex>
        <Linkify
          componentDecorator={(decoratedHref, decoratedText, key) => (
            <ChakraLink
              isExternal
              href={decoratedHref}
              key={key}
              color="teal.500"
            >
              {decoratedText}
            </ChakraLink>
          )}
        >
          <div style={{ whiteSpace: isSummary(post) ? undefined : 'pre-wrap' }}>
            {isSummary(post) ? post.textSnippet : post.text}
          </div>
        </Linkify>
        {!preview && (
          <Flex mt={2} justifyContent="space-between" alignItems="center">
            <Text fontSize="sm">Replies: {post.replies}</Text>
            <Flex justifyContent="flex-end" alignItems="center">
              {post.isPinned &&
                post.level === 0 &&
                (!data?.me?.isAdmin || isSummary(post)) && (
                  <Icon name="star" color="teal.500" title="pinned" />
                )}
              {post.isLocked &&
                post.level === 0 &&
                (!data?.me?.isAdmin || isSummary(post)) && (
                  <Icon name="lock" color="red.500" title="Locked" />
                )}
              {!isSummary(post) &&
                !post.isLocked &&
                data?.me?.id !== post.author.id && (
                  <Link
                    href={
                      post.reply?.id
                        ? `/post/edit/${post.reply?.id}`
                        : `/reply/${post.id}`
                    }
                  >
                    <IconButton
                      aria-label="Reply to Post"
                      title="Reply to Post"
                      icon="chat"
                      isDisabled={data?.me?.isBanned}
                      variantColor="teal"
                    />
                  </Link>
                )}
              {!isSummary(post) &&
                !post.isLocked &&
                data?.me?.id === post.author.id && (
                  <EditDeletePostButtons post={post} />
                )}
              {!isSummary(post) && data?.me?.isAdmin && (
                <AdminControls post={post} ml={2} />
              )}
            </Flex>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}

export default Post;
