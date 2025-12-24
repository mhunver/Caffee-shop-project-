import { useRouter } from "next/router";
import Image from "next/image";

import { StarIcon } from "@heroicons/react/20/solid";
import { useEffect } from "react";

export default function CafeDetail({ cafe }) {

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
            <h1 className="text-2xl font-bold mb-2">{cafe.name}</h1>
            <p className="text-gray-500 mb-4">{cafe.location}</p>
            <div className="flex items-center m-2">
                {stars.map((s, index) => (
                    <StarIcon
                        key={index}
                        className={`h-4 w-4 ml-1 ${index < cafe?.rating ? "text-yellow-300" : "text-gray-200"
                            }`}
                    />
                ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
                {photos?.map((photo, index) => (
                    <img
                        key={index}
                        src={photo}
                        alt={cafe.name}
                        width={100}
                        height={100}
                        className="rounded-lg object-cover"
                    />
                ))}
            </div>
            <div className="hidden md:grid grid-cols-2 mb-2">
                <div className="col-span-1">
                    <h2 className="text-xl font-bold mt-2">Hakkımızda</h2>
                    <p>{cafe.about}</p>
                </div>

                {/* <div className="col-span-1 m-3">
                    <h2>Çalışma saatleri</h2>
                    <table>
                        <td></td>
                    </table>
                </div> */}

            </div>
            <div>
                <h2 className="text-xl font-bold mt-2">Konum</h2>
                <iframe className="rounded-md m-2" src={cafe?.map} width="300" height="300" loading="lazy"></iframe>
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
