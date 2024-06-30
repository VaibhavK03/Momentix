import React from "react";
import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import UnderlinedText from "./ui/UnderlinedText";

const Navbar = () => {
  return (
    <div className="flex h-16 w-full items-center justify-between px-8 md:px-24 border-b border-gray-600">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <MountainIcon />
      </Link>
      <h1 className="text-2xl font-semibold text-white cursor-pointer">
        <UnderlinedText>Momentix</UnderlinedText>
      </h1>

      <nav className="hidden items-center gap-6 md:flex text-lg text-white">
        <Link
          href="/"
          className=" transition-colors hover:text-blue-400"
          prefetch={false}
        >
          Home
        </Link>
        <Link
          href="#"
          className=" transition-colors hover:text-blue-400"
          prefetch={false}
        >
          About
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden text-white"
          >
            <MenuIcon />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <div className="grid gap-4 p-4 text-white">
            <Link
              href="#"
              className=" transition-colors hover:text-blue-400"
              prefetch={false}
            >
              Home
            </Link>
            <Link
              href="#"
              className=" transition-colors hover:text-blue-400"
              prefetch={false}
            >
              About
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

export default Navbar;
