export interface Shop {
  id: number;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  seat_count?: number;
  capacity: number;
  opening_hours: Record<string, string>;  // 営業時間はオブジェクトで管理
  created_by: number;
  created_at: string;
  updated_at: string;
  types: ShopType[];
  concepts: ShopConcept[];
  layouts: ShopLayout[];
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
