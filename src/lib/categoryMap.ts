export function mapPlaceTypesToCategory(types: string[]): string {
    if (types.includes("cafe")) return "coffee";
    if (types.includes("bakery")) return "dessert";
    if (types.includes("restaurant")) return "restaurant";
    if (types.includes("meal_takeaway")) return "fastfood";
    return "other";
}
