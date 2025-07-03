import React, { useState } from 'react';
import PasswordInput from '../../components/Input/PasswordInput';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosinstance from '../../utils/axiosInstance';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!name) {
      setError('Please enter your name');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Please enter the password');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axiosinstance.post('/create-account', {
        fullname: name,
        email,
        password,
      });

      if (response?.data?.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        navigate('/login');
      } else {
        setError('Invalid signup response. Please try again.');
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setError('An account with this email already exists.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-screen bg-cyan-50 overflow-hidden relative'>
      {/* UI background elements */}
      <div className='login-ui-box right-10 -top-40' />
      <div className='login-ui-box bg-cyan-200 -bottom-40 right-1/2' />

      <div className='container h-screen flex items-center justify-center px-20 mx-auto'>
        {/* Left side visual */}
        <div className='w-2/4 h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-10 z-50'>
          <h4 className='text-5xl text-white font-semibold leading-[50px]'>
            Join the <br /> Adventure
          </h4>
        </div>

        {/* Right side form */}
        <div className='w-2/4 h-[90vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20'>
          <form onSubmit={handleSignUp}>
            <h4 className='text-2xl font-semibold mb-7'>Sign Up</h4>

            <input
              type='text'
              placeholder='Full Name'
              className='input-box'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type='text'
              placeholder='Email'
              className='input-box'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />

            {error && <p className='text-red-500 text-sm my-2'>{error}</p>}

            <button
              type='submit'
              className='btn-primary'
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className='text-xs text-slate-500 text-center my-4'>(or)</p>

            <button
              type='button'
              className='btn-primary btn-light'
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
