import { Box, Heading, Text, Flex } from '@chakra-ui/core';

interface FeatureProps {
  title: string;
  text: string;
  author?: string;
  date: Date;
}

function Feature({ title, text, author, date }: FeatureProps) {
  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Flex justifyContent="space-between">
        <Heading fontSize="xl">{title}</Heading>
        <Text as="sup">
          {date.toLocaleString('en-GB', {
            timeZone: 'UTC',
          })}
        </Text>
      </Flex>
      <Text mt={4}>{text}</Text>
    </Box>
  );
}
export default Feature;
