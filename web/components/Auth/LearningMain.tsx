"use client";
import React from 'react';
import Image from "next/image";
import LearningGoal from "./LearningGoal";
import Sidebar from "./sidebar";

const LearningMain = () => {
  return (
    <div className="flex min-h-screen bg-[#F9FBFC] dark:bg-[#0D0D0D]">
      <div className="hidden lg:flex lg:w-1/2">
        <Sidebar />
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-[500px]">
          <LearningGoal />
        </div>
      </div>
    </div>
  );
};

export default LearningMain;

