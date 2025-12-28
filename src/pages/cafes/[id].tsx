import { useRouter } from "next/router";
import Image from "next/image";

import { StarIcon, HomeIcon, PhoneIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import Link from "next/link";

type Cafe = {
    id: string;
    name: string;
    location: string;
    rating: number;
    photos: string[];
    types?: string[];
    open_now?: boolean;
    formatted_address?: string;
};

type CafeDetailProps = {
    cafe: Cafe;
};

type Review = {
    author_name: string;
    rating: number;
    text?: string;
    profile_photo_url: string;
    relative_time_description: string;
};

type CafeDetails = {
    formatted_phone_number?: string;
    url?: string;
    reviews?: Review[];
    opening_hours?: {
        weekday_text: string[];
    };
};


export default function CafeDetail({ cafe }: CafeDetailProps) {
    const [details, setDetails] = useState<CafeDetails | null>(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (!id) return;

        fetch(`https://cafes-sync.mhunver.workers.dev/details?id=${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error("HTTP " + res.status);
                }
                return res.json();
            })
            .then(data => setDetails(data as any))
            .catch(err => {
                //console.error("DETAIL FETCH ERROR:", err);
            });

    }, [id]);




    const stars = [1, 2, 3, 4, 5];



    if (!cafe) {
        return <p className="p-6">Kafe bulunamadı</p>;
    }


    return (
        <div className="px-4 md:px-6 py-6">
            {/* HEADER */}
            <div className="mb-6 flex items-center gap-3">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                    <HomeIcon className="w-5 h-5" />
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        {cafe.name}
                    </h1>

                    <span
                        className={`mt-2 sm:mt-0 w-fit px-3 py-1 rounded-full text-xs font-medium
            ${cafe?.open_now
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"}
          `}
                    >
                        {cafe?.open_now ? "Şu an açık" : "Şu an kapalı"}
                    </span>
                </div>
            </div>


            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">


                <div>
                    <p className="text-gray-500 mb-4">{cafe.location}</p>

                    <div className="flex flex-row">
                        <PhoneIcon className="w-4 h-4 mr-2 relative top-1" />
                        <p>{details?.formatted_phone_number}</p>

                    </div>


                    {/* RATING */}
                    <div className="flex items-center gap-1 mb-4">
                        {stars.map((_, index) => (
                            <StarIcon
                                key={index}
                                className={`h-4 w-4 ${index < cafe?.rating ? "text-yellow-400" : "text-gray-200"
                                    }`}
                            />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                            {cafe.rating}
                        </span>
                    </div>

                    {/* FOTOĞRAFLAR */}
                    <div className="flex gap-3 overflow-x-auto mb-6 pb-2">
                        {cafe?.photos?.map((photo, index) => (
                            <img
                                key={index}
                                src={photo}
                                alt={cafe.name}
                                className="h-40 w-64 rounded-xl object-cover flex-shrink-0"
                            />
                        ))}
                    </div>

                    {/* KONUM */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">Konum</h2>

                        <iframe
                            src={`https://www.google.com/maps?q=${encodeURIComponent(
                                cafe.name + " " + cafe.formatted_address
                            )}&output=embed`}
                            className="w-full md:w-[680px] h-[280px] rounded-xl"
                            loading="lazy"
                        />

                        <div className="mt-2 flex items-center justify-between text-sm">
                            <p className="text-gray-600">{cafe.formatted_address}</p>
                            <a
                                href={details?.url}
                                target="_blank"
                                className="text-blue-600 underline"
                            >
                                Haritada Göster
                            </a>
                        </div>
                    </div>

                    {/* YORUMLAR kısmı burda oluyor  */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">
                            Gelen Yorumlar ({details?.reviews?.length || 0})
                        </h2>

                        <div className="space-y-4">
                            {details?.reviews?.map((comment, index) => (
                                <div
                                    key={index}
                                    className="bg-white border rounded-xl p-4 shadow-sm"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={comment.profile_photo_url}
                                                alt={comment.author_name}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <h3 className="text-sm font-semibold">
                                                    {comment.author_name}
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    {comment.relative_time_description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((_, i) => (
                                                <StarIcon
                                                    key={i}
                                                    className={`h-4 w-4 ${i < comment.rating
                                                        ? "text-yellow-400"
                                                        : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-700">
                                        {comment.text || "Yorum bulunmuyor."}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SAĞ TARAF – ÇALIŞMA SAATLERİ */}
                <aside className="lg:sticky lg:top-6 h-fit">
                    <div className="rounded-xl border bg-white p-4 shadow-sm">
                        <h2 className="text-lg font-semibold mb-3">
                            🕒 Çalışma Saatleri
                        </h2>

                        {details?.opening_hours?.weekday_text ? (
                            <ul className="space-y-2">
                                {details.opening_hours.weekday_text.map((work, index) => (
                                    <li
                                        key={index}
                                        className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700"
                                    >
                                        {work}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 italic">
                                Çalışma saatleri paylaşılmamış
                            </p>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );

}

export async function getServerSideProps(context: any) {

    const { id } = context.params;

    const res = await fetch(
        "https://cafes-sync.mhunver.workers.dev",
        { cache: "no-store" }
    );

    const cafes = (await res.json() as Cafe[]);

    const cafe = cafes.find((c: any) => c.id === id) || null;

    return {
        props: {
            cafe,

        },
    };
}
