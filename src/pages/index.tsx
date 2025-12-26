import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

import data from "../data/cafes.json"

import CaffeCard from "../components/CaffeCard";

import { mapPlaceCategory } from "@/lib/categoryMap";



type Cafe = {
  id: string;
  name: string;
  location: string;
  photos: string[];
  rating: number;
  category: string;
};

type Props = {
  cafes: Cafe[],
  activeCategory: string | null

}


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home({ cafes, activeCategory }: Props) {

  return (
    <div
      className={`${geistSans.className} ${geistMono.className}  min-h-screen  bg-zinc-50 font-sans dark:bg-black`}
    >

      <div className="text-center m-2">
        Kafeler
      </div>

      <div className="flex gap-3">
        {["coffee", "dessert", "restaurant", "fastfood"].map((category) => (
          <a
            key={category}
            href={`/?category=${category}`}
            className={`px-3 py-1 rounded-md text-sm ${activeCategory === category
              ? "bg-black text-white"
              : "bg-gray-200"
              }`}
          >
            {category}
          </a>
        ))}
      </div>

      <div className="ml-2 flex  flex-wrap">
        {
          cafes.map((c) => (
            <CaffeCard key={c.id} cafe={c} />
          ))}

      </div>


    </div>
  );
}


export async function getServerSideProps(context: any) {
  const category = context.query.category || null;

  const res = await fetch(
    " https://cafes-sync.mhunver.workers.dev",
    { cache: "no-store" }
  );

  const cafes = await res.json();

  const filtered = category
    ? cafes.filter((c: any) => c.types?.includes("cafe"))
    : cafes;

  return {
    props: {
      cafes: filtered,
      activeCategory: category,
    },
  };
}


