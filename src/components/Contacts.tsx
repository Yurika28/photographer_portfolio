import { FaCaretDown } from 'react-icons/fa';
import { contactLinks } from '@/config/contact';
import Image from 'next/image';

export default function Contacts() {
    return (
      <section className="relative w-full min-h-1/2 bg-neutral-200 font-sans text-black mt-2 p-2 md:p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center p-2 md:p-4">
            <h2 className="text-lg md:text-2xl font-bold">CONTACT ME</h2>
            <p className=" text-xs md:text-sm italic">SHALL WE CAPTURE<br />YOUR LIFE TOGETHER?</p>
        </div>

        <div className="flex justify-between items-center px-2 md:px-4 py-4">
         
          <ul className="space-y-2 text-left">
            {contactLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className=" text-sm  md:text-lg font-semibold hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="shrink-0 justify-center items-center">
            <Image
              src="/images/profile-2.jpeg"
              alt="profile"
              width={128}
              height={128}
              className="h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20 md:h-27 md:w-27"
            />
          </div>

          <div className="relative w-fit  p-2 md:p-4 bg-cover bg-center font-bold text-lg tracking-widest">
                        
                <div className="absolute top-0 left-0 w-3 h-3 md:w-4 md:h-4 border-t-2 border-l-2 border-neutral-500" />
                <div className="absolute bottom-0 left-0 w-3 h-3 md:w-4 md:h-4 border-b-2 border-l-2 border-neutral-500" />
            
                <div className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 border-t-2 border-r-2 border-neutral-500" />
                <div className="absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 border-b-2 border-r-2 border-neutral-500" />

                <a
                  href="https://wa.me/6285778051419?text=Hi%20I%20would%20like%20to%20book%20a%20date"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="z-10 cursor-pointer hover:underline">
                    BOOK A DATE
                  </span>
                </a>
          </div>

        </div>

        <div className="flex justify-between items-center text-xs text-gray-700 mb-4">
          <span>Privacy policy</span>
          <FaCaretDown size={30} color="black" />
          <span>©2025, All rights reserved</span>
        </div>

        <div className="absolute left-0 bottom-0 flex w-screen justify-around py-2 mt-4 overflow-hidden">
            {[...Array(40)].map((_, i) => (
            <div key={`indicator-top-${i}`} className="h-4 w-1/4 border-r-2 border-black"></div>
            ))}
      </div>
      </section>
    );
}
  