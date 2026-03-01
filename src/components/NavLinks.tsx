"use client";

import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const NAV_ITEMS = [
  { name: 'About Me', href: '#about-me' },
  { name: 'My Work', href: '#my-work' },
  { name: 'Contacts', href: '#contacts' },
];

export default function NavLinks() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-8">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-sm uppercase tracking-widest font-medium hover:text-amber-500 transition-colors duration-300"
          >
            {item.name}
          </a>
        ))}
      </div>

      {/* Mobile Toggle */}
      <button
        className="md:hidden text-black z-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-0 left-0 w-full h-screen bg-white backdrop-blur-md z-40 flex flex-col items-center justify-center gap-8 md:hidden">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={handleLinkClick}
              className="text-3xl font-bold tracking-tighter text-black hover:text-amber-500 transition-all"
            >
              {item.name}
            </a>
          ))}
        </div>
      )}
    </>
  );
}