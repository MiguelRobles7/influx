import React, { useState, useEffect } from 'react';
import Checkboxes from '@/src/app/backend/components/layouts/CheckboxesLayout';
import { Album, AtSign, Check, ChevronDown, KeySquare, Mail, Map, Package2, Phone, Pocket, Users } from 'lucide-react';

const OnboardingBanner1 = ({ }) => {
  return (
    <div className="flex flex-col gap-3">
      <h6 className="text-white font-normal text-[0.55rem]">
        Step 01
      </h6>
      <h6 className="text-white font-light text-lg leading-5">
        Enter your details
      </h6>
      <h6 className="text-white font-extralight text-[0.7rem] pb-1">
        Provide your basic information. You may update this later.
      </h6>
      <div className="flex flex-row items-center gap-2">
        <div className="bg-white rounded-full h-1 w-full"></div>
        <div className="opacity-50 bg-white rounded-full h-1 w-full"></div>
        <div className="opacity-50 bg-white rounded-full h-1 w-full"></div>
      </div>
    </div>
  );
};

const OnboardingBanner2 = ({ }) => {
  return (
    <div className="flex flex-col gap-3">
      <h6 className="text-white font-normal text-[0.55rem]">
        Step 02
      </h6>
      <h6 className="text-white font-light text-lg leading-5">
        Customize your profile
      </h6>
      <h6 className="text-white font-extralight text-[0.7rem] pb-1">
        Make yourself unique by choosing your own avatar and banner.
      </h6>
      <div className="flex flex-row items-center gap-2">
        <div className="opacity-50 bg-white rounded-full h-1 w-full"></div>
        <div className="bg-white rounded-full h-1 w-full"></div>
        <div className="opacity-50 bg-white rounded-full h-1 w-full"></div>
      </div>
    </div>
  );
};

const OnboardingBanner3 = ({ }) => {
  return (
    <div className="flex flex-col gap-3">
      <h6 className="text-white font-normal text-[0.55rem]">
        Step 03
      </h6>
      <h6 className="text-white font-light text-lg leading-5">
        Fill customers in
      </h6>
      <h6 className="text-white font-extralight text-[0.7rem] pb-1">
        Finish your profile by providing basic contact and shipping details.
      </h6>
      <div className="flex flex-row items-center gap-2">
        <div className="opacity-50 bg-white rounded-full h-1 w-full"></div>
        <div className="opacity-50 bg-white rounded-full h-1 w-full"></div>
        <div className="bg-white rounded-full h-1 w-full"></div>
      </div>
    </div>
  );
};

const Onboarding1 = ({ formData, isSubmitting, handleChangeForm, errorHandleMessage, errorEmailMessage, errorPasswordMessage, errorMessage, handleChangePw, handleSubmit, password }) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Part 1 */}
      <h6 className="text-gray-800 font-normal text-2xl pb-2"> 
        Enter your details
      </h6>

      <div className="flex flex-col gap-3">
        {/* USERNAME */}
        <div className="flex flex-col gap-1">
          <label htmlFor="handle" className="text-gray-800 font-light text-[0.7rem] tracking-wide">
            Username
          </label>
          <div className="flex flex-row bg-gray-100 border border-gray-300 rounded-sm h-8 w-full items-center">
            <div className="h-full bg-gray-300 aspect-square rounded-sm flex items-center justify-center">
              <AtSign className="opacity-50" color="black" strokeWidth={3} size={14} />
            </div>
            <input
              name="handle"
              onChange={handleChangeForm}
              id="handle"
              type="text"
              placeholder="Enter your username"
              value={formData.handle}
              className="w-full h-full font-light text-gray-500 text-[0.7rem] bg-gray-100 rounded-sm p-2"
              
            />
            <div className="h-full bg-gray-100 aspect-square rounded-sm flex items-center justify-center">
              <Check className="opacity-50" color="black" strokeWidth={3} size={14} />
            </div>
          </div>
          <label className="opacity-70 text-[#FF0000] font-light text-[0.65rem] pt-1 tracking-wide">{errorHandleMessage}</label>
        </div>

        {/* EMAIL */}
        <div className="flex flex-col gap-1">
          <label htmlFor="handle" className="text-gray-800 font-light text-[0.7rem] tracking-wide">
            Email address
          </label>
          <div className="flex flex-row bg-gray-100 border border-gray-300 rounded-sm h-8 w-full items-center">
            <div className="h-full bg-gray-300 aspect-square rounded-sm flex items-center justify-center">
              <Mail className="opacity-50" color="black" strokeWidth={3} size={14} />
            </div>
            <input
              name="email_address"
              onChange={handleChangeForm}
              id="email_address"
              type="email"
              value={formData.email_address}
              placeholder="Enter your email address"
              className="w-full h-full font-light text-gray-500 text-[0.7rem] bg-gray-100 rounded-sm p-2"
              
            />
            <div className="h-full bg-gray-100 aspect-square rounded-sm flex items-center justify-center">
              <Check className="opacity-50" color="black" strokeWidth={3} size={14} />
            </div>
          </div>
          <label className="opacity-70 text-[#FF0000] font-light text-[0.65rem] pt-1 tracking-wide">{errorEmailMessage}</label>
        </div>
        
        {/* PASSWORD */}
        <div className="flex flex-col gap-1">
          <label htmlFor="handle" className="text-gray-800 font-light text-[0.7rem] tracking-wide">
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
              value={password.password}
              placeholder="Enter your password"
              className="w-full h-full font-light text-gray-500 text-[0.7rem] bg-gray-100 rounded-sm p-2"
              
              minLength={8}
            />
            <div className="h-full bg-gray-100 aspect-square rounded-sm flex items-center justify-center">
              <Check className="opacity-50" color="black" strokeWidth={3} size={14} />
            </div>
          </div>
          <label className="opacity-70 text-[#FF0000] font-light text-[0.65rem] pt-1 tracking-wide">{errorPasswordMessage}</label>
        </div>
        
        {/* PROCEED */}
        <div className="flex flex-row gap-1 justify-center items-center">
          <label className="opacity-70 text-[#FF0000] h-full w-full font-light text-[0.65rem] tracking-wide pt-2">{errorMessage}</label>
          <div className='flex flex-row gap-2'>
            <button
              disabled={isSubmitting}
              onSubmit={handleSubmit}
              className="flex flex-row bg-gradient-to-t from-[#626FE5] to-[#90A0F3] rounded-2xl justify-end cursor-pointer gap-2"
            >
              <h6 className="text-white font-light text-xs h-full cursor-pointer py-2 px-6 tracking-wide">
                Proceed
              </h6>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

const Onboarding2 = ({ formData, handleBack, handleChangeForm,  handleSubmit, isSubmitting, checkFName, checkLName, errorFNameMessage, errorLNameMessage, errorMessage }) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Part 1 */}
      <h6 className="text-gray-800 font-normal text-2xl pb-2"> 
        Customize your profile
      </h6>

      <div className="flex flex-col gap-3">
        {/* APPEARANCE */}
        <div className="flex flex-col gap-1">
          <label htmlFor="handle" className="text-gray-800 font-light text-[0.7rem] tracking-wide">
            Appearance
          </label>
          {/* <div className="flex flex-row bg-gray-100 rounded-sm h-8 w-full items-center">
          </div> */}
          <div className="flex flex-col gap-1">
            <div className="relative">
              <input
                type="file"
                id="banner"
                onChange={handleChangeForm}
                className="hidden w-full h-full"
                accept="image/*"
                name="banner_image"
              />
              <label htmlFor="banner" className="cursor-pointer flex items-center w-23 z-[2]">
                <img
                  className="w-full rounded-sm h-20 object-cover z-[-1]"
                  src={formData.banner}
                  alt=""
                  width={300}
                  height={300}
                />
                {/* <span className="absolute text-[0.625rem] text-gray-200 font-light opacity-0 hover:opacity-100 transition-all duration-200 z-[1] w-68 h-20 hover:bg-black hover:bg-opacity-50 flex items-center justify-center cursor-pointer ">
                  Change banner
                </span> */}
              </label>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <input
                type="file"
                id="icon_files"
                onChange={handleChangeForm}
                className="hidden w-20 h-20"
                accept="image/*"
                name="icon_image"
              />
              <label htmlFor="icon_files" className="cursor-pointer flex items-center pt-12 w-20 h-20">
                <img
                  className="rounded-full w-20 h-20 object-cover"
                  src={formData.icon}
                  alt=""
                  width={48}
                  height={48}
                />
                {/* <span className="absolute text-[0.625rem] text-gray-200 font-light opacity-0 hover:opacity-100 transition-all duration-200 z-[1] w-12 h-12 rounded-full hover:bg-black hover:bg-opacity-50 flex items-center justify-center cursor-pointer ">
                  New
                </span> */}
              </label>
            </div>
          </div>
          <label className="opacity-70 text-[#FF0000] font-light text-[0.65rem] pt-1 tracking-wide" />
        </div>

        {/* DISPLAY NAME */}
        <div className="flex flex-row gap-2 w-full justify-center">
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="handle" className="text-gray-800 font-light text-[0.7rem] tracking-wide">
              Display Name
            </label>
            <div className="flex flex-row bg-gray-100 border border-gray-300 rounded-sm h-8 w-full items-center">
              <div className="h-full bg-gray-300 aspect-square rounded-sm flex items-center justify-center">
                <Users className="opacity-50" color="black" strokeWidth={3} size={14} />
              </div>
              <input
                name="first_name"
                onChange={handleChangeForm}
                id="first_name"
                type="text"
                value={formData.first_name}
                placeholder="First Name"
                className="w-full h-full font-light text-gray-500 text-[0.7rem] bg-gray-100 rounded-sm p-2"
              />
              <div className="h-full bg-gray-100 aspect-square rounded-sm flex items-center justify-center">
                <Check className={`opacity-50 ${ checkFName ? "visible" : "hidden"}`} color="green" strokeWidth={3} size={14} />
              </div>
            </div>
            <label className="opacity-70 text-[#FF0000] font-light text-[0.65rem] pt-1 tracking-wide">{errorFNameMessage}</label>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="handle" className="text-gray-800 font-light text-[0.7rem] tracking-wide">
              &nbsp;
            </label>
            <div className="flex flex-row bg-gray-100 border border-gray-300 rounded-sm h-8 w-full items-center">
              <div className="h-full bg-gray-300 aspect-square rounded-sm flex items-center justify-center">
                <Users className="opacity-50" color="black" strokeWidth={3} size={14} />
              </div>
              <input
                name="last_name"
                onChange={handleChangeForm}
                id="last_name"
                type="text"
                value={formData.last_name}
                placeholder="Last Name"
                className="w-full h-full font-light text-gray-500 text-[0.7rem] bg-gray-100 rounded-sm p-2"
              />
              <div className="h-full bg-gray-100 aspect-square rounded-sm flex items-center justify-center">
                <Check className={`opacity-50 ${ checkLName ? "visible" : "hidden"}`} color="green" strokeWidth={3} size={14} />
              </div>
            </div>
            <label className="opacity-70 text-[#FF0000] font-light text-[0.65rem] pt-1 tracking-wide">{errorLNameMessage}</label>
          </div>
        </div>
        
        {/* BIOGRAPHY */}
        <div className="flex flex-col gap-1">
          <label htmlFor="handle" className="text-gray-800 font-light text-[0.7rem] tracking-wide">
            Biography
          </label>
          <div className="flex flex-row bg-gray-100 border border-gray-300 rounded-sm h-8 w-full items-center">
            <div className="h-full bg-gray-300 aspect-square rounded-sm flex items-center justify-center">
              <Album className="opacity-50" color="black" strokeWidth={2} size={14} />
            </div>
            <input
              name="biography"
              onChange={handleChangeForm}
              id="biography"
              type="textarea"
              value={formData.biography}
              placeholder="Tell more about yourself"
              className="w-full h-full font-light text-gray-500 text-[0.7rem] bg-gray-100 rounded-sm p-2 word-wrap"
            />
          </div>
          <label className="opacity-70 text-[#FF0000] font-light text-[0.65rem] pt-1 tracking-wide" />
        </div>
        
        {/* PROCEED */}
        <div className="flex flex-row gap-1 justify-center items-center">
          <label className="opacity-70 text-[#FF0000] h-full w-full font-light text-[0.65rem] tracking-wide pt-2">{errorMessage}</label>
          <div className='flex flex-row gap-2'>
            <button
              onClick={handleBack}  
              className="flex flex-row bg-gray-300 rounded-2xl justify-end cursor-pointer gap-2"
            >
              <h6 className="text-black font-light text-xs h-full cursor-pointer py-2 px-6 tracking-wide">
                Go&nbsp;Back
              </h6>
            </button>
            <button
              disabled={isSubmitting}
              onSubmit={handleSubmit}
              className="flex flex-row bg-gradient-to-t from-[#626FE5] to-[#90A0F3] rounded-2xl justify-end cursor-pointer gap-2"
            >
              <h6 className="text-white font-light text-xs h-full cursor-pointer py-2 px-6 tracking-wide">
                Proceed
              </h6>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

const Onboarding3 = ({ formData, handleBack, handleChangeForm, handleSubmit, handlePMSubmit, handleDMSubmit, handleExpandPMSelect, handleExpandDMSelect, isPMSelectExpanded, isDMSelectExpanded, isSubmitting, checkPhone, errorPhoneMessage, errorMessage, defaults }) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Part 1 */}
      <h6 className="text-gray-800 font-normal text-2xl pb-2"> 
        Fill customers in
      </h6>

      <div className="flex flex-col gap-3">
        {/* CONTACT */}
        <div className="flex flex-col gap-1">
          <label htmlFor="handle" className="text-gray-800 font-light text-[0.7rem] tracking-wide">
            Contact Number
          </label>
          <div className="flex flex-row bg-gray-100 border border-gray-300 rounded-sm h-8 w-full items-center">
            <div className="h-full bg-gray-300 aspect-square rounded-sm flex items-center justify-center">
              <Phone className="opacity-50" color="black" strokeWidth={3} size={14} />
            </div>
            <input
              name="phone_number"
              onChange={handleChangeForm}
              id="phone_number"
              type="number"
              value={formData.phone_number}
              placeholder="+63 000 000 0000"
              className="w-full h-full font-light text-gray-500 text-[0.7rem] bg-gray-100 rounded-sm p-2"
            />
            <div className="h-full bg-gray-100 aspect-square rounded-sm flex items-center justify-center">
              <Check className={`opacity-50 ${ checkPhone ? "visible" : "hidden"}`} color="green" strokeWidth={3} size={14} />
            </div>
          </div>
          <label className="opacity-70 text-[#FF0000] font-light text-[0.65rem] pt-1 tracking-wide">{errorPhoneMessage}</label>
        </div>

        {/* LOCATION */}
        <div className="flex flex-col gap-1">
          <label htmlFor="handle" className="text-gray-800 font-light text-[0.7rem] tracking-wide">
            Location
          </label>
          <div className="flex flex-row bg-gray-100 border border-gray-300 rounded-sm h-8 w-full items-center">
            <div className="h-full bg-gray-300 aspect-square rounded-sm flex items-center justify-center">
              <Map className="opacity-50" color="black" strokeWidth={3} size={14} />
            </div>
            <input
              name="location"
              onChange={handleChangeForm}
              id="location"
              type="text"
              value={formData.location}
              placeholder="Intramuros, MN"
              className="w-full h-full font-light text-gray-500 text-[0.7rem] bg-gray-100 rounded-sm p-2"
            />
            {/* <div className="h-full bg-gray-100 aspect-square rounded-sm flex items-center justify-center">
              <Check className="opacity-50" color="black" strokeWidth={3} size={14} />
            </div> */}
          </div>
          <label className="opacity-70 text-[#FF0000] font-light text-[0.65rem] pt-1 tracking-wide" />
        </div>
        
        {/* PAYMENT AND DELIVERY METHODS */}
        <div className="flex flex-row gap-2 w-full justify-center">
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="Payment method" className="text-gray-800 font-light text-[0.7rem] tracking-wide w-full h-full">
              Payment methods
            </label>
            <div className="flex justify-center relative w-full">
              <div
                className="flex flex-row w-full items-center bg-gray-100 rounded-sm px-2 hover:bg-gray-200 transition-colors duration-200 border border-gray-300 h-8 py-2 justify-between cursor-pointer"
                onClick={handleExpandPMSelect}
              >
                <div className="flex flex-row gap-2">
                  <div className="h-full aspect-square rounded-sm flex items-center justify-center">
                    <Pocket className="opacity-50" color="black" strokeWidth={3} size={14} />
                  </div>
                  <h6 className="opacity-50 text-gray-800 font-light text-xs">Select Methods</h6>
                </div>
                <ChevronDown className="text-gray-800" size={12} strokeWidth={3} />
              </div>
              {isPMSelectExpanded && (
                <Checkboxes
                  prevData={formData.payment_methods}
                  onSubmit={handlePMSubmit}
                  onClose={handleExpandPMSelect}
                  data={defaults.payment_methods as string[]}
                />
              )}
            </div>
            <label className="opacity-70 text-[#FF0000] font-light text-[0.65rem] pt-1 tracking-wide" />
          </div>

          <div className="flex flex-col gap-1 w-full">
          <label htmlFor="Delivery method" className="text-gray-800 font-light text-[0.7rem] tracking-wide w-full h-full">
              Delivery methods
            </label>
            <div className="flex justify-center relative w-full">
              <div
                className="flex flex-row w-full items-center bg-gray-100 rounded-sm px-2 hover:bg-gray-200 transition-colors duration-200 border border-gray-300 h-8 py-2 justify-between cursor-pointer"
                onClick={handleExpandDMSelect}
              >
                <div className="flex flex-row gap-2">
                  <div className="h-full aspect-square rounded-sm flex items-center justify-center">
                    <Package2 className="opacity-50" color="black" strokeWidth={3} size={14} />
                  </div>
                  <h6 className="opacity-50 text-gray-800 font-light text-xs">Select Methods</h6>
                </div>
                <ChevronDown className="text-gray-800" size={12} strokeWidth={3} />
              </div>
              {isDMSelectExpanded && (
                <Checkboxes
                  prevData={formData.delivery_methods}
                  onSubmit={handleDMSubmit}
                  onClose={handleExpandDMSelect}
                  data={defaults.delivery_methods as string[]}
                />
              )}
            </div>
            <label className="opacity-70 text-[#FF0000] font-light text-[0.65rem] pt-1 tracking-wide" />
          </div>
        </div>
        
        
        {/* FINISH SETUP */}
        <div className="flex flex-row gap-1 justify-center items-center">
          <label className="opacity-70 text-[#FF0000] h-full w-full font-light text-[0.65rem] tracking-wide pt-2">{errorMessage}</label>
          <div className='flex flex-row gap-2'>
            <button
              onClick={handleBack}  
              className="flex flex-row bg-gray-300 rounded-2xl justify-end cursor-pointer gap-2"
            >
              <h6 className="text-black font-light text-xs h-full cursor-pointer py-2 px-6 tracking-wide">
                Go&nbsp;Back
              </h6>
            </button>
            <button
              disabled={isSubmitting}
              onSubmit={handleSubmit} 
              className="flex flex-row bg-gradient-to-t from-[#626FE5] to-[#90A0F3] rounded-2xl justify-end cursor-pointer gap-2"
            >
              <h6 className="text-white font-light text-xs h-full cursor-pointer py-2 px-6 tracking-wide">
                Finish&nbsp;Setup
              </h6>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export { OnboardingBanner1, OnboardingBanner2, OnboardingBanner3, Onboarding1, Onboarding2, Onboarding3 };