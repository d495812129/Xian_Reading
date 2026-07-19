import type { Book, Category } from "@/lib/types";

// 是否为 mock 模式（未配置真实 Supabase）
export const isMockMode =
  process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder.supabase.co";

// 预览用 mock 数据，配好 Supabase 后不会用到
export const mockCategories: Category[] = [
  { id: "c1", name: "小说", slug: "novel", created_at: "" },
  { id: "c2", name: "技术", slug: "tech", created_at: "" },
  { id: "c3", name: "历史", slug: "history", created_at: "" },
  { id: "c4", name: "哲学", slug: "philosophy", created_at: "" },
  { id: "c5", name: "其他", slug: "other", created_at: "" },
];

export const mockBooks: Book[] = [
  {
    id: "b1",
    title: "三体",
    author: "刘慈欣",
    description:
      "文化大革命如火如荼地进行的同时，军方探寻外星文明的绝秘计划“红岸工程”取得了突破性进展。但在按下发射键的那一刻，历经劫难的叶文洁没有意识到，她彻底改变了人类的命运。",
    cover_url: "https://picsum.photos/seed/santi/300/400",
    category_id: "c1",
    pan_link: "https://pan.baidu.com/s/xxxxx",
    pan_password: "abcd",
    created_by: null,
    created_at: "",
    updated_at: "",
    categories: mockCategories[0],
  },
  {
    id: "b2",
    title: "活着",
    author: "余华",
    description:
      "讲述了农村人福贵悲惨的人生遭遇。福贵本是个阔少爷，却因嗜赌如命，输光家产一贫如洗。",
    cover_url: "https://picsum.photos/seed/huozhe/300/400",
    category_id: "c1",
    pan_link: "https://pan.baidu.com/s/yyyyy",
    pan_password: "wxyz",
    created_by: null,
    created_at: "",
    updated_at: "",
    categories: mockCategories[0],
  },
  {
    id: "b3",
    title: "人类简史",
    author: "尤瓦尔·赫拉利",
    description:
      "十万年前，地球上至少有六个人种；如今，却只剩下我们自己——智人。从认知革命到科学革命，人类是如何走到今天的？",
    cover_url: "https://picsum.photos/seed/sapiens/300/400",
    category_id: "c3",
    pan_link: "https://pan.baidu.com/s/zzzzz",
    pan_password: "1234",
    created_by: null,
    created_at: "",
    updated_at: "",
    categories: mockCategories[2],
  },
  {
    id: "b4",
    title: "深入理解计算机系统",
    author: "Randal E. Bryant",
    description:
      "从程序员的视角讲解计算机系统，涵盖数据表示、程序结构、存储器层次结构、链接、异常控制流、虚拟内存、系统级 I/O、网络与并发编程。",
    cover_url: "https://picsum.photos/seed/csap/300/400",
    category_id: "c2",
    pan_link: "https://pan.baidu.com/s/aaaaa",
    pan_password: "csap",
    created_by: null,
    created_at: "",
    updated_at: "",
    categories: mockCategories[1],
  },
  {
    id: "b5",
    title: "苏菲的世界",
    author: "乔斯坦·贾德",
    description:
      "14岁的少女苏菲不断接到一些极不寻常的来信，世界像谜团一般在她眼底展开。在一位神秘导师的指引下，苏菲开始思索从古希腊到康德、从祁克果到弗洛伊德等各位大师所思考的根本问题。",
    cover_url: null,
    category_id: "c4",
    pan_link: "https://pan.baidu.com/s/bbbbb",
    pan_password: "sophi",
    created_by: null,
    created_at: "",
    updated_at: "",
    categories: mockCategories[3],
  },
  {
    id: "b6",
    title: "百年孤独",
    author: "加西亚·马尔克斯",
    description:
      "布恩迪亚家族七代人的传奇故事，以及加勒比海沿岸小镇马孔多的百年兴衰，反映了拉丁美洲一个世纪以来风云变幻的历史。",
    cover_url: "https://picsum.photos/seed/macondo/300/400",
    category_id: "c1",
    pan_link: "https://pan.baidu.com/s/ccccc",
    pan_password: "100yr",
    created_by: null,
    created_at: "",
    updated_at: "",
    categories: mockCategories[0],
  },
];
