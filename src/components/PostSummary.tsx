import { Flex, Heading, Link as ChakraLink, Text } from '@chakra-ui/core';
import Link from 'next/link';
import VoteSection from '../components/VoteSection';
import { __DateOptions__ } from '../constants';
import { PostSummaryFragment, User } from '../generated/graphql';

interface Author {
  userId: string;
  username: string;
}
interface PostSummaryProps {
  post: PostSummaryFragment;
}

function PostSummary({ post }: PostSummaryProps) {
  return (
    <Flex p={5} shadow="md" borderWidth="1px" mb={4}>
      <VoteSection post={post} />
      <Flex direction="column" flexGrow={1}>
        <Flex justifyContent="space-between">
          <Flex direction="column">
            <Heading fontSize="xl">{post.title}</Heading>
            <ChakraLink fontSize="xs" fontWeight="bold">
              <Link
                href={`/user/${post.author.id}`}
              >{`by ${post.author.username}`}</Link>
            </ChakraLink>
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
      </Flex>
    </Flex>
  );
}
export default PostSummary;
