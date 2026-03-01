"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Logo from "./Logo";
import NavLinks from "./NavLinks";

export default function Header() {
  useEffect(() => {
    const header = document.querySelector("header");
    const img = document.querySelector(".scroll-translate-img");

    const handleScroll = () => {
      if (window.scrollY > 50) {
        header?.classList.add("scrolled");
        img?.classList.add("translate-active");
      } else {
        header?.classList.remove("scrolled");
        img?.classList.remove("translate-active");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="relative h-[50vh] md:h-screen bg-neutral-50 flex flex-col overflow-hidden">
      {/* Navbar */}
      <nav className="relative flex w-full justify-between p-4 items-center z-30">
        <Logo />
        <NavLinks />
      </nav>

      {/* Profile image */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <Image
          className="h-[80vh] md:h-[90vh] lg:h-[100dvh] w-auto mx-auto object-contain scroll-translate-img transition-transform duration-500 ease-out"
          src="/images/profile.png"
          alt="profile-foto"
          width={800}
          height={1200}
        />
      </div>

      {/* Hero text */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full text-center px-4 z-10">
        <h1 className="h1-slide-left text-4xl font-extrabold md:text-6xl lg:text-8xl pb-1 md:pb-3 text-neutral-500 tracking-wider transform scale-y-150">
          PHOTOGRAPHER &
        </h1>
        <h1 className="h1-slide-right text-4xl font-extrabold md:text-6xl lg:text-8xl pt-5 tracking-wider transform scale-y-150">
          VIDEOGRAPHER
        </h1>
      </div>

      {/* Divider image */}
      <Image
        className="absolute bottom-0 z-30 w-full object-cover scroll-translate-img transition-transform duration-500 ease-out"
        src="/images/torn-paper-divider-upper.png"
        alt="page divider"
        width={1200}
        height={80}
      />
    </header>
  );
}
