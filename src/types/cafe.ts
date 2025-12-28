export type Cafe = {
    id: string;
    name: string;
    location: string;
    rating: number;
    photos: string[];
    open_now?: boolean | null;
    formatted_address?: string | null;
};
