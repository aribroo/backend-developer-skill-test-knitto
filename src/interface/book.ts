export interface IBook {
  code: string;
  title: string;
  author: string;
  stock: number;
  category_id: number;
  image?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface ICategory {
  id: number
  name: string
  created_at?: Date;
  updated_at?: Date;
}

export interface IBestSellerBook {
  rank: number;
  title: string;
  author: string;
  publisher: string;
  description: string;
  book_image: string;
}

export interface CreateBookRequest {
  code: string;
  title: string;
  author: string;
  stock: number;
  category_id: number
}

export interface UpdateBookRequest {
  code?: string;
  title?: string;
  author?: string;
  stock?: number;
  category_id?: number
}
