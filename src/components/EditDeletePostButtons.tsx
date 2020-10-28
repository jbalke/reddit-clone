import { Box, BoxProps } from '@chakra-ui/core';
import Link from 'next/link';
import React from 'react';
import { MeQuery, PostContentFragment, useMeQuery } from '../generated/graphql';
import { postAction } from '../types';
import TooltipButton from './TooltipButton';

type EditDeletePostButtonsProps = {
  post: PostContentFragment;
  handleDelete: postAction;
} & BoxProps;

//TODO: Clean this up!
type MyButtonProps = {
  post: PostContentFragment;
  data: MeQuery | undefined;
  href?: string;
};
const MyButton = React.forwardRef(
  ({ post, data, href }: MyButtonProps, ref) => {
    return (
      //@ts-ignore
      <a href={href} ref={ref}>
        <TooltipButton
          size="sm"
          mr={1}
          icon="edit"
          label="Edit Post"
          isDisabled={!!post.flaggedAt || !!data?.me?.isBanned}
          variantColor="teal"
        />
      </a>
    );
  }
);

function EditDeletePostButtons({
  post,
  handleDelete,
  ...props
}: EditDeletePostButtonsProps) {
  const [{ data }] = useMeQuery();

  return (
    <>
      <Box {...props}>
        <Link href={`/post/edit/${post.id}`} passHref>
          <MyButton post={post} data={data} />
        </Link>
        <TooltipButton
          size="sm"
          label="Delete Post"
          icon="delete"
          onClick={handleDelete(post)}
          isDisabled={!!post.flaggedAt || !!data?.me?.isBanned}
          variantColor="teal"
        />
      </Box>
    </>
  );
}

export default EditDeletePostButtons;
