import { useEffect } from "react";

import Link from "next/link";
import next from "next";

const Card = ({ cafe }) => {


    useEffect(() => {
        // console.log(key);
        console.log(cafe);

    }, [])

    return (
        <div className="flex flex-directions-row border rounded-lg p-4 cursor-pointer">

            <div>
                <img src={cafe?.photos?.[1]} />
                <h1>{cafe?.name}</h1>
                <h4>{cafe?.location}</h4>

            </div>



        </div>
    )

}

export default Card;