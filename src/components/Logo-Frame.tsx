import React from "react";
import Link from "next/link";

interface FrameProps {
  text: string;
  route: string;
}

export default function Frame({ text, route }: FrameProps) {
  return (
    <div className="ml-6 py-4 flex justify-between items-center">
      <div className="relative w-fit pl-6 pr-4 py-3 bg-cover bg-center font-bold text-lg tracking-widest">
        
        <div className="absolute top-2 left-2 w-2.5 h-2.5 bg-green-500 rounded-full" />

        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-black" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-black" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-black" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-black" />

        <h2 className="z-10 font-extrabold text-xl md:text-2xl lg:text-4xl">
          {text}
        </h2>
      </div>

      <Link
        href={route}
        className="mr-6 md:mr-10 text-md md:text-lg font-bold hover:text-blue-500 hover:underline transition-colors duration-300"
      >
        View All
      </Link>
    </div>
  );
}
