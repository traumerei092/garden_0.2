export interface Address {
  postal_code: string;
  prefecture: string;
  city: string;
  district: string;
  town: string;
  street_address: string;
  building?: string;
}

export interface Shop {
  id: number;
  name: string;
  address: Address;
  latitude: number | null;
  longitude: number | null;
  seat_count: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  types: ShopType[];
  concepts: ShopConcept[];
  layouts: ShopLayout[];
  icon_image: string | null;
  photos: ShopPhoto[];
  phone_number: string | null; // ここに追加
  opening_hours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
}

export interface ShopType {
  id: number;
  name: string;
}

export interface ShopConcept {
  id: number;
  name: string;
}

export interface ShopLayout {
  id: number;
  name: string;
}

export interface ShopPhoto {
  id: number;
  image: string;
  caption: string;
  uploaded_by: number;
  uploaded_at: string;
}

export interface ShopFormData {
  name: string;
  address: Address;
  phone_number: string | null;
  latitude: number | null;
  longitude: number | null;
  seat_count: number;
  capacity: number;
  opening_hours: {
    [key: string]: { open: string; close: string; isOpen: boolean };
  } | null;
  types: number[];
  concepts: number[];
  layouts: number[];
  icon_image?: File;
}