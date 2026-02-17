'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';


export default function NavLinks() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      
      <div className="hidden md:flex gap-6">
        <a href="#about-me" className="hover:text-amber-400 transition-colors">
          About Me
        </a>
        <a href="#my-work" className="hover:text-amber-400 transition-colors">
          My Work
        </a>
        <a href="#contacts" className="hover:text-amber-400 transition-colors">
          Contacts
        </a>
      </div>


      
        <button
            className="md:hidden text-black"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
        >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>


     
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-neutral-400 shadow-md flex flex-col items-center gap-4 py-4 md:hidden">
          <Link href="/about-me" onClick={() => setIsOpen(false)} className='text-lg font-semibold text-black'>About Me</Link>
          <Link href="/my-work" onClick={() => setIsOpen(false)}  className='text-lg font-semibold text-black'>My Work</Link>
          <Link href="/contacts" onClick={() => setIsOpen(false)} className='text-lg font-semibold text-black'>Contacts</Link>
        </div>
      )}
    </>
  );
}
