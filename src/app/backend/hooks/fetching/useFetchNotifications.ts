import useFetchUsers from '@/src/app/backend/hooks/fetching/useFetchUsers';
import useFetchCommunities from '@/src/app/backend/hooks/fetching/useFetchCommunities';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { NotificationClass, PostClass, CommunityClass, UserClass } from '@/src/libraries/structures';

import Supabase from '@/src/app/backend/model/supabase';

type Dispatcher<S> = Dispatch<SetStateAction<S>>;

interface Props {
  type?: string;
  query?: string;
  notifications: NotificationClass[];
  setNotifications: Dispatcher<NotificationClass[]>;
}

const FetchNotifications = ({ type, query, notifications, setNotifications }: Props) => {
  const [users, setUsers] = useState<UserClass[]>([]);

  const fetchPosts = async () => {
    let SupabaseQuery = Supabase.from('notifications').select('*');

    if (type && ['author_id', 'origin_id'].includes(type)) SupabaseQuery = SupabaseQuery.eq(type, query);

    console.log('Fetching notifications...');
    console.log(SupabaseQuery.toString());

    const { data, error } = await SupabaseQuery;
    if (error) throw error;
    if (!data) return;

    setNotifications(data);
  };

  useEffect(() => {
    if (notifications.length === 0) fetchPosts();
  }, []);
};

export default FetchNotifications;
