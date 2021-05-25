import { useRouter } from 'next/router';

export const useGetParamFromUrl = (param: string) => {
  const router = useRouter();
  const value = router.query[param];

  return router.query[param] ? router.query[param] : undefined;
};
