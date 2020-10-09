import { Box, BoxProps, IconButton } from '@chakra-ui/core';
import Link from 'next/link';
import React from 'react';
import { PostContentFragment, PostSummaryFragment } from '../generated/graphql';

type EditDeletePostButtonsProps = {
  post: PostSummaryFragment | PostContentFragment;
  handleDelete: any;
} & BoxProps;

function EditDeletePostButtons({
  post,
  handleDelete,
  ...props
}: EditDeletePostButtonsProps) {
  return (
    <>
      <Box {...props}>
        <Link href={`/post/edit/${post.id}`}>
          <IconButton
            mr={2}
            icon="edit"
            aria-label="Edit Post"
            title="Edit Post"
          />
        </Link>
        <IconButton
          icon="delete"
          aria-label="Delete Post"
          title="Delete Post"
          onClick={handleDelete(post)}
        />
      </Box>
    </>
  );
}

export default EditDeletePostButtons;
