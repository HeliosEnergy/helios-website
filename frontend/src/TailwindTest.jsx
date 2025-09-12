import React from 'react';

const TailwindTest = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-200 p-10">
      <div className="w-1/2 rounded-lg bg-white p-8 shadow-2xl">
        <h1 className="text-5xl font-bold text-red-500">
          Tailwind Test Successful
        </h1>
        <p className="mt-4 border-t-4 border-double border-blue-500 pt-4 text-lg text-gray-700">
          If this text is large, bold, and red, and the line above is blue and double-bordered,
          then your Tailwind CSS build process is working correctly.
        </p>
      </div>
    </div>
  );
};

export default TailwindTest;