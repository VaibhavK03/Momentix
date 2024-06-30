import React from "react";
import { IoAddCircle } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";

const RightSidebar = () => {
  return (
    <div className="hidden lg:block w-[24%] m-2">
      <div className="border  border-blue-300 rounded-2xl h-[300px] max-w-[400px] mt-6 bg-[#151515]">
        <div className="profile-info flex m-4 mb-0 p-8 pl-0 items-center gap-6">
          <div className="profile-dp ">
            <div className="h-14 w-14">
              <img
                className="rounded-full"
                src="https://res.cloudinary.com/dfnf4rnus/image/upload/v1705497998/eihp2te08qaeprkm8xkb.jpg"
                alt=""
              />
            </div>
          </div>
          <div className="profile-name flex flex-col">
            <span className="">Vaibhav Khamkar</span>
            <span className="text-sm">vaibhav khamkar</span>
          </div>
        </div>
        <div className="action-buttons w-full">
          <div className="flex px-3 gap-4 justify-between">
            <button
              type="button"
              className="flex justify-center items-center gap-2 text-white w-[250px] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-2xl text-sm px-4 py-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              <IoAddCircle size={20} /> <span>Create Post</span>
            </button>
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-2xl text-sm px-4 py-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              View Profile
            </button>
          </div>
        </div>
        <div className="action-buttons w-full mt-4">
          <div className="flex px-3 gap-4 justify-between">
            <button
              type="button"
              className=" flex justify-center items-center gap-4 text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-2xl text-sm px-4 py-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              <TbLogout2 size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
