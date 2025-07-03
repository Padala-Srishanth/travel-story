import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"

const PasswordInput = ({ value, onChange, placeholder }) => {

    const [isshowpassword, setisshoepassword] = useState(false);
    
    const toggleshowpassword = () => {
        setisshoepassword(!isshowpassword)
    }



  return (
    <div className='flex items-center bg-cyan-500/5 px-5 rounded mb-3'>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Password"}
        type={isshowpassword ? "text" : "password"}
        className='w-full text-sm bg-transparent py-3 mr-3 rounded outline-none'
      />

      {isshowpassword ? (
        <FaRegEye size={22} className='text-primary cursor-pointer'
      onClick={() => toggleshowpassword()} />
    )
        : (
            <FaRegEyeSlash size={22} className='text-slate-400 cursor-pointer'
      onClick={() => toggleshowpassword()} />
        )
    }
    </div>
  );
};

export default PasswordInput;
