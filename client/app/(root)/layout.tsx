import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full text-white h-screen">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)]">
        {/* <Sidebar /> */}
        {children}
      </div>
    </div>
  );
}
