import { useEffect } from "react";
import { StarIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import next from "next";

type Cafe = {
    id: string;
    name: string;
    location: string;
    rating: number;
    photos: string[];
    types?: string[];
    open_now?: boolean;
};

type CardProps = {
    cafe: Cafe;
};


const Card = ({ cafe }: CardProps) => {

    // console.log("cafe")
    // console.log(cafe)

    const stars = [1, 2, 3, 4, 5];



    return (
        <Link href={(`/cafes/${cafe?.id}`)}>
            <div className="h-85 w-100 flex-column border rounded-lg p-4 m-5 cursor-pointer">

                <div>
                    <img src={cafe?.photos?.[1]} />
                    <h1 className="text-center text-rose-400">{cafe?.name}</h1>
                    <h4>{cafe?.location}</h4>
                    <div className="flex items-center mt-1">
                        {stars.map((s, index) => (
                            <StarIcon
                                key={index}
                                className={`h-4 w-4 ml-1 ${index < cafe?.rating ? "text-yellow-300" : "text-gray-200"
                                    }`}
                            />
                        ))}
                    </div>


                    {cafe?.photos[0] && (
                        <img
                            src={cafe.photos[0]}
                            alt={cafe.name}
                            className="w-full h-50 object-cover rounded-md"
                        />
                    )}
                    <div className="flex flex-row justfy-center">
                        <span>Detay</span>
                        <ArrowRightIcon className="h-4 w-4 ml-2 relative top-1" />
                    </div>

                </div>
            </div>
        </Link>

    )

}

export default Card;