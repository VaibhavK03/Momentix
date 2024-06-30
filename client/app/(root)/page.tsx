import React from "react";
import type { Metadata } from "next";
import { IoIosHeartEmpty } from "react-icons/io";
import { FaCommentDots } from "react-icons/fa6";
import { LuSend } from "react-icons/lu";
import PostCard from "@/components/ui/PostCard";
import RightSidebar from "@/components/RightSidebar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Momentix - Home",
  description: "Momentix is a platform for sharing moments",
};

const Home = () => {
  return (
    <>
    <Sidebar/>
    <div className=" xl:w-[60%] w-full flex flex-col items-center p-5 m-2 overflow-auto no-scrollbar">
      <PostCard/> 
      <PostCard/> 
      <PostCard/> 
      <PostCard/> 
      <PostCard/> 
      <PostCard/> 
    </div>
    <RightSidebar/>
    </>
  );
};

export default Home;
