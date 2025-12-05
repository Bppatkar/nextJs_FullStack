import Image from 'next/image';
import React from 'react';

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
      <div>
        <h1 className="text-6xl md:text-7xl lg:text-9xl">Clash</h1>
      </div>
    </div>
  );
}

export default HeroSection;
