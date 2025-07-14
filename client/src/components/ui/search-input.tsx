import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchInput({ onSearch, placeholder = "Search graphics, videos, templates..." }: SearchInputProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, onSearch]);

  return (
    <div className="relative">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full px-6 py-4 bg-zinrai-secondary border border-zinrai-border rounded-lg text-white placeholder-zinrai-muted focus:outline-none focus:border-zinrai-accent pr-12"
      />
      <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinrai-muted h-5 w-5" />
    </div>
  );
}
