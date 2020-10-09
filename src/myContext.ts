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
  isModalOpen: boolean;
  setIsModalOpen?: React.Dispatch<SetStateAction<boolean>>;
};

export const MyContext = createContext<Context>({
  isModalOpen: false,
  secondsUntilNewPost: 0,
});
