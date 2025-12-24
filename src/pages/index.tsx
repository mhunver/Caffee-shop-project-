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

      <div className="ml-2 flex flex- flex-wrap">
        {
          cafes.map((c) => (
            <CaffeCard key={c.id} cafe={c} />
          ))}

      </div>


    </div>
  );
}



export async function getServerSideProps(context: any) {

  console.log("ENV KEY:", process.env.GOOGLE_PLACES_KEY);
  const category = context.query.category || null;

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.1553,26.4142&radius=1500&type=cafe&key=${process.env.GOOGLE_PLACES_KEY}`
  );

  const data = await res.json();

  // console.log("geliyormu")
  // console.log(data)


  const results = data.results || [];

  let cafes = results.map((place: any) => ({
    id: place.place_id,
    name: place.name,
    location: place.vicinity,
    rating: Math.floor(place.rating || 0),
    photos: place.photos
      ? place.photos.map(
        (p: any) =>
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photo_reference}&key=${process.env.GOOGLE_PLACES_KEY}`
      )
      : [],
    category: place.types?.includes("cafe") ? "coffee" : "other",
  }));

  if (category) {
    cafes = cafes.filter((c) => c.category === category);
  }

  return {
    props: {
      cafes,
      activeCategory: category,
    },
  };
}


