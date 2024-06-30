import React from 'react'
import { IoIosHeartEmpty } from "react-icons/io";
import { FaCommentDots } from "react-icons/fa6";
import { LuSend } from "react-icons/lu";

const PostCard = () => {
  return (
    <div className='md:container mb-10'>
      <div className="post-container container border border-blue-300 rounded-2xl bg-[#151515]">
          <div className="profile-info flex p-8 pl-0 items-center gap-6">
            <div className="profile-dp ">
              <div className="h-14 w-14">
                <img className="rounded-full" src="https://res.cloudinary.com/dfnf4rnus/image/upload/v1705497998/eihp2te08qaeprkm8xkb.jpg" alt="" />
              </div>
            </div>
            <div className="profile-name flex flex-col">
              <span className="">Vaibhav Khamkar</span>
              <span className="text-sm">2days</span>
            </div>
          </div>
          <div className="profile-img h-[65%] pb-4">
            <img className="object-cover h-full rounded-2xl" src="https://res.cloudinary.com/dfnf4rnus/image/upload/v1705736022/s7ds4dhxyxjlimk8lfzt.png" alt="profile-img" />
          </div>
          <div className="profile-interaction mt-4 flex pt-0 p-4 gap-8 ">
            <div className="flex gap-1">
              <span >20,00,00</span>
              <IoIosHeartEmpty size={25} />
            </div>
            <div className="flex gap-1">
              <FaCommentDots size={25} />
              <span>4,000</span>
            </div>
            <div className="flex gap-1">
              <LuSend size={25}/>
              <span>Share</span>
            </div>
          </div>
      </div>
    </div> 
  )
}

export default PostCard