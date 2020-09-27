import { Flex, FlexProps, Heading, IconButton, Text } from '@chakra-ui/core';
import { __DateOptions__ } from '../constants';
import {
  PostContentFragment,
  PostSummaryFragment,
  useMeQuery,
} from '../generated/graphql';
import { isSummary } from '../utils/isSummary';
import EditDeletePostButtons from './EditDeletePostButtons';
import { NextChakraLink } from './NextChakraLink';
import VoteSection from './VoteSection';
import Link from 'next/link';

type PostProps = {
  post: PostContentFragment | PostSummaryFragment;
  opId: string | null;
} & FlexProps;

function Post({ post, opId, ...flexProps }: PostProps) {
  const [{ data, fetching }] = useMeQuery();

  return (
    <Flex p={4} {...flexProps}>
      <VoteSection post={post} />
      <Flex direction="column" flexGrow={1} justifyContent="space-between">
        <Flex justifyContent="space-between">
          <Flex direction="column">
            <NextChakraLink href={`/post/${post.id}`}>
              <Heading fontSize="xl">{post.title}</Heading>
            </NextChakraLink>
            <NextChakraLink
              fontSize="xs"
              fontWeight="bold"
              href={`/user/${post.author.id}`}
            >
              {`by ${post.author.username}`}
            </NextChakraLink>
          </Flex>
          <Flex direction="column" alignItems="flex-end">
            <Text fontSize="xs">
              Posted:{' '}
              {new Intl.DateTimeFormat('default', __DateOptions__).format(
                new Date(post.createdAt)
              )}
            </Text>
            {post.createdAt !== post.updatedAt ? (
              <Text fontSize="xs" lineHeight={0.75}>
                Updated:{' '}
                {new Intl.DateTimeFormat('default', __DateOptions__).format(
                  new Date(post.updatedAt)
                )}
              </Text>
            ) : null}
          </Flex>
        </Flex>
        <Text mt={4}>{isSummary(post) ? post.textSnippet : post.text}</Text>
        <Flex mt={2} justifyContent="space-between" alignItems="center">
          <Text fontSize="sm">Replies: {post.replies}</Text>
          <Link href={`/reply/${post.id}?opid=${opId}`}>
            <IconButton icon="chat" aria-label="Reply to Post" title="Reply" />
          </Link>
          {data?.me?.id === post.author.id ? (
            <EditDeletePostButtons postId={post.id} display="flex" />
          ) : null}
        </Flex>
      </Flex>
    </Flex>
  );
}
export default Post;
