import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';
import { isServer } from './isServer';

export const useIsAuth = () => {
  const [{ data, fetching }] = useMeQuery({ pause: isServer() });
  const router = useRouter();

  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace('/login?next=' + router.pathname);
    }
  }, [data, fetching]);
};
