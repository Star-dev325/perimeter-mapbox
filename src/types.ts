export interface Point {
    lng: number;
    lat: number;
}

export interface Polygon {
    points: Point[];
    name: string;
}