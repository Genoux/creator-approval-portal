"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  minLength?: number;
}

export function SearchBar({
  onSearch,
  placeholder = "Search creators...",
  className = "",
  minLength = 2,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  // Smart search - only trigger search when query meets minimum length or is empty
  const effectiveQuery = useMemo(() => {
    return query.length >= minLength || query.length === 0 ? query : "";
  }, [query, minLength]);

  useEffect(() => {
    onSearch(effectiveQuery);
  }, [effectiveQuery, onSearch]);

  const handleSearch = (value: string) => {
    setQuery(value);
  };

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={e => handleSearch(e.target.value)}
          className="pl-10 pr-10 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
