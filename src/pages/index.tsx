import {
  Link as ChakraLink,
  Text,
  Code,
  Icon,
  List,
  ListIcon,
  ListItem,
  Box,
} from '@chakra-ui/core';
import Link from 'next/link';
import Header from '../components/Header';

const Index = () => (
  <div>
    <Header />
    <Box mt={5}>Home</Box>
  </div>
);

export default Index;
