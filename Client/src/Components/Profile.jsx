// ProfileCard.jsx
import React from 'react';

function ProfileCard({ email }) {
  return (
    <div className="flex flex-col items-center p-4 shadow-md w-48 rounded-lg bg-white">
      <img
        src="https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
        alt="Profile"
        className="w-16 h-16 rounded-full"
      />
      <p className="mt-2 text-sm text-gray-700">{email}</p>
    </div>
  );
}

export default ProfileCard;
