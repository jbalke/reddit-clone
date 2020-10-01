import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';

export const useIsAuthenticatedAndVerified = () => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (!fetching) {
      if (!data?.me) {
        router.replace('/login?next=' + router.asPath);
      } else if (!data.me.verified) {
        router.replace('/resend-verification');
      } else if (data.me.isBanned) {
        router.replace('/banned');
      }
    }
  }, [data, fetching]);
};
