'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getUserData } from '@/Services/Signin.service'; 

const UserDatabase = () => {
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getUserData().then(({ data }) => {
      setUsers(data.data);
    });
  }, []);

  const handleSignInAgain = () => {
    router.push('/'); 
  };

  return (
    <div className="container mx-auto my-12">
      <h1 className="text-3xl font-semibold text-center">User Database</h1>
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full border border-gray-300 text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-3">Name</th>
              <th className="border p-3">Timestamp</th>
              <th className="border p-3 text-center">Document/Photo</th>
            </tr>
          </thead>
          <tbody>   
            {users.map((user, index) => (
              <tr key={index} className="even:bg-gray-50">
                <td className="border p-3">{user.full_name}</td>
                <td className="border p-3">{new Date(user.timestamp).toLocaleString()}</td>
                <td className="border p-3">
                  {user.photo_url ? (
                    <a href={user.photo_url} target="_blank" rel="noopener noreferrer">
                      <img
                        src={user.photo_url}
                        alt="User Photo"
                        className="w-16 h-16 object-cover rounded-full mx-auto"
                      />
                    </a>
                  ) : (
                    <span>No Photo</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleSignInAgain}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Sign In Again
        </button>
      </div>
    </div>
  );
};

export default UserDatabase;
