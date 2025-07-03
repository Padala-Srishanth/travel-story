import React from 'react'
import LOGO from '../../assets/images/main.jpg'
import Profileinfo from '../cards/Profileinfo'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ userinfo }) => {

  const isToken = localStorage.getItem("token");

  const navigate = useNavigate();


  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };


  return (

    <div className='bg-white shadow-md flex items-center justify-between px-6 py-2'>
        <img src={LOGO} alt='travel story' className='h-9' />


        {isToken && <Profileinfo userinfo={userinfo} onLogout={onLogout}/>}
    </div>


  );
}

export default Navbar