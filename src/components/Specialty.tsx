import React from "react";
import Image from "next/image";

export default function Specialty() {
  return (
    <div className="bg-neutral-200">
      <Image src="/images/torn-paper-divider-lower.png" alt="page divider" width={1200} height={80} className="w-full h-auto" />
      <div className='flex w-full p-2 md:p-6 justify-around items-center '>
        <h2 className='text-lg tracking-tighter font-extrabold md:text-3xl md:tracking-widest'>BUSINESS</h2>
        <span className=' text-lg md:text-3xl font-extrabold'>#</span>
        <h2 className='text-lg tracking-tighter font-extrabold md:text-3xl md:tracking-widest'>EVENTS</h2>
        <span className='text-lg md:text-3xl font-extrabold'>#</span>

        <div className="relative w-fit px-2 py-1.5 md:px-4 md:py-3 bg-cover bg-center text-lg tracking-tighter md:text-3xl text-blue-300 font-extrabold md:tracking-widest">

            <div className="absolute top-0 left-0 w-3 h-3 md:w-4 md:h-4 border-t-2 border-l-2 border-blue-300" />
            <div className="absolute bottom-0 left-0 w-3 h-3 md:w-4 md:h-4 border-b-2 border-l-2 border-blue-300" />

            <div className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 border-t-2 border-r-2 border-blue-300" />
            <div className="absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 border-b-2 border-r-2 border-blue-300" />


            <span className="z-10">WEDDING</span>
        </div>

        <span className='text-lg md:text-3xl font-extrabold'>#</span>
        <h2 className='text-lg tracking-tighter font-extrabold md:text-3xl md:tracking-widest'>GRADUATION</h2>
      </div>

      <section className="my-2 mx-2 md:mx-5 px-5 lg:px-8 py-8 bg-black flex flex-col justify-center">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-50 mb-6">
          ABOUT ME
        </h2> 

        <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-8">
          
          <div className="w-full md:w-1/2 bg-neutral-50 p-4 space-y-4 md:p-6 md:space-y-8">
            <p className='text-sm md:text-md lg:text-xl leading-relaxed'>
              I&apos;m <strong>Bagus Ananda</strong>, a photographer based in <strong>Bali</strong> with over <strong>eight years of experience</strong>,
              capturing stories through the lens with <strong>passion</strong> and <strong>precision</strong>.
            </p> 

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <p className='text-sm md:text-md lg:text-xl leading-relaxed'>
                &quot;I love to highlight the <strong>emotions</strong>, <strong>details</strong>, and <strong>energy</strong> that make each occasion unique.&quot;
              </p>
              <p className='text-sm md:text-md lg:text-xl leading-relaxed'>
                Deliver photographs that not only <strong>document</strong>, but also <strong>connect</strong>—making
                you <strong>relive the experience</strong>, feel the atmosphere, and see the beauty in every frame.
              </p>
            </div>
          </div>

         
          <div className="grid grid-cols-2 gap-4 md:gap-8 w-full md:w-1/2">
            {[1, 2, 3, 4].map((num) => (
              <Image
                key={num}
                className="w-full h-40 md:h-48 object-cover bg-neutral-50"
                src={`/highlights/${num}.JPG`}
                alt={`Highlight ${num}`}
                width={400}
                height={300}
              />
            ))}
          </div>
        </div>


        
      </section>

      <Image src="/images/torn-paper-divider-upper.png" alt="page divider" width={1200} height={80} className="w-full h-auto" />
    </div>
    
    
    
  )
}
