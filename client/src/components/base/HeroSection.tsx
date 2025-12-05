import Image from 'next/image';
import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';

function HeroSection() {
  return (
    <div className=" w-full h-screen flex justify-center items-center flex-col">
      <div>
        <Image
          src="/banner_img.svg"
          alt="banner_img"
          width={800}
          height={800}
        />
      </div>
      <div className=" text-center mt-4">
        <h1 className="text-6xl md:text-7xl lg:text-9xl font-extrabold bg-linear-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
          Clash
        </h1>
        <p className="mt-1 text-2xl md:text-3xl lg:text-4xl font-bold text-center">
          Discover the better choice together
        </p>
        <Link href={'/login'}>
          <Button className="mt-3 font-bold px-6 py-2 rounded-lg bg-linear-to-r from-pink-400 to-purple-500 text-white hover:shadow-lg transition-shadow">
            Start Free
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default HeroSection;
