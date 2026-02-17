import CategoryTabs from "@/components/CategoryTabs";
import MasonryGrid from "@/components/ClientMasonryGrid";
import { getPhotosByCategory, type Category } from "@/library/getPhotos";
import Logo from "@/components/Logo";
import Contacts from "@/components/Contacts";
import Image from "next/image";

export const revalidate = 60;

export default async function FotoPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const categoryParam = category?.toLowerCase();

  const validCategories: Category[] = [
    "event",
    "wedding",
    "graduation",
  ];

  const activeCategory: Category = validCategories.includes(
    categoryParam as Category
  )
    ? (categoryParam as Category)
    : "event";

  const photos = await getPhotosByCategory(activeCategory);

  return (
    <div >
      <header className="w-full bg-neutral-200">
        <Logo/>
        <Image src="/images/torn-paper-divider-upper.png" alt="page divider" width={1200} height={80} className="w-full h-auto" />
      </header>
      <CategoryTabs activeCategory={activeCategory} basePath="/foto" />

      <main className="bg-neutral-200"> 
        <Image src="/images/torn-paper-divider-lower.png" alt="page divider" width={1200} height={80} className="w-full h-auto" />
        <MasonryGrid photos={photos} />
        <Image src="/images/torn-paper-divider-upper.png" alt="page divider" width={1200} height={80} className="w-full h-auto" />
      </main>

      <footer className="bg-neutral-200">
        <Image src="/images/torn-paper-divider-lower.png" alt="page divider" width={1200} height={80} className="w-full h-auto" />
        <Contacts/>
      </footer>
    </div>
    
  );
}
