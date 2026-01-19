"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { blogPosts } from "@/data/blogPosts";

export default function BlogDetailPage() {
  const { id } = useParams();

  const post = blogPosts.find((p) => p.id === String(id));

  if (!post) {
    return (
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-[900px] mx-auto px-4">
          <Link href="/blog" className="text-sm text-primary hover:underline">
            ← Blog’a geri dön
          </Link>

          <div className="mt-6 bg-white border border-gray-200 rounded-xl p-5 text-gray-700">
            Blog yazısı bulunamadı.
          </div>
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

        <div className="mt-5 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="h-56 w-full bg-gray-100 overflow-hidden">
            <img
              src={post.img}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6">
            <div
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
