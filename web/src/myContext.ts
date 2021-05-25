import { createContext, SetStateAction } from 'react';

export type Notification = {
  message?: '';
  status?: 'notification' | 'success' | 'warning' | 'error';
};

type Context = {
  resetUrqlClient?: () => any;
  notification?: Notification;
  setNotification?: React.Dispatch<SetStateAction<Notification>>;
  secondsUntilNewPost: number;
};

export const MyContext = createContext<Context>({
  secondsUntilNewPost: 0,
});
