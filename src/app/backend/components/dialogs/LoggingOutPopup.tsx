// 'use server'

import React from 'react';

const LoggingOutPopup: React.FC = () => {
  return (
    <main className=" fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-sm p-6 w-72 flex z-[50] items-center justify-center">
        <h6 className=" font-medium text-center text-md tracking-tight">Logging you out...</h6>
      </div>
    </main>
  );
};

export default LoggingOutPopup;
