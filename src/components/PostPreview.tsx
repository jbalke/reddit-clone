import { Flex, FlexProps, Heading, Text } from '@chakra-ui/core';
import { __DateOptions__ } from '../constants';
import { PostContentFragment, useMeQuery } from '../generated/graphql';
import { isSummary } from '../utils/isSummary';
import { NextChakraLink } from './NextChakraLink';

type PostProps = {
  post: PostContentFragment;
} & FlexProps;

function PostPreview({ post, ...flexProps }: PostProps) {
  const [{ data, fetching }] = useMeQuery();

  return (
    <Flex p={4} {...flexProps}>
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
      </Flex>
    </Flex>
  );
}
export default PostPreview;
