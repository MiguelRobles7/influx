'use client'; //* Uses interactable components

import supabase from '@/src/app/backend/model/supabase';
import Link from 'next/link';
import RegisterComplete from '@/src/app/backend/components/dialogs/RegisterCompletePopup';
import React, { useState, useEffect } from 'react';
import { UserInterface } from '@/src/libraries/structures';
import { AtSign, Check, ChevronLeft, ChevronRight, FormInput, Italic, KeySquare, Mail, Map, Package2, Phone, Pocket, Sparkle, SquareAsterisk, Users } from 'lucide-react';
import { OnboardingBanner1, OnboardingBanner2, OnboardingBanner3, Onboarding1, Onboarding2, Onboarding3 } from '@/src/app/backend/components/dialogs/OnboardingPopup';

export default function Register() {
  const defaults = require('@/src/json/defaults.json');

  const [errorFNameMessage, setErrorFNameMessage] = useState<string>(''); // Add error message state
  const [errorLNameMessage, setErrorLNameMessage] = useState<string>(''); // Add error message state
  const [errorHandleMessage, setErrorHandleMessage] = useState<string>(''); // Add error message state
  const [errorEmailMessage, setErrorEmailMessage] = useState<string>(''); // Add error message state
  const [errorPasswordMessage, setErrorPasswordMessage] = useState<string>(''); // Add error message state
  const [errorPhoneMessage, setErrorPhoneMessage] = useState<string>(''); 
  const [errorMessage, setErrorMessage] = useState<string>(''); // Add error message state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Add submission status state

  const [checkFName, setCheckFName] = useState<boolean>(false);
  const [checkLName, setCheckLName] = useState<boolean>(false);
  const [checkHandle, setCheckHandle] = useState<boolean>(false);
  const [checkEmail, setCheckEmail] = useState<boolean>(false);
  const [checkPassword, setCheckPassword] = useState<boolean>(false);
  const [checkPhone, setCheckPhone] = useState<boolean>(false);
  const [iconFile, setIconFile] = useState<File>();
  const [isIconChanged, setIsIconChanged] = useState(false);
  const [bannerFile, setBannerFile] = useState<File>();
  const [isBannerChanged, setIsBannerChanged] = useState(false);

  const [handles, setHandles] = useState<string[]>([]);
  const [emails, setEmails] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState<UserInterface>({
    id: 0,
    uuid: '',
    handle: '',
    email_address: '',
    icon: '',
    banner: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    location: '',
    biography: '',
    payment_methods: [],
    delivery_methods: [],
    is_verified: false,
  });
  const [password, setPassword] = useState({
    password: '',
  });

  const [step, setStep] = useState(1);

  // Event handler for next button
  const handleNext = () => {
    setStep(step + 1);
  };

  // Event handler for back button
  const handleBack = () => {
    setStep(step - 1);
  };

  const fetchHandles = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('handle');
      if (error) {
        throw error;
      }
      console.log(data);
      if (data && data.length > 0) {
        const usernames = data.map((user) => user.handle);
        return usernames;
      } else {
        console.log('No user found.');
        return [];
      }
    } catch (error) {
      console.log('Error fetching user:', error);
      return [];
    }
  };

  const fetchEmails = async () => {
    try {
      const { data, error } = await supabase.from('users').select('email');
      if (error) {
        throw error;
      }
      console.log(data);
      if (data && data.length > 0) {
        const emails = data.map((user) => user.email);
        return emails;
      } else {
        console.log('No user found.');
        return [];
      }
    } catch (error) {
      console.log('Error fetching user:', error);
      return [];
    }
  };

  const [isPMSelectExpanded, setIsPMSelectExpanded] = useState(false);
  const handleExpandPMSelect = () => {
    setIsPMSelectExpanded(!isPMSelectExpanded);
  };
  const handlePMSubmit = (data: string[]) => {
    setFormData({ ...formData, payment_methods: data });
  };

  // Handle DM Submit
  const [isDMSelectExpanded, setIsDMSelectExpanded] = useState(false);
  const handleExpandDMSelect = () => {
    setIsDMSelectExpanded(!isDMSelectExpanded);
  };
  const handleDMSubmit = (data: string[]) => {
    setFormData({ ...formData, delivery_methods: data });
  };

  useEffect(() => {
    async function fetchData() {
      const usernames = await fetchHandles();
      setHandles(usernames);
    }
    async function fetchData2() {
      const emails = await fetchEmails();
      setEmails(emails);
    }
    fetchData();
    fetchData2();
  }, []);

  const handleChangeForm = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    console.log(event.target.name, event.target.value);

    const getFile = (target: HTMLInputElement) => {
      const files = target.files;
      if (!files) return;

      const file = Array.from(files)[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('One or more images exceed the 5MB size limit.');
        return;
      } else {
        return file;
      }
    };

    switch (event.target.name) {
      case 'icon_image':
        const i_result = getFile(event.target as HTMLInputElement);
        if (!i_result) return;
        setIconFile(i_result);
        setFormData({ ...formData, icon: URL.createObjectURL(i_result) });
        setIsIconChanged(true);
        break;

      case 'banner_image':
        const b_result = getFile(event.target as HTMLInputElement);
        if (!b_result) return;
        setBannerFile(b_result);
        setFormData({ ...formData, banner: URL.createObjectURL(b_result) });
        setIsBannerChanged(true);
        break;

      default:
        setFormData({ ...formData, [event.target.name]: event.target.value });
        break;
    }

    if (event.target.name === 'handle') {
      const enteredHandle = event.target.value;
      if (enteredHandle.length > 0) {
        setErrorHandleMessage('');
        // Check if the entered handle already exists in the usernames array
        if (handles.includes(enteredHandle)) {
          setErrorHandleMessage('Username already exists');
          setCheckHandle(false);
        } else {
          setCheckHandle(true);
        }
      } else {
        setErrorHandleMessage('Required');
        setCheckHandle(false);
      }
    } else if (event.target.name === 'email_address') {
      const enteredEmail = event.target.value;
      if (enteredEmail.length > 0) {
        if (enteredEmail.includes('@')) {
          setErrorEmailMessage('');
          // Check if the entered email already exists in the emails array
          if (emails.includes(enteredEmail)) {
            setErrorEmailMessage('Email already exists');
            setCheckEmail(false);
          } else {
            setCheckEmail(true);
          }
        } else {
          setErrorEmailMessage('Invalid email address');
          setCheckEmail(false);
        }
      } else {
        setErrorEmailMessage('Required');
        setCheckEmail(false);
      }
    } else if (event.target.name === 'first_name') {
      if (event.target.value.length > 0) {
        setErrorFNameMessage('');
        setCheckFName(true);
      } else {
        setErrorFNameMessage('Required');
        setCheckFName(false);
      }
    } else if (event.target.name === 'last_name') {
      if (event.target.value.length > 0) {
        setErrorLNameMessage('');
        setCheckLName(true);
      } else {
        setErrorLNameMessage('Required');
        setCheckLName(false);
      }
    } else if (event.target.name === 'phone_number') {
      if (event.target.value.length > 0) {
        setErrorPhoneMessage('');
        setCheckPhone(true);
      } else {
        setErrorPhoneMessage('Required');
        setCheckPhone(false);
      }
    }

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleChangePw = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    console.log(event.target.name, event.target.value);
    if (event.target.value.length >= 8) {
      setErrorPasswordMessage('');
      setCheckPassword(true);
    } else if (event.target.value.length == 0) {
      setErrorPasswordMessage('Required');
      setCheckPassword(false);
    } else {
      setErrorPasswordMessage('The password must be 8 characters long, containing only periods, underscores, letters and numbers.');
      setCheckPassword(false);
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
    setIsSubmitting(true);

    try {
      if (step === 1) {
        if (!checkHandle || !checkEmail || !checkPassword) {
          setErrorMessage('Fill out the correct fields.');
        } else {
          setErrorMessage(''); setErrorMessage
          handleNext();
        }
      } else if (step === 2) {
        if (!checkFName || !checkLName) {
          setErrorMessage('Fill out the correct fields.');
        } else {
          setErrorMessage('');
          handleNext();
        }
      } else if (step === 3) {
        if (!checkPhone) {
          setErrorMessage('Fill out the correct fields.');
        } else {
          setErrorMessage('');
          const { data, error } = await supabase.auth.signUp({
            email: formData.email_address,
            password: password.password,
            options: {
              data: {
                handle: formData.handle,
                first_name: formData.first_name,
                last_name: formData.last_name,
                icon: formData.icon,
                banner: formData.banner,
                phone_number: formData.phone_number,
                location: formData.location,
                biography: formData.biography,
                payment_methods: formData.payment_methods,
                delivery_methods: formData.delivery_methods,
              },
            },
          });
          if (error) throw error;
          setShowPopup(true);
        }
      }
    } catch (error) {
      setErrorMessage('Error.');
    } finally {
      setIsSubmitting(false); // Reset isSubmitting when the form submission process is complete
    }
  };

  // const handleGoBack = () => {
  //   // Get handle, email_address, and password from form data
  //   const { handle, email_address, password } = formDataInitial;
  
  //   // Call handleBack function and pass the collected data
  //   handleBack(handle, email_address, password);
  // };

  return (
    <main className="flex flex-col w-screen h-screen items-center justify-center bg-cover bg-[url('/images/bg-auth-2.jpg')]">
      <div className="fixed top-0 left-0 z-[-1] w-screen h-screen bg-gradient-to-b from-zinc-100 to-zinc-300"></div>

      <div className="rounded-lg p-0 flex flex-row h-[36rem] w-[55.5rem] gap-3 filter drop-shadow-2xl">
        {/* Banner */}
        <div className="flex flex-col bg-[url('/images/bg-auth-3.jpg')] bg-cover bg-center bg-no-repeat bg-[size:100%] rounded-lg h-full w-[17.5rem] p-12 justify-between">
          <img src="/root/influx.svg" alt="Logo" className="filter invert" width="35" height="35" />
          {step === 1 && (<OnboardingBanner1 /> )}
          {step === 2 && (<OnboardingBanner2 /> )}
          {step === 3 && (<OnboardingBanner3 /> )}
        </div>

        {/* Inputter */}
        <div className="bg-white rounded-lg py-12 px-[7rem] flex flex-row h-full w-[38rem] filter drop-shadow-2xl">
          <div className="flex flex-col justify-between w-full">
            {/* Return to home */}
            <Link href="/home" className="text-gray-800 flex flex-row gap-2 items-center cursor-pointer hover:underline">
              <ChevronLeft className="opacity-70" color="black" size={14} strokeWidth={3} />
              <h6 className="font-extralight text-[0.65rem] tracking-wide">
                Return to homepage
              </h6>
            </Link>

            {/* Pass handleSubmit to Part1 */}
            {step === 1 && (
              <Onboarding1
                formData={formData}
                isSubmitting={isSubmitting}
                errorHandleMessage={errorHandleMessage}
                errorEmailMessage={errorEmailMessage}
                errorPasswordMessage={errorPasswordMessage}
                errorMessage={errorMessage}
                handleChangeForm={handleChangeForm}
                handleChangePw={handleChangePw}
                handleSubmit={handleSubmit} // Pass handleSubmit to Part1
                password={password}
              />
            )}

            {step === 2 && (
              <Onboarding2
                formData={formData}
                handleBack={handleBack}
                handleChangeForm={handleChangeForm}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                checkFName={checkFName}
                checkLName={checkLName}
                errorFNameMessage={errorFNameMessage}
                errorLNameMessage={errorLNameMessage}
                errorMessage={errorMessage}
              />
            )}

            {step === 3 && (
              <Onboarding3
                formData={formData}
                handleBack={handleBack}
                handleChangeForm={handleChangeForm}
                handleSubmit={handleSubmit}
                handlePMSubmit={handlePMSubmit}
                handleDMSubmit={handleDMSubmit}
                handleExpandPMSelect={handleExpandPMSelect}
                handleExpandDMSelect={handleExpandDMSelect}
                isPMSelectExpanded={isPMSelectExpanded}
                isDMSelectExpanded={isDMSelectExpanded}
                isSubmitting={isSubmitting}
                checkPhone={checkPhone}
                errorPhoneMessage={errorPhoneMessage}
                errorMessage={errorMessage}
                defaults={defaults}
              />
            )}
            
            {/* Already have an account */}
            <div className="text-gray-800 flex flex-row gap-2 items-center">
              <Sparkle className="opacity-70" color="black" size={14} strokeWidth={2} />
              <h6 className="font-extralight text-[0.65rem] tracking-wide">
                Already have an account? <Link href="/auth/login" className="hover:underline"> Log in here. </Link>
              </h6>
            </div>
          </div>
        </div>
      </div>
      {showPopup && <RegisterComplete />}
    </main>
  );
}
