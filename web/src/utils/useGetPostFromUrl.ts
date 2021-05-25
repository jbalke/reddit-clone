import { useRouter } from 'next/router';
import { useThreadQuery } from '../generated/graphql';

export const useGetPostFromUrl = (maxLevel: number = 0) => {
  const router = useRouter();
  const id = router.query.id as string;

  return useThreadQuery({
    variables: { id, maxLevel },
    requestPolicy: 'cache-and-network',
  });
};
