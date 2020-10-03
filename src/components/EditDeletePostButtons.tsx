import { Box, BoxProps, IconButton } from '@chakra-ui/core';
import Link from 'next/link';
import React from 'react';
import { useDeletePostMutation } from '../generated/graphql';
import { useRouter } from 'next/router';

type EditDeletePostButtonsProps = {
  postId: number;
  opId?: number;
} & BoxProps;

function EditDeletePostButtons({
  postId,
  opId,
  ...props
}: EditDeletePostButtonsProps) {
  const [, deletePost] = useDeletePostMutation();
  const router = useRouter();

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
          await deletePost({ id: postId, opId });
          if (!opId) {
            router.push('/');
          }
        }}
      />
    </Box>
  );
}

export default EditDeletePostButtons;
