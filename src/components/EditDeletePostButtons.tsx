import { Box, BoxProps, IconButton } from '@chakra-ui/core';
import Link from 'next/link';
import React from 'react';
import { PostContentFragment, useMeQuery } from '../generated/graphql';

type EditDeletePostButtonsProps = {
  post: PostContentFragment;
  handleDelete: any;
} & BoxProps;

function EditDeletePostButtons({
  post,
  handleDelete,
  ...props
}: EditDeletePostButtonsProps) {
  const [{ data }] = useMeQuery();

  return (
    <>
      <Box {...props}>
        <Link href={`/post/edit/${post.id}`}>
          <IconButton
            mr={2}
            icon="edit"
            aria-label="Edit Post"
            title={data!.me?.isBanned ? 'Banned' : 'Edit Post'}
            isDisabled={!!post.flaggedAt || !!data?.me?.isBanned}
          />
        </Link>
        <IconButton
          icon="delete"
          aria-label="Delete Post"
          title={data!.me?.isBanned ? 'Banned' : 'Delete Post'}
          onClick={handleDelete(post)}
          isDisabled={!!post.flaggedAt || !!data?.me?.isBanned}
        />
      </Box>
    </>
  );
}

export default EditDeletePostButtons;
