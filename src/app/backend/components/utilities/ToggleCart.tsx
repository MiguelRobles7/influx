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
          <ShoppingCart className="text-[#6157ff]" size={14} strokeWidth={3} />
          <h6 className="text-[#6157ff] font-normal text-xs">{value ? post.cart?.length || 0 : ''}</h6>
        </>
      ) : (
        <>
          <ShoppingCart className="text-gray-800" size={14} strokeWidth={3} />
          <h6 className="text-gray-800 font-normal text-xs">{value ? post.cart?.length || 0 : ''}</h6>
        </>
      )}
    </div>
  );
};

export default ToggleCart;
