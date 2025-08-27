'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  text: string;
  author: {
    name: string;
    title: string;
    avatar: string;
    companyLogo: string;
    companyName: string;
  };
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "Crusoe Cloud's is highly collaborative in incorporating our feedback and requests into their feature and product roadmap.",
    author: {
      name: "Aleks Kamko",
      title: "AI Researcher",
      avatar: "/testimonials/aleks-kamko.jpg",
      companyLogo: "/testimonials/playground-logo.svg",
      companyName: "Playground"
    }
  },
  {
    id: 2,
    text: "With Crusoe, we scaled our capacity 5x within hours to serve all of our Oasis users across Europe. This enabled Oasis to seamlessly scale to over 2 million users in just 4 days.",
    author: {
      name: "Dean Leitersdorf",
      title: "Co-Founder & CEO",
      avatar: "/testimonials/dean-leitersdorf.jpg",
      companyLogo: "/testimonials/decart-logo.svg",
      companyName: "Decart"
    }
  },
  {
    id: 3,
    text: "Windsurf's NVIDIA H100 Tensor Core GPUs on Crusoe have been incredibly reliable with a cluster uptime of 99.98%.",
    author: {
      name: "Varun Mohan",
      title: "Co-Founder & CEO",
      avatar: "/testimonials/varun-mohan.jpg",
      companyLogo: "/testimonials/windsurf-logo.svg",
      companyName: "Windsurf"
    }
  },
  {
    id: 4,
    text: "Helios's infrastructure has been instrumental in helping us scale our AI workloads efficiently. Their team is incredibly responsive and their platform just works.",
    author: {
      name: "Sarah Chen",
      title: "CTO",
      avatar: "/testimonials/sarah-chen.jpg",
      companyLogo: "/testimonials/neural-labs-logo.svg",
      companyName: "Neural Labs"
    }
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [avatarError, setAvatarError] = useState(false);
  const [logoError, setLogoError] = useState(false);
  
  // Handle responsive cards count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setCardsToShow(3);
      } else if (window.innerWidth >= 768) {
        setCardsToShow(2);
      } else {
        setCardsToShow(1);
      }
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= testimonials.length - cardsToShow + 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - cardsToShow : prevIndex - 1
    );
  };

  return (
    <section className="w-full bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header - Optional, can be added if needed */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Leading AI Companies
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how top AI companies are scaling their infrastructure with Helios
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ 
              transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)`,
              gap: '24px'
            }}
          >
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="flex-shrink-0 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col"
                style={{ 
                  width: `calc((100% - ${(cardsToShow - 1) * 24}px) / ${cardsToShow})`,
                  minWidth: '320px',
                  height: '320px'
                }}
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-4">
                  <Quote className="w-8 h-8 text-gray-300 rotate-180" />
                </div>
                
                {/* Testimonial Text */}
                <div className="p-6 pb-4 pr-16 flex-grow flex items-start">
                  <p className="text-gray-900 text-base leading-relaxed font-normal">
                    {testimonial.text}
                  </p>
                </div>
                
                {/* Profile Section - Integrated */}
                <div className="px-6 pb-6">
                  <div className="flex items-center justify-between">
                    {/* Avatar and Author Info */}
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {avatarError ? (
                          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                            {testimonial.author.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        ) : (
                          <Image
                            src={testimonial.author.avatar}
                            alt={testimonial.author.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                            onError={() => setAvatarError(true)}
                          />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-semibold text-gray-900">
                          {testimonial.author.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {testimonial.author.title}
                        </p>
                      </div>
                    </div>
                    
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                      <div className="h-8 flex items-center">
                        {logoError ? (
                        <span className="text-sm font-semibold text-gray-800">
                          {testimonial.author.companyName}
                        </span>
                      ) : (
                        <Image
                          src={testimonial.author.companyLogo}
                          alt={testimonial.author.companyName}
                          height={28} // h-7 is 28px
                          width={100} // max-w-[100px]
                          className="object-contain filter brightness-0"
                          onError={() => setLogoError(true)}
                        />
                      )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Controls */}
          <div className="flex justify-end mt-8 gap-4">
            <button
              onClick={prevSlide}
              className="p-2 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded"
              aria-label="Previous testimonials"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-6 h-6 text-gray-700 hover:text-gray-900" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded"
              aria-label="Next testimonials"
              disabled={currentIndex >= testimonials.length - cardsToShow}
            >
              <ChevronRight className="w-6 h-6 text-gray-700 hover:text-gray-900" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}