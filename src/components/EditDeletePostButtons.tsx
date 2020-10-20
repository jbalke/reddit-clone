import { Box, BoxProps, IconButton, Tooltip } from '@chakra-ui/core';
import Link from 'next/link';
import React from 'react';
import { PostContentFragment, useMeQuery } from '../generated/graphql';
import { postAction } from '../types';

type EditDeletePostButtonsProps = {
  post: PostContentFragment;
  handleDelete: postAction;
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
          <Tooltip label="Edit Post" aria-label="Edit Post" placement="bottom">
            <IconButton
              size="sm"
              mr={1}
              icon="edit"
              aria-label="Edit Post"
              isDisabled={!!post.flaggedAt || !!data?.me?.isBanned}
              variantColor="teal"
            />
          </Tooltip>
        </Link>
        <Tooltip
          label="Delete Post"
          aria-label="Delete Post"
          placement="bottom"
        >
          <IconButton
            size="sm"
            icon="delete"
            aria-label="Delete Post"
            onClick={handleDelete(post)}
            isDisabled={!!post.flaggedAt || !!data?.me?.isBanned}
            variantColor="teal"
          />
        </Tooltip>
      </Box>
    </>
  );
}

export default EditDeletePostButtons;
