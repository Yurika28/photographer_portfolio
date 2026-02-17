import React from 'react'
import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" aria-label="Home">
      <div className='flex items-center gap-2 cursor-pointer'>
        <Image className='w-11 h-16 md:w-18 md:h-22' src="/images/Logo.png" alt="logo" width={44} height={64} />
        <h1 className="ms-madi text-4xl font-bold">Geen Phovid Graphy</h1>
      </div>
    </Link>
  )
}
