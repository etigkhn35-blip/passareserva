"use client";

import Link from "next/link";
import { blogPosts } from "@/data/blogPosts";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-[1100px] mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">📰 Blog</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogPosts.map((p) => (
            <Link
              key={p.id}
              href={`/blog/${p.id}`}
              className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition block"
            >
              <div className="h-44 w-full bg-gray-100 overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="font-semibold text-gray-900 line-clamp-2">
                  {p.title}
                </div>
                <div className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {p.desc}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
