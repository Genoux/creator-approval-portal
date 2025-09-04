import { SearchBar as SearchBarComponent } from "../ui/search-bar";

interface SearchBarProps {
  onSearch: (query: string) => void;
  totalResults?: number;
  suggestedTab?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  totalResults,
  suggestedTab,
  className,
}: SearchBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <SearchBarComponent onSearch={onSearch} className={className} />

      {totalResults !== undefined && (
        <div className="text-xs text-muted-foreground">
          {totalResults === 0 ? (
            "No results found"
          ) : (
            <>
              {totalResults} result{totalResults !== 1 ? "s" : ""}
              {suggestedTab && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  Found in {suggestedTab}
                </span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
