"use client";

import { useRouter } from "next/navigation";
import type { Category } from "@/library/getPhotos";

const categories: Category[] = ["event", "wedding", "graduation"];

export default function CategoryTabs({
  activeCategory,
  basePath,
}: {
  activeCategory: Category;
  basePath: "/foto" | "/videos";
}) {
  const router = useRouter();

  const handleClick = (category: Category) => {
    router.push(`${basePath}?category=${category}`);
  };

  return (
    <div className="flex justify-center gap-4 my-8">
      {categories.map((category) => {
        const isActive = activeCategory === category;

        return (
          <button
            key={category}
            onClick={() => handleClick(category)}
            className={`px-6 py-2 rounded-full border transition ${
              isActive
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        );
      })}
    </div>
  );
}
