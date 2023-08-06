import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import useModal from "@/src/app/backend/hooks/useModal";
import AutosizeTextarea from '@/src/app/backend/components/utilities/AutosizeTextarea';
import { UserClass } from '@/libraries/structures';
import { ToTitleCase } from '@/src/app/backend/hooks/ToConvert'
import CheckboxesPopover from '@/src/app/backend/components/popovers/CheckboxesPopover';

import { ChevronDown, Globe, ImagePlus, RefreshCw, Sparkles, X } from 'lucide-react';
import { Banknote, CreditCard, Map, MoveUpRight, Package, Package2, Repeat2, Star } from 'lucide-react';
import supabase from '@/src/app/backend/model/supabase';
import useFetchUser from "@/src/app/backend/hooks/useFetchUser";
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '../../hooks/GlobalContext';
import OutsideClick from '@/src/app/backend/hooks/OutsideClick';
import SaveImages from '../../hooks/SaveImages';
import { v4 as uuidv4 } from "uuid";

interface Props {
  onClose: () => void;
}

const UpdateProfilePopup: React.FC<Props> = ({ onClose }) => {

  // Export user data from global context
  const { user, setUser } = useGlobalContext();

  // Allow outside click to exit
  const modalRef = useRef<HTMLDivElement | null>(null);
  OutsideClick(modalRef, onClose);

  // Load default values
  const defaults = require("@/json/defaults.json");

  // useStates for images
  const [iconImage, setIconImage] = useState<string>(user.icon);
  const [iconFile, setIconFile] = useState<File>();
  const [bannerImage, setBannerImage] = useState<string>(user.banner);
  const [bannerFile, setBannerFile] = useState<File>();

  // useState for form data
  const [formData, setFormData] = useState<UserClass>(new UserClass(user));

  // Listens to all input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {

    switch (event.target.name) {
      case "icon_image":
        const i_files = (event.target as HTMLInputElement).files;
        if (i_files) {
          const ii_files = Array.from(i_files);
        }

        console.log("i", i_files);
        setIconImage(URL.createObjectURL(i_files![0]));
        setFormData({ ...formData, icon: iconImage });

        break;
      case "banner_image":
        const b_files = (event.target as HTMLInputElement).files;
        setBannerFile(b_files[0]);

        console.log("b", b_files);
        setBannerImage(URL.createObjectURL(b_files![0]));
        setFormData({ ...formData, banner: bannerImage });

        break;
      default:
        setFormData({ ...formData, [event.target.name]: event.target.value });
        break;
    }

    switch (event.target.name) {
      case "biography":
        setBioValue(event.target.value);
        break;
    }

    console.log(iconImage, bannerImage);
    console.log(iconFile, bannerFile);
    console.log("formdata", formData);
  };

  const handlePMSubmit = (data: string[]) => {
    setFormData({ ...formData, payment_methods: data });
  };
  const handleDMSubmit = (data: string[]) => {
    setFormData({ ...formData, delivery_methods: data });
  };

  // SubmitListener
  const handleSubmit = async () => {

    // Upload images
    if (iconFile) {

      const filename = `${uuidv4()}-${iconFile.name.replace(/\s/g, '-')}`;
      console .log(filename);
      const { data, error } = await supabase
        .storage
        .from('profiles')
        .upload(filename, iconFile, { 
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;
      if (!data) return;

      setFormData({ ...formData, icon: "https://pmjwqjsoojzbascysdbk.supabase.co/storage/v1/object/public/images/" + filename });
      console.log(formData.icon);

    } 
    // else if (iconFile) {
    //   const icon = SaveImages([iconFile]);
    //   setFormData({ ...formData, icon: icon[0] });
    //   console.log(icon[0]);
    // } else if (bannerFile) {
    //   const icon = SaveImages([bannerFile]);
    //   console.log("o diba");
    //   setFormData({ ...formData, banner: "lakas ah" });
    //   console.log(icon[0]);
    // }

    console.log(JSON.stringify(formData));
    
    const partial = new UserClass(formData);
    setUser(partial);

    console.log("partial:", JSON.stringify(partial));

    const { email_address, phone_number, ...userData } = partial;
    const { data, error } = await supabase
      .from('profiles')
      .update({...userData})
      .match({ uuid: user.uuid });

    if (error) throw error;
    if (!data) return;

    onClose();
  };  
  
  const [isPMSelectExpanded, setIsPMSelectExpanded] = useState(false);
  const handleExpandPMSelect = () => {
    setIsPMSelectExpanded(!isPMSelectExpanded);
  };

  const [isDMSelectExpanded, setIsDMSelectExpanded] = useState(false);
  const handleExpandDMSelect = () => {
    setIsDMSelectExpanded(!isDMSelectExpanded);
  };

  // Autosizing
  const [bioValue, setBioValue] = useState("");
  const textBioAreaRef = useRef<HTMLTextAreaElement>(null);
  AutosizeTextarea(textBioAreaRef.current, bioValue);

  return (
    <main  
      className="text-gray-800 fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-[60]">

      <div className="bg-white rounded-sm w-[24rem] flex flex-col gap-[-12rem] z-[40] relative" ref={modalRef}>

        <input type="file" id="banner" onChange={handleInputChange} className="hidden w-12 h-12" accept="image/*" name="banner_image"/>
        <label htmlFor="banner" className="cursor-pointer flex items-center w-full h-44 z-[2]">
          <img className="w-full rounded-sm h-44 object-cover z-[-1]" src={bannerImage} alt="" width={1000} height={1000} />
          <span className="absolute text-[0.625rem] text-gray-200 font-light opacity-0 hover:opacity-100 transition-all duration-200 z-[1] w-full h-44 hover:bg-black hover:bg-opacity-50 flex items-center justify-center cursor-pointer ">Change banner</span>
        </label>

        <div className="absolute z-[2] bg-[url('/root/profile_dent.svg')] bg-contain w-full h-[6rem] rounded-sm top-[8rem] bg-no-repeat" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-[-2rem] flex flex-col gap-4 z-[3]">

          {/* Account */}
        <div className="z-[1] flex flex-col gap-2 pb-4 px-4">

          {/* Profile */}
          <div className="flex flex-row items-center gap-2 w-full px-5 pb-2">

            {/* Author Avatar */}
            <div>
              <input type="file" id="icon_files" onChange={handleInputChange} className="hidden w-12 h-12" accept="image/*" name="icon_image"/>
              <label htmlFor="icon_files" className="cursor-pointer flex items-center w-12 h-12">
                <img className="rounded-full w-12 h-12 object-cover" src={iconImage} alt="User Icon" width={48} height={48} />
                <span className="absolute text-[0.625rem] text-gray-200 font-light opacity-0 hover:opacity-100 transition-all duration-200 z-[1] w-12 h-12 rounded-full hover:bg-black hover:bg-opacity-50 flex items-center justify-center cursor-pointer ">New</span>
              </label>
            </div>

            <div className="flex flex-col justify-center w-full">

              <div className="flex flex-row gap-2 w-full">

              {/* Author Name */}
              <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} className="text-gray-800 font-normal text-lg leading-3 tracking-tight focus:border-b-[1px] cursor-pointer overflow-y-hidden w-full" placeholder="First Name"/>

              {/* Author Name */}
              <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} className="text-gray-800 font-normal text-lg leading-3 tracking-tight focus:border-b-[1px] cursor-pointer overflow-y-hidden w-full" placeholder="Last Name"/>

              </div>

              {/* Author Handle */}
              <h6 className="text-gray-500 font-light text-sm leading-4">{`@${formData.handle}`}</h6>

            </div>
          </div>

          {/* Biography */}
          <textarea name="biography" value={formData.biography} onChange={handleInputChange} ref={textBioAreaRef} className="text-gray-800 font-light text-xs leading-4 focus:border-b-[1px] focus:outline-none resize-none cursor-pointer overflow-y-hidden" placeholder="Biography" rows={1} maxLength={256}/>

          {/* Location */}
          <div className="flex flex-row items-center gap-1 w-full">
            <Map className="opacity-70" color="black" size={14} />
            <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="text-gray-800 font-light text-xs leading-3 focus:border-b-[1px] focus:outline-none w-full cursor-pointer" placeholder="Location" />
          </div>

          {/* Divider */}
          <div className="py-2">
            <hr/>
          </div>

          <div className="flex flex-wrap gap-4">

          {/* Payment Methods */}
          <div className="flex flex-row gap-2 w-full">
            
            <div className="flex justify-center relative w-full">
            <div className="flex flex-row w-full items-center bg-gray-100 rounded-sm px-2 hover:bg-gray-200 transition-colors duration-200 border border-gray-200 py-2 justify-between cursor-pointer" onClick={handleExpandPMSelect}>
              <div className="flex flex-row gap-2">
                <Star className="text-gray-800" size={12} strokeWidth={3} />
                <h6 className="text-gray-800 font-light text-xs leading-3">Payment Methods</h6>
              </div>
              <ChevronDown className="text-gray-800" size={12} strokeWidth={3} />
            </div>
            {isPMSelectExpanded && <CheckboxesPopover prevData={formData.payment_methods} onSubmit={handlePMSubmit} onClose={handleExpandPMSelect} data={defaults.payment_methods as string[]} />}
            </div>

            <div className="flex justify-center relative w-full">
            <div className="flex flex-row w-full items-center bg-gray-100 rounded-sm px-2 hover:bg-gray-200 transition-colors duration-200 border border-gray-200 py-2 justify-between cursor-pointer" onClick={handleExpandDMSelect}>
              <div className="flex flex-row gap-2">
                <Star className="text-gray-800" size={12} strokeWidth={3} />
                <h6 className="text-gray-800 font-light text-xs leading-3">Delivery Methods</h6>
              </div>
              <ChevronDown className="text-gray-800" size={12} strokeWidth={3} />
            </div>
            {isDMSelectExpanded && <CheckboxesPopover prevData={formData.delivery_methods} onSubmit={handleDMSubmit} onClose={handleExpandDMSelect} data={defaults.delivery_methods as string[]} />}
            </div>
          </div>
          
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4">
            <button type="button" className="text-xs font-light px-4 py-1.5 text-gray-500" onClick={onClose}>Cancel</button>
            <button type="submit" className="text-xs font-light px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-violet-300 rounded-full transition-colors duration-200">Save changes</button>
          </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default UpdateProfilePopup;