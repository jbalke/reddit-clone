import { createContext } from 'react';

export type Notification = {
  message?: '';
  status?: 'notification' | 'success' | 'warning' | 'error';
};

type Context = {
  resetUrqlClient?: () => any;
  notification?: Notification;
  setNotification?: (data: Notification) => any;
  secondsUntilNewPost?: number;
};

export const MyContext = createContext<Context>({});
