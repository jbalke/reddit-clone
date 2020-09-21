import { Flex, Heading, IconButton, Text } from '@chakra-ui/core';
import { NextChakraLink } from '../components/NextChakraLink';
import VoteSection from '../components/VoteSection';
import { __DateOptions__ } from '../constants';
import {
  PostSummaryFragment,
  useDeletePostMutation,
} from '../generated/graphql';

interface Author {
  userId: string;
  username: string;
}
interface PostSummaryProps {
  post: PostSummaryFragment;
}

function PostSummary({ post }: PostSummaryProps) {
  const [, deletePost] = useDeletePostMutation();

  return (
    <Flex p={5} shadow="md" borderWidth="1px" mb={4}>
      <VoteSection post={post} />
      <Flex direction="column" flexGrow={1}>
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
            <Text as="sup">
              {new Intl.DateTimeFormat('default', __DateOptions__).format(
                new Date(post.createdAt)
              )}
            </Text>
          </Flex>
        </Flex>
        <Text mt={4}>{post.textSnippet}</Text>
        <IconButton
          alignSelf="flex-end"
          icon="delete"
          aria-label="Delete Post"
          title="Delete Post"
          variantColor="red"
          onClick={async () => {
            await deletePost({ id: post.id });
          }}
        />
      </Flex>
    </Flex>
  );
}
export default PostSummary;
