import {
  Flex,
  FlexProps,
  Heading,
  Icon,
  Link as ChakraLink,
  Text,
} from '@chakra-ui/core';
import Link from 'next/link';
import React from 'react';
import Linkify from 'react-linkify';
import {
  MeQuery,
  PostContentFragment,
  PostSummaryFragment,
  useMeQuery,
} from '../generated/graphql';
import { postAction } from '../types';
import { isSummary } from '../utils/isSummary';
import { relativeTime } from '../utils/relativeTime';
import AdminControls from './AdminControls';
import EditDeletePostButtons from './EditDeletePostButtons';
import { NextChakraLink } from './NextChakraLink';
import TooltipButton from './TooltipButton';
import VoteSection from './VoteSection';

type PostProps = {
  post: PostContentFragment | PostSummaryFragment;
  preview?: boolean;
  handleDelete?: postAction;
  handleFlag?: postAction;
  handleLock?: postAction;
} & FlexProps;

function Post({
  post,
  preview = false,
  handleDelete,
  handleFlag,
  handleLock,
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
                    passHref
                  >
                    <MyButton data={data} />
                  </Link>
                )}
              {!isSummary(post) &&
              !post.isLocked &&
              data?.me?.id === post.author.id &&
              handleDelete ? (
                <EditDeletePostButtons
                  handleDelete={handleDelete}
                  post={post}
                />
              ) : null}
              {!isSummary(post) && data?.me?.isAdmin && handleFlag ? (
                <AdminControls post={post} handleFlag={handleFlag} ml={2} />
              ) : null}
            </Flex>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}

type MyButtonProps = {
  data: MeQuery;
  href?: string;
};
const MyButton = React.forwardRef(({ data, href }: MyButtonProps, ref) => {
  return (
    //@ts-ignore
    <a href={href} ref={ref}>
      <TooltipButton
        label="Reply to Post"
        icon="chat"
        isDisabled={data?.me?.isBanned}
        variantColor="teal"
      />
    </a>
  );
});

export default Post;
