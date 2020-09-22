import { Box, BoxProps, IconButton } from '@chakra-ui/core';
import Link from 'next/link';
import React from 'react';
import { useDeletePostMutation } from '../generated/graphql';

type EditDeletePostButtonsProps = {
  postId: string;
} & BoxProps;

function EditDeletePostButtons({
  postId,
  ...props
}: EditDeletePostButtonsProps) {
  const [, deletePost] = useDeletePostMutation();

  return (
    <Box {...props}>
      <Link href={`/post/edit/${postId}`}>
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
        onClick={async () => {
          await deletePost({ id: postId });
        }}
      />
    </Box>
  );
}

export default EditDeletePostButtons;
