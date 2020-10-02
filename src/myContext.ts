import { createContext } from 'react';

type Context = {
  resetUrqlClient?: () => any;
};

export const MyContext = createContext<Context>({});
