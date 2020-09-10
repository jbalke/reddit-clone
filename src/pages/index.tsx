import { Box, List, ListItem } from '@chakra-ui/core';
import { usePostsQuery } from '../generated/graphql';

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <Box m={5}>
      <div>Hello World</div>
      <br />
      <List styleType="disc">
        {!data ? (
          <div>loading...</div>
        ) : (
          data.posts.map((p) => <ListItem key={p.id}>{p.title}</ListItem>)
        )}
      </List>
    </Box>
  );
};

export default Index;
