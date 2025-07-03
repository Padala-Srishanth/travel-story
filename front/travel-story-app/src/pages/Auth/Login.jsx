import React, { useState } from 'react';
import PasswordInput from '../../components/Input/PasswordInput';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosinstance from '../../utils/axiosInstance';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Please enter the password');
      return;
    }

    setError('');

    // Login API call
    try {
    // ✅ Making API request correctly
      const response = await axiosinstance.post('/login', {
        email: email,
        password: password,
      });

      // ✅ Handle successful login response
      if (response?.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        navigate('/dashboard'); // ✅ Navigates properly
      } else {
        setError('Invalid login response. Please try again.');
      }
    } catch (error) {
      // ✅ Handle login error
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className='h-screen bg-cyan-50 overflow-hidden relative'>
      <div className='login-ui-box right-10 -top-40' />
      <div className='login-ui-box bg-cyan-200 -bottom-40 right-1/2' />

      <div className='container h-screen flex items-center justify-center px-20 mx-auto'>
        <div className='w-2/4 h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-10 z-50'>
          <h4 className='text-5xl text-white font-semibold leading-[50px]'>
            Capture Your <br /> Journeys
          </h4>
          <p className='text-[15px] text-white leading-6 pr-7 mt-4'>
            Record your travel experiences and memories in your Personal travel journal
          </p>
        </div>

        <div className='w-2/4 h-[90vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20'>
          <form onSubmit={handleLogin}>
            <h4 className='text-2xl font-semibold mb-7'>Login</h4>

            <input
              type='text'
              placeholder='Email'
              className='input-box'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput 
            value={password} 
            onChange={({target}) => {
              setPassword(target.value);
            }} />

            {error && <p className='text-red-500 text-sm my-2'>{error}</p>}

            <button type='submit' className='btn-primary'>
              LOGIN
            </button>

            <p className='text-xs text-slate-500 text-center my-4'>(or)</p>

            <button type='button' className='btn-primary btn-light' onClick={() => navigate('/signup')}>
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
