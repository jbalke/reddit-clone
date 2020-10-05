import { createContext } from 'react';

export type Notification = {
  message?: '';
  status?: 'notification' | 'success' | 'warning' | 'error';
};

type Context = {
  resetUrqlClient?: () => any;
  notification?: Notification;
  setNotification?: (data: Notification) => any;
};

export const MyContext = createContext<Context>({});
