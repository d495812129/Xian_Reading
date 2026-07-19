// 数据库类型定义

export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  description: string | null;
  cover_url: string | null;
  category_id: string | null;
  pan_link: string;
  pan_password: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // 关联查询时带出
  categories?: Category | null;
};

export type Profile = {
  id: string;
  username: string | null;
  is_admin: boolean;
  created_at: string;
};
