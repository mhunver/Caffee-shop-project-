export const runtime = 'experimental-edge';

import CaffeCard from "../components/CaffeCard";

import { useState } from "react";

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


// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export default function Home({ cafes, activeCategory }: Props) {

  // console.log("index.tsx cafes ")
  // console.log(cafes)

  const [open, setOpen] = useState<any>(false);

  const categories = ["coffee", "dessert", "restaurant", "fastfood"];

  return (
    <div
      className={`min-h-screen  bg-white-200 font-sans dark:bg-black`}
    >

      <div className="text-center text-rose-800 text-xl m-4">
        Kafeler
      </div>

      <div className="hidden md:flex gap-3 ml-6">
        <a
          href="/"
          className={`px-3 py-1 rounded-md text-sm ${!activeCategory ? "bg-black text-white" : "bg-gray-200"
            }`}
        >
          Hepsi
        </a>

        {categories.map((category) => (
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

      <div className="relative md:hidden ml-12">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between rounded-md bg-gray-200 px-4 py-2 text-sm font-medium"
        >
          {activeCategory ?? "Kategori seç"}
          <span>▾</span>
        </button>

        {open && (
          <div className="absolute z-50 mt-2 w-full rounded-md bg-white shadow-lg">
            <a
              href="/"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Hepsi
            </a>

            {categories.map((cat) => (
              <a
                key={cat}
                href={`/?category=${cat}`}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                {cat}
              </a>
            ))}
          </div>
        )}
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
    "https://cafes-sync.mhunver.workers.dev",
    { cache: "no-store" }
  );

  const cafes = await res.json();

  let filtered = cafes;

  if (category && mapPlaceCategory[category]) {
    const allowedTypes = mapPlaceCategory[category];

    filtered = cafes.filter((c: any) =>
      c.types?.some((t: string) => allowedTypes.includes(t))
    );
  }

  return {
    props: {
      cafes: filtered,
      activeCategory: category,
    },
  };
}


