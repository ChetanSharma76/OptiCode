import React from "react";
import { Carousel as ResponsiveCarousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel CSS
import ss1 from "../assets/ss1.png";
import ss3 from "../assets/ss3.png"; 
import ss4 from '../assets/ss4.png';
import ss5 from '../assets/ss5.png';
import ss6 from '../assets/ss6.png';

const Carousel = () => {
  const images = [ss1, ss3, ss4, ss5, ss6];

  return (
    <div className="w-full py-10 bg-[#07034d]">
      <h1 className="font-bold text-3xl text-center mb-6 text-white">
        Highlights
      </h1>
      <div className="max-w-4xl mx-auto px-4">
        <ResponsiveCarousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={2000}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="flex justify-center rounded-2xl items-center h-[300px] sm:h-[250px] md:h-[350px]"
            >
              <img
                src={src}
                alt={`screenshot-${i}`}
                className="w-[80%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[400px] rounded-2xl h-full object-contain "
              />
            </div>
          ))}
        </ResponsiveCarousel>
      </div>
    </div>
  );
};

export default Carousel;
