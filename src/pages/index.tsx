import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

import data from "../data/cafes.json"

import CaffeCard from "../components/CaffeCard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {

  console.log("data");
  console.log(data);


  return (
    <div
      className={`${geistSans.className} ${geistMono.className} flex min-h-screen  bg-zinc-50 font-sans dark:bg-black`}
    >

      <div className="ml-2">
        {
          data.map((c) => (
            <CaffeCard key={c.id} cafe={c} />
          ))}

      </div>


    </div>
  );
}
