import { Box, BoxProps, IconButton } from '@chakra-ui/core';
import Link from 'next/link';
import React from 'react';
import { PostContentFragment, PostSummaryFragment } from '../generated/graphql';

type EditDeletePostButtonsProps = {
  post: PostContentFragment;
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
            isDisabled={!!post.flaggedAt}
          />
        </Link>
        <IconButton
          icon="delete"
          aria-label="Delete Post"
          title="Delete Post"
          onClick={handleDelete(post)}
          isDisabled={!!post.flaggedAt}
        />
      </Box>
    </>
  );
}

export default EditDeletePostButtons;
