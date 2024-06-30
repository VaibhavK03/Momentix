import Link from "next/link";
import React from "react";
import { FaHome } from "react-icons/fa";
import { GoCommentDiscussion } from "react-icons/go";
import { FcAbout } from "react-icons/fc";

const Sidebar = () => {
  return (
    <div className="hidden 2xl:block left-0 border-r border-gray-600 h-full w-[16%] p-10 ">
      <div className="w-full">
        <ul className="space-y-8 w-full">
          <li>
            <Link className="flex items-center gap-2" href="/">
              <FaHome size={20} />
              <span className="text-xl cursor-pointer hover:text-blue-500">
                Home
              </span>
            </Link>
          </li>
          <li>
            <Link className="flex items-center gap-2" href="/forum">
              <GoCommentDiscussion size={20} />
              <span className="text-xl cursor-pointer  hover:text-blue-500">
                Thread's
              </span>
            </Link>
          </li>
          <li>
            <Link className="flex items-center gap-2" href="/about">
              <FcAbout size={20} />
              <div className="text-xl cursor-pointer  hover:text-blue-500">
                About Momentix
              </div>
            </Link>
          </li>
        </ul>
        {/* <ul className="gap-6 w-full mt-[38rem]">
          <li>
            <Link className="flex items-center gap-2" href="/logout">
              <TbLogout2 size={20} />
              <div className="text-xl cursor-pointer  hover:text-blue-500">
                Logout
              </div>
            </Link>
          </li>
        </ul> */}
      </div>
    </div>
  );
};

export default Sidebar;
