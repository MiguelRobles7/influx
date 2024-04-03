'use client'; //* Uses interactable components

import Supabase from '@/src/app/backend/model/supabase';
import React, { useState } from 'react';
import { PostClass, UserClass } from '@/src/libraries/structures';
import { useGlobalContext } from '@/src/app/backend/hooks/context/useGlobalContext';
import { ShoppingBag, ShoppingCart } from 'lucide-react';

interface Props {
  value?: boolean;
  post: PostClass;
}

const ToggleCart: React.FC<Props> = ({ value, post }) => {
  const savePostCart = async () => {
    const { data, error } = await Supabase.from('posts').update({ cart: post.cart }).eq('id', post.id);

    if (error) throw error;
  };

  const saveUserCart = async () => {
    const { data, error } = await Supabase.from('profiles').update({ cart: user.cart }).eq('uuid', user.uuid);

    if (error) throw error;
  };

  const { user, setUser } = useGlobalContext();
  const [carted, setCarted] = useState(post.cart?.includes(user.uuid));

  const sendNotification = async () => {
    const notification: any = {
      type: 'item_carted',
      content: `@${user.handle} added your listing to their shopping cart.`,
      related_post: post?.id,
      is_read: false,
    };

    let { data, error } = await Supabase.from('notifications').insert(notification).select('id');

    if (error) throw error;
    else {
      if (user.notifications && data) {
        user.notifications.push(data[0].id);
      } else {
        console.log('No notifications', user.notifications, data);
      }
    }

    let { data: data2, error: error2 } = await Supabase.from('profiles')
      .update({ notifications: user.notifications })
      .eq('id', user.id);
    if (error2) throw error2;
  };

  const handleCartedToggle = () => {
    if (user.uuid === '') return;
    if (!carted) {
      post.cart?.push(user.uuid);
      user.cart?.push(post.id);
      savePostCart();
      saveUserCart();
      setUser(
        new UserClass({
          ...user,
          cart: user.cart,
        })
      );
      setCarted(true);
      sendNotification();
    } else {
      post.cart?.splice(post.cart?.indexOf(user.uuid), 1);
      user.cart?.splice(user.cart?.indexOf(post.id), 1);
      savePostCart();
      saveUserCart();
      setUser(
        new UserClass({
          ...user,
          cart: user.cart,
        })
      );
      setCarted(false);
    }
  };

  return (
    <div
      className={`interaction-row  ${carted ? 'bg-violet-200 hover:bg-violet-300' : 'hover:bg-gray-200 '}`}
      onClick={handleCartedToggle}
    >
      {carted ? (
        <>
          <ShoppingCart className="text-[#6157ff]" size={12} strokeWidth={3} />
          <h6 className="text-[#6157ff] font-normal text-xs">{value ? post.cart?.length || 0 : ''}</h6>
        </>
      ) : (
        <>
          <ShoppingCart className="" size={12} strokeWidth={3} />
          <h6 className=" font-normal text-xs">{value ? post.cart?.length || 0 : ''}</h6>
        </>
      )}
    </div>
  );
};

export default ToggleCart;
