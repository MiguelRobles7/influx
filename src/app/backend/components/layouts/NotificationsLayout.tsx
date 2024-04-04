// 'use server'

import Image from 'next/image';
import { NotificationClass, PostClass, UserClass } from '@/src/libraries/structures';
import { formatDistance } from 'date-fns';

interface Props {
  notification: NotificationClass;
  user: UserClass;
  posts: PostClass[];
}

export default function NotificationsLayout({ notification, user, posts }: Props) {
  const result = formatDistance(new Date(notification.created_at), Date.now(), { addSuffix: true });
  let post = posts.find((post) => post.id === notification.related_post);

  console.log('Related: ', notification.related_post);
  return (
    <div className="notification-panel">
      <div className="main-row">
        <Image src={`/notification-icons/${notification.type}.svg`} alt="type" height={12} width={12} />
        <div className="content">
          <Image src={user.icon} alt="User Avatar" width={18} height={18} className="notification-avatar" />
          <p>{notification.content}</p>
        </div>
        <div className="time-ago">{result}</div>
      </div>
      {notification.related_post ? (
        <div className="sub-content">
          <Image
            src={post?.origin.banner || ''}
            width={52}
            height={28}
            className="notification-image"
            alt="amogus image"
          />
          <div className="details">
            <div className="top">
              <span>Posted in {post?.origin.name}</span>
              <span className="sub">@{post?.origin.handle}</span>
            </div>
            <div className="bottom">{post?.title}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
