import React from 'react';
import { getInitials } from '../../utils/helper.js';

const Profileinfo = ({ userinfo, onLogout }) => {
  if (!userinfo) return null;

  // 🛠️ Construct display name from available fields
  const displayName =
    userinfo.fullName ||
    userinfo.name ||
    `${userinfo.firstName || ''} ${userinfo.lastName || ''}`.trim() ||
    userinfo.email ||
    'User';

  const initials = getInitials(displayName);

  return (
    <div className='flex items-center gap-3'>
      <div className='w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100'>
        {initials}
      </div>

      <div>
        <p className='text-sm font-medium'>{displayName}</p>
        <button className='text-sm text-slate-700 underline' onClick={onLogout}>
          LogOut
        </button>
      </div>
    </div>
  );
};

export default Profileinfo;
