import { useRouter } from 'next/router';
import { usePostQuery } from '../generated/graphql';

export const useGetPostFromUrl = () => {
  const router = useRouter();
  const id = router.query.id as string;

  return usePostQuery({ variables: { id } });
};
