"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { blogPosts } from "@/data/blogPosts";

export default function BlogDetailPage() {
  const { id } = useParams();

  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-[900px] mx-auto px-4">
          <Link href="/blog" className="text-sm text-primary hover:underline">
            ← Blog’a geri dön
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            Yazı bulunamadı
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-[900px] mx-auto px-4">
        <Link href="/blog" className="text-sm text-primary hover:underline">
          ← Blog’a geri dön
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mt-4">{post.title}</h1>

        <div className="mt-4 bg-white border border-gray-200 rounded-xl p-5 text-gray-700 whitespace-pre-line leading-7">
          {post.content}
        </div>
      </div>
    </main>
  );
}
