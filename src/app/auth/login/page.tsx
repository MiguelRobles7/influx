'use client'; //* Uses interactable components

import supabase from '@/src/app/backend/model/supabase';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthError } from '@supabase/supabase-js';
import { AtSign, Check, ChevronLeft, KeySquare, Sparkle } from 'lucide-react';

const Login: React.FC = () => {
  let router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState({ password: '' });

  const [errorEmailMessage, setErrorEmailMessage] = useState<string>(''); // Add error message state
  const [errorPasswordMessage, setErrorPasswordMessage] = useState<string>(''); // Add error message state
  const [errorMessage, setErrorMessage] = useState<string>(''); // Add error message state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Add submission status state

  const [rememberMe, setRememberMe] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPw, setIsValidPw] = useState(false);

  const fetchIdNum = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('id');
      if (error) {
        throw error;
      }
      console.log(data);
      if (data && data.length > 0) {
        const ids = data.map((user) => user.id);
        const highestId = Math.max(...ids); // Find the highest number in the IDs array
        return highestId + 1;
      } else {
        console.log('No user found');
        return [];
      }
    } catch (error) {
      console.log('Error fetching user:', error);
      return [];
    }
  };

  const fetchUUID = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('uuid');
      if (error) {
        throw error;
      }
      console.log(data);
      if (data && data.length > 0) {
        const uuids = data.map((user) => user.uuid);
        return uuids;
      } else {
        console.log('No user found');
        return [];
      }
    } catch (error) {
      console.log('Error fetching user:', error);
      return [];
    }
  };

  const handleChangeForm = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    console.log(event.target.name, event.target.value);

    // Check if the input name is "email_address" and if it contains "@" in the value
    if (event.target.value.includes('@')) {
      setErrorEmailMessage('')
      setIsValidEmail(true);
    } else if (event.target.value.length == 0) {
      setErrorEmailMessage('');
      setIsValidEmail(false);
    } else {
      setErrorEmailMessage('Invalid email address.');
      setIsValidEmail(false);
    }

    setEmail(event.target.value);
  };

  const handleChangePw = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    console.log(event.target.name, event.target.value);
    if (event.target.value.length >= 8) {
      setErrorPasswordMessage('');
      setIsValidPw(true);
    } else if (event.target.value.length == 0) {
      setErrorPasswordMessage('');
      setIsValidPw(false);
    } else {
      setErrorPasswordMessage('Must be at least 8 characters.');
      setIsValidPw(false);
    }

    setPassword((prevPassword) => {
      return {
        ...prevPassword,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true); // Set isSubmitting to true when the form is being submitted
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password.password,
      });

      if (error) throw error;
      else {
        if (!error) {
          // Clear any previously stored login credentials
          localStorage.removeItem('rememberedUser');

          if (rememberMe) {
            // Store login credentials securely in local storage with a 30-day expiration
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 21);
            localStorage.setItem(
              'rememberedUser',
              JSON.stringify({
                email: email,
                password: password.password,
                expiration: expirationDate.toISOString(),
              })
            );
          }
          const token = localStorage.getItem('sb-pmjwqjsoojzbascysdbk-auth-token');
          if (token) {
            const tokenData = JSON.parse(token);
            const tMetaFName = tokenData.user.user_metadata.first_name;
            const tMetaLName = tokenData.user.user_metadata.last_name;
            const tMetaHandle = tokenData.user.user_metadata.handle;
            const tID = tokenData.user.id;

            const idNum = await fetchIdNum();
            const profiles = await fetchUUID();
            const existingProfile = profiles.includes(tID);

            if (!existingProfile) {
              const newProfile: any = {
                id: idNum,
                icon: '/root/temp.jpg',
                first_name: tMetaFName,
                last_name: tMetaLName,
                location: '',
                biography: '',
                payment_methods: [],
                delivery_methods: [],
                is_verified: false,
                uuid: tID,
                handle: tMetaHandle,
                banner: '/root/banner.png',
                post_count: 0,
                bookmarks: [],
                cart: [],
              };

              try {
                const { data, error } = await supabase.from('profiles').insert([newProfile]);
              } catch (e) {
                console.error('Error during insertion:', e);
              }

              console.log(tokenData);
              console.log('New profile created');
            } else {
              console.log('Profile already exists');
            }
          }
        }
        router.push('/');
      }
    } catch (error) {
      if ((error as AuthError).message == 'Email not confirmed') {
        setErrorMessage('Confirm your email address to continue.');
      } else {
        console.log(error);
        setErrorMessage('Incorrect email/password. Please try again.'); // Set error message on login failure
      }
    } finally {
      setIsSubmitting(false); // Reset isSubmitting when the form submission process is complete
    }
  };

  const handleLogin = () => {
    const token = localStorage.getItem('sb-pmjwqjsoojzbascysdbk-auth-token');
    if (token) {
      router.push('/');
    }
  };

  useEffect(() => {
    handleLogin()
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      const userObject = JSON.parse(rememberedUser);
      setEmail(userObject.email);
      console.log(userObject.email);
      setPassword({ password: userObject.password });
      console.log(userObject.password);
      setRememberMe(true);
    }
  }, []);

  return (
    <main className="flex flex-col w-screen h-screen items-center justify-center bg-cover bg-[url('/images/bg-auth-2.jpg')]">
      <div className="fixed top-0 left-0 z-[-1] w-screen h-screen bg-gradient-to-b from-zinc-100 to-zinc-300"></div>

      <div className="rounded-lg p-0 flex flex-row h-[36rem] w-[55.5rem] gap-3 filter drop-shadow-2xl">
        <div className="flex flex-col bg-[url('/images/bg-auth-3.jpg')] bg-cover bg-center bg-no-repeat bg-[size:100%] rounded-lg h-full w-[17.5rem] p-12 justify-between">
          <img src="/root/influx.svg" alt="Logo" className="filter invert" width="35" height="35" />
          <div className="flex flex-col gap-4">
            <h6 className="text-white font-light text-lg leading-5">
              Find everything you need in one place.
            </h6>
            <h6 className="text-white font-extralight text-[0.7rem]">
              Discover bargains at an affordable price without breaking the bank.
            </h6>
          </div>
        </div>

        <div className="bg-white rounded-lg py-12 px-[7rem] flex flex-row h-full w-[38rem] filter drop-shadow-2xl">
          <div className="flex flex-col justify-between w-full">
            <Link href="/home" className="text-gray-800 flex flex-row gap-2 items-center cursor-pointer hover:underline">
              <ChevronLeft className="opacity-70" color="black" size={14} strokeWidth={3} />
              <h6 className="font-extralight text-[0.65rem] tracking-wide">
                Return to homepage
              </h6>
            </Link>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h6 className="text-gray-800 font-normal text-2xl pb-2"> 
                Log in to continue 
              </h6>
              
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="u_name" className="text-gray-800 font-light text-[0.7rem] tracking-wide">
                    Email address
                  </label>
                  <div className="flex flex-row bg-gray-100 border border-gray-300 rounded-sm h-8 w-full items-center">
                    <div className="h-full bg-gray-300 aspect-square rounded-sm flex items-center justify-center">
                      <AtSign className="opacity-50" color="black" strokeWidth={3} size={14} />
                    </div>
                    <input
                      name="email_address"
                      onChange={handleChangeForm}
                      id="email_address"
                      type="text"
                      placeholder="hq@influx.org"
                      className="w-full h-full font-light text-gray-500 text-[0.7rem] bg-gray-100 rounded-sm p-2"
                      value={email}
                      
                    />
                    <div className="h-full bg-gray-100 aspect-square rounded-sm flex items-center justify-center">
                      <Check className={`opacity-50 ${isValidEmail ? "visible" : "hidden"}`} color={"green"} strokeWidth={3} size={14} />
                    </div>
                  </div>
                  <label className="opacity-70 text-[#FF0000] font-light text-[0.65rem] pt-1 tracking-wide">{errorEmailMessage}</label>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="u_pass" className="text-gray-800 font-light text-[0.7rem] tracking-wide">
                    Password
                  </label>
                  <div className="flex flex-row bg-gray-100 border border-gray-300 rounded-sm h-8 w-full items-center">
                    <div className="h-full bg-gray-300 aspect-square rounded-sm flex items-center justify-center">
                      <KeySquare className="opacity-50" color="black" strokeWidth={3} size={14} />
                    </div>
                    <input
                      name="password"
                      onChange={handleChangePw}
                      id="password"
                      type="password"
                      placeholder="********"
                      className="w-full h-full font-light text-gray-500 text-[0.7rem] bg-gray-100 rounded-sm p-2"
                      value={password.password}
                      minLength={8}
                    />
                    <div className="h-full aspect-square rounded-sm flex items-center justify-center">
                      <Check className={`opacity-50 ${isValidPw ? "visible" : "hidden"}`} color={"green"} strokeWidth={3} size={14} />
                    </div>
                  </div>
                  <label className="opacity-70 text-[#FF0000] font-light text-[0.65rem] pt-1 tracking-wide">{errorPasswordMessage}</label>
                </div>
              </div>

              <div className="flex flex-row justify-between w-full items-center">
                <div className="flex flex-row gap-2 items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    name="remember"
                    className="cursor-pointer"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <h6 className="bg-white text-gray-800 font-light text-[0.65rem] tracking-wide">
                    Remember me
                  </h6>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <Link href="/auth/register" className="bg-white text-[#7F62D9] font-light text-[0.65rem] tracking-wide hover:underline cursor-pointer">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex flex-row bg-gradient-to-t from-[#626FE5] to-[#90A0F3] rounded-2xl items-center justify-center cursor-pointer gap-2"
              >
                <h6 className="text-white font-light text-xs h-full cursor-pointer py-2 tracking-wide">
                  {isSubmitting ? 'Logging in...' : 'Continue with an Influx Account'}
                </h6>
              </button>

              <label className="opacity-70 text-[#FF0000] font-light text-[0.65rem] h-1 tracking-wide pt-3">{errorMessage}</label>

            </form>
            
            <div className="text-gray-800 flex flex-row gap-2 items-center">
              <Sparkle className="opacity-70" color="black" size={14} strokeWidth={2} />
              <h6 className="font-extralight text-[0.65rem] tracking-wide">
                New to Influx? <Link href="/auth/register" className="hover:underline"> Sign up here. </Link>
              </h6>
            </div>
          </div>
        </div>


      </div>
    </main>
  );
};

export default Login;
