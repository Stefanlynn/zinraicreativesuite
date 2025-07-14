import { CategoryType } from "@/lib/types";
import { Share2, Gavel, Calendar, Store } from "lucide-react";

interface CategoryTabsProps {
  activeCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

export default function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  const categories = [
    { id: 'all' as CategoryType, label: 'All Categories', icon: null },
    { id: 'social-media' as CategoryType, label: 'Social Media', icon: Share2 },
    { id: 'field-tools' as CategoryType, label: 'Field Tools', icon: Gavel },
    { id: 'events' as CategoryType, label: 'Events', icon: Calendar },
    { id: 'store' as CategoryType, label: 'ZiNRAi Store', icon: Store },
  ];

  return (
    <section className="py-12 bg-zinrai-secondary">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              >
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {category.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
