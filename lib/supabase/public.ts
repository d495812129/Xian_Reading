import { createClient as supabaseCreateClient } from "@supabase/supabase-js";

// 无 cookie 的服务端客户端，用于 sitemap / generateMetadata 等 SEO 场景
export function createPublicClient() {
  return supabaseCreateClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
