export interface Brand {
  id: number;
  name: string;
  logo: string;
}

export interface Car {
  id: number;
  name: string;
  images: string[];
  brand: string;
  rating: number;
  location?: string;
  type: string;
  seats?: number;
  price: number;
  tags: string[];
  hasBookNow?: boolean;
  description?: string;
  fuel_type: string;
  color: string;
}

export interface Feature {
  icon: string;
  title: string;
  value: string;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  image: string;
}

export interface Owner {
  name: string;
  verified: boolean;
  image: string;
}

export interface CarDetails extends Car {
  description: string;
  reviews: number;
  features: Feature[];
  owner: Owner;
  reviewList: Review[];
}

export interface RentalTimeOption {
  id: string;
  name: string;
}

export interface GenderOption {
  id: string;
  name: string;
}

export interface ColorOption {
  id: string;
  name: string;
  color: string;
}

export interface FuelOption {
  id: string;
  name: string;
}

export interface CarType {
  id: string;
  name: string;
}
