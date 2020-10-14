import { Flex, FlexProps, Heading, IconButton, Text } from '@chakra-ui/core';
import Link from 'next/link';
import {
  PostContentFragment,
  PostSummaryFragment,
  useMeQuery,
} from '../generated/graphql';
import { isSummary } from '../utils/isSummary';
import { relativeTime } from '../utils/relativeTime';
import EditDeletePostButtons from './EditDeletePostButtons';
import { NextChakraLink } from './NextChakraLink';
import VoteSection from './VoteSection';

type PostProps = {
  post: PostContentFragment | PostSummaryFragment;
  preview?: boolean;
  handleDelete?: any;
} & FlexProps;

function Post({
  post,
  preview = false,
  handleDelete,
  ...flexProps
}: PostProps) {
  const [{ data, fetching }] = useMeQuery();

  return (
    <Flex {...flexProps}>
      {!preview && <VoteSection post={post} />}
      <Flex direction="column" flexGrow={1} justifyContent="space-between">
        <Flex mb={1} justifyContent="space-between">
          <Text fontSize="xs">
            {!post.originalPost ? `Posted by ` : ' '}
            <NextChakraLink fontSize="xs" href={`/user/${post.author.id}`}>
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
        <Text whiteSpace={isSummary(post) ? undefined : 'pre-wrap'}>
          {isSummary(post) ? post.textSnippet : post.text}
        </Text>
        {!preview && (
          <Flex mt={2} justifyContent="space-between" alignItems="center">
            <Text fontSize="sm">Replies: {post.replies}</Text>
            {data?.me?.id && data.me.id !== post.author.id && (
              <Link
                href={
                  post.reply?.id
                    ? `/post/edit/${post.reply?.id}`
                    : `/reply/${post.id}`
                }
              >
                <IconButton
                  icon="chat"
                  aria-label="Reply to Post"
                  title={data.me.isBanned ? 'Banned' : 'Reply'}
                  isDisabled={data.me.isBanned}
                />
              </Link>
            )}
            {!isSummary(post) && data?.me?.id === post.author.id ? (
              <EditDeletePostButtons
                handleDelete={handleDelete}
                post={post}
                display="flex"
              />
            ) : null}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
export default Post;
