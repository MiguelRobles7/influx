'use client'; //* Uses interactable components

import useFetchToken from '@/src/app/backend/hooks/fetching/useFetchToken';
import useFetchPosts from '@/src/app/backend/hooks/fetching/useFetchPosts';
import useFetchNotifications from '@/src/app/backend/hooks/fetching/useFetchNotifications';
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';
import { UserClass, PostClass, NotificationClass } from '@/src/libraries/structures';

type Dispatcher<S> = Dispatch<SetStateAction<S>>;

interface Props {
  user: UserClass;
  setUser: Dispatcher<UserClass>;
  posts: PostClass[];
  setPosts: Dispatcher<PostClass[]>;
  notifications: NotificationClass[];
  setNotifications: Dispatcher<NotificationClass[]>;
}

const GlobalContext = createContext<Props>({
  user: new UserClass({
    icon: '/root/temp.jpg',
    banner: '/root/temp.jpg',
  }),
  setUser: () => {},
  posts: [],
  setPosts: () => {},
  notifications: [],
  setNotifications: () => {},
});

export const useGlobalContext = () => useContext(GlobalContext);

export const useRefreshContext = () => {
  const { user, setUser, posts, setPosts, notifications, setNotifications } = useGlobalContext();
  useFetchToken({ user, setUser });
  useFetchPosts({ posts, setPosts });
  useFetchNotifications({ notifications, setNotifications });
};

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserClass>(
    new UserClass({
      icon: '/root/temp.jpg',
      banner: '/root/temp.jpg',
    })
  );
  const [posts, setPosts] = useState<PostClass[]>([]);
  const [notifications, setNotifications] = useState<NotificationClass[]>([]);
  useRefreshContext();

  return (
    <GlobalContext.Provider value={{ user, setUser, posts, setPosts, notifications, setNotifications }}>
      {children}
    </GlobalContext.Provider>
  );
};
