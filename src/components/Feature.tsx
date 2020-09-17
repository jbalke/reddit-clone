import { Box, Heading, Text, Flex, Link as ChakraLink } from '@chakra-ui/core';
import { User } from '../generated/graphql';
import Link from 'next/link';

interface Author {
  userId: string;
  username: string;
}
interface FeatureProps {
  title: string;
  text: string;
  author: Pick<User, 'id' | 'username'>;
  points: number;
  date: Date;
}

const DateOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false,
};

function Feature({ title, text, author, date, points }: FeatureProps) {
  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Flex justifyContent="space-between">
        <Box>
          <Heading fontSize="xl">{title}</Heading>
          <ChakraLink as="sup" fontWeight="bold">
            <Link href={`/user/${author.id}`}>{`by ${author.username}`}</Link>
          </ChakraLink>
        </Box>
        <Text as="sup">
          {new Intl.DateTimeFormat('default', DateOptions).format(
            new Date(date)
          )}
        </Text>
      </Flex>
      <Text mt={4}>{text}</Text>
    </Box>
  );
}
export default Feature;
