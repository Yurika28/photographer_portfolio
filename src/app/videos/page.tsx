import CategoryTabs from "@/components/CategoryTabs";
import VideoGrid from "@/components/ClientVideoGrid";
import { getEventVideosByCategory } from "@/library/getEventVideos";
import type { Category } from "@/library/getPhotos";
import Logo from "@/components/Logo";
import Contacts from "@/components/Contacts";
import Image from "next/image";

export const revalidate = 60;

type VideosPageProps = {
  params?: Promise<Record<string, string | string[] | undefined>>;
  searchParams?: Promise<{ category?: string }>;
};

export default async function VideosPage({ searchParams }: VideosPageProps) {
  const resolved = await (searchParams ?? Promise.resolve({} as { category?: string }));
  const categoryParam = resolved.category?.toLowerCase();

  const validCategories: Category[] = [
    "event",
    "graduation",
    "wedding",
  ];

  const activeCategory: Category = validCategories.includes(
    categoryParam as Category
  )
    ? (categoryParam as Category)
    : "event";

  const videos = await getEventVideosByCategory(activeCategory);

  return (
    <div>
        <header className="w-full bg-neutral-200">
            <Logo/>
            <Image src="/images/torn-paper-divider-upper.png" alt="page divider" width={1200} height={80} className="w-full h-auto" />
        </header>
        <CategoryTabs activeCategory={activeCategory} basePath="/videos" />
        <main className="w-full bg-neutral-200">
            <Image src="/images/torn-paper-divider-lower.png" alt="page divider" width={1200} height={80} className="w-full h-auto" />
            <VideoGrid videos={videos} />
            <Image src="/images/torn-paper-divider-upper.png" alt="page divider" width={1200} height={80} className="w-full h-auto" />
        </main>
        <footer  className="bg-neutral-200">
            <Image src="/images/torn-paper-divider-lower.png" alt="page divider" width={1200} height={80} className="w-full h-auto" />
            <Contacts/>
        </footer>

    </div>
   
  );
}
