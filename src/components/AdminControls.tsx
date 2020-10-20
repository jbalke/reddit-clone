import { Flex, FlexProps, IconButton, Tooltip } from '@chakra-ui/core';
import React from 'react';
import { PostContentFragment } from '../generated/graphql';
import { postAction } from '../types';

type AdminControlsProps = {
  post: PostContentFragment;
  handleFlag: postAction;
} & FlexProps;

function AdminControls({ post, handleFlag, ...props }: AdminControlsProps) {
  return (
    <>
      <Flex justify="center" {...props}>
        <Tooltip label="Flag Post" aria-label="Flag Post" placement="bottom">
          <IconButton
            size="sm"
            icon="warning"
            aria-label="Flag Post"
            // title="Flag Post"
            isDisabled={!!post.flaggedAt}
            onClick={handleFlag(post)}
            variantColor="orange"
          />
        </Tooltip>
        {/* <IconButton
          icon="delete"
          aria-label="Delete Post"
          title="Delete Post"
          onClick={handleDelete(post)}
        /> */}
      </Flex>
    </>
  );
}

export default AdminControls;
