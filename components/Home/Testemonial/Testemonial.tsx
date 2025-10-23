import React from "react";
import Image from "next/image";
import Link from "next/link";

interface TestimonialCardProps {
  name: string;
  username: string; 
  content: string;
  avatar: string;
}

const TestimonialCard = ({ name, username, content, avatar }: TestimonialCardProps) => {
  return (
    <div className="rounded-2xl border border-[#2E3033] bg-[#131313] p-6 md:p-8 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image 
              src={avatar} 
              alt={`${name}'s avatar`} 
              fill 
              className="object-cover" 
            />
          </div>
          <div>
            <p className="text-[#E0E0E0] font-medium">{name}</p>
            <p className="text-gray-400 text-sm">@{username}</p>
          </div>
        </div>
        <Link 
          href={`https://x.com/${username}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-[#00FF80] transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </Link>
      </div>
      <p className="text-[#E0E0E0] text-base md:text-lg leading-relaxed">{content}</p>
    </div>
  );
};

const Testemonial = () => {
  const testimonials = [
    {
      name: "itsdave.solana",
      username: "sarahj_learns",
      content: "EduLearn has completely transformed my learning experience. The interactive quizzes and AI-powered chat make it so easy to stay engaged. I've earned 5 NFTs already and my streak is at 45 days!",
      avatar: "/assets/avatar.jpg"
    },
    {
      name: "Emma",
      username: "emma3bw",
      content: "EduLearn turned Web3 from confusing to exciting for me. It feels like having a smart friend who explains everything simply while making learning fun with quizzes, XP, and NFTs that prove your progress.",
      avatar: "https://pbs.twimg.com/profile_images/1927500943022571520/gAmxyvYR_400x400.jpg"
    },
    {
      name: "Valour",
      username: "0xvalour",
      content: "I've been using EduLearn for a while and it's been amazing! I can create my own learning roadmaps, making Web3 learning easy and fun, and I even earn NFTs as proof of my progress!",
      avatar: "https://pbs.twimg.com/profile_images/1970446634363371520/AIpKFc44_400x400.jpg"
    }
  ];

  return (
    <div id="testimonial" className="px-4 sm:px-6 md:px-8 overflow-x-hidden relative">
      <div className="mt-10 md:mt-20 lg:mt-30 flex flex-col gap-8 md:gap-12 lg:gap-20 relative z-10">
        <div className="rounded-[16px] border-2 border-[#2E3033] bg-[#131313] text-[#00FF80] leading-[28px] md:leading-[36px] flex items-center justify-center w-fit px-4 md:px-[24px] py-2 md:py-[15.5px] text-sm md:text-base">
          Testimonial
        </div>
        <h2 className="text-[#E0E0E0] leading-[32px] sm:leading-[40px] md:leading-[56px] font-[600] text-2xl md:text-3xl lg:text-[40px]">
          Hear what other users say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              username={testimonial.username}
              content={testimonial.content}
              avatar={testimonial.avatar}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testemonial;
