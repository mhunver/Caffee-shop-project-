import { useRouter } from "next/router";
import Image from "next/image";

import { StarIcon, LockOpenIcon, LockClosedIcon, MapPinIcon } from "@heroicons/react/20/solid";
import { useEffect } from "react";

export default function CafeDetail({ cafe }) {

    const Date_format = (time: string) => {
        const hour = time.slice(0, 2);
        const min = time.slice(2, 4);
        return `${hour}:${min}`;

    }
    const days = ["Pazar", "Pazartesi", "salı", "Çarşamba", "PErşembe", "Cuma", "Cumartesi"];

    useEffect(() => {
        console.log("cafe")
        console.log(cafe)


    }, [])
    const router = useRouter();
    const { id } = router.query;

    const photos =
        cafe?.photos?.map(
            (p) =>
                `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${p.photo_reference}&key=${process.env.GOOGLE_PLACES_KEY}`
        ) || [];

    const stars = [1, 2, 3, 4, 5];

    if (!cafe) {
        return <p className="p-6">Kafe bulunamadı</p>;
    }


    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">{cafe.name}</h1>

                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
      ${cafe?.current_opening_hours?.open_now
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                >
                    {cafe?.current_opening_hours?.open_now ? "Şu an açık" : "Şu an kapalı"}
                </span>
            </div>

            <p className="text-gray-500 mb-4">{cafe.location}</p>
            <div className="flex items-center m-2">
                {stars.map((s, index) => (
                    <StarIcon
                        key={index}
                        className={`h-4 w-4 ml-1 ${index < cafe?.rating ? "text-yellow-300" : "text-gray-200"
                            }`}
                    />
                ))}
                <span>{cafe?.rating}</span>
            </div>

            <div className="flex gap-3 overflow-x-auto mb-6 pb-2">
                {photos.map((photo, index) => (
                    <img
                        key={index}
                        src={photo}
                        alt={cafe.name}
                        className="h-40 w-64 rounded-xl object-cover flex-shrink-0"
                    />
                ))}
            </div>


            <div>
                <h2 className="text-xl font-bold mt-2">Konum</h2>
                <div className="flex items-start gap-2">
                    <MapPinIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                        <p className="text-sm text-gray-700">
                            {cafe.formatted_address}
                        </p>
                        <a
                            href={cafe?.url}
                            target="_blank"
                            className="text-blue-600 text-sm underline"
                        >
                            Haritada Göster
                        </a>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="text-xl font-bold mt-2">çalışma saatleri </h2>
                {cafe.opening_hours?.periods.map((work, index) => (
                    <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                            {days[work.open.day]}
                        </span>
                        <span className="text-gray-600">
                            {Date_format(work.open.time)} –{" "}
                            {Date_format(work.close.time)}
                        </span>
                    </div>
                ))}
            </div>


            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">
                    Gelen Yorumlar ({cafe?.reviews?.length || 0})
                </h2>

                <div className="space-y-4">
                    {cafe?.reviews?.map((comment, index) => (
                        <div
                            key={index}
                            className="bg-white border rounded-xl p-4 shadow-sm"
                        >
                            {/* ÜST SATIR */}
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

                                <div className="flex items-center gap-1">
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


                            <p className="text-sm text-gray-700 leading-relaxed">
                                {comment.text || "Yorum bulunmuyor."}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div >
    );
}

export async function getServerSideProps(context: any) {
    const { id } = context.params;

    const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=${process.env.GOOGLE_PLACES_KEY}`
    );

    const data = await res.json();

    console.log("GOOGLE DETAIL DATA:");
    console.log(data.result);

    return {
        props: {
            cafe: data.result || null,
        },
    };
}
