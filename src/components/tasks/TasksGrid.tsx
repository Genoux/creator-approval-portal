import { useEffect, useMemo, useState } from "react";
import { SearchBar } from "@/components/search/SearchBar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Empty } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTaskSearch } from "@/hooks/search/useTaskSearch";
import type { Task } from "@/types/tasks";
import { APPROVAL_LABELS, type ApprovalLabel } from "@/utils/approval";
import { TaskCard } from "./TaskCard";

// Constants
const CATEGORIES = [
  APPROVAL_LABELS.PERFECT,
  APPROVAL_LABELS.GOOD,
  APPROVAL_LABELS.SUFFICIENT,
  APPROVAL_LABELS.POOR_FIT,
  APPROVAL_LABELS.FOR_REVIEW,
] as const;

const LOADING_SKELETON_COUNT = 8;

interface TasksGridProps {
  tasks: Task[];
  isLoading: boolean;
  searchQuery?: string;
  onTabChange?: (tab: string) => void;
  onSearch?: (query: string) => void;
}

export function TasksGrid({
  tasks,
  isLoading,
  searchQuery = "",
  onTabChange,
  onSearch,
}: TasksGridProps) {
  const searchResult = useTaskSearch(tasks, searchQuery);
  const [activeTab, setActiveTab] = useState<ApprovalLabel | "">("");

  // Handle smart tab switching and default tab in one effect
  useEffect(() => {
    // Smart tab switching has priority
    if (
      searchQuery &&
      searchResult.suggestedTab &&
      searchResult.suggestedTab !== activeTab
    ) {
      setActiveTab(searchResult.suggestedTab as ApprovalLabel);
      onTabChange?.(searchResult.suggestedTab);
      return;
    }

    // Set default tab if none selected
    if (!activeTab) {
      setActiveTab(CATEGORIES[0]);
      onTabChange?.(CATEGORIES[0]);
    }
  }, [searchResult.suggestedTab, searchQuery, activeTab, onTabChange]);

  // Memoize grid style to prevent re-calculation
  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${CATEGORIES.length}, minmax(0, 1fr))`,
    }),
    []
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="px-4 lg:px-6">
      <Header
        totalResults={searchResult.totalResults}
        searchQuery={searchQuery}
        searchResult={searchResult}
        onSearch={onSearch}
      />

      {searchResult.totalResults === 0 ? (
        <EmptyState searchQuery={searchQuery} />
      ) : (
        <Tabs
          value={activeTab || CATEGORIES[0]}
          onValueChange={(v) => setActiveTab(v as ApprovalLabel)}
          className="w-full"
        >
          <TabsList className="grid w-full mb-4" style={gridStyle}>
            {CATEGORIES.map((status) => (
              <TabsTrigger key={status} value={status} className="text-sm">
                {status} ({searchResult.resultsByStatus[status]?.length || 0})
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORIES.map((status) => (
            <TabsContent key={status} value={status} className="mt-0">
              <TabContentSection
                status={status}
                tasks={searchResult.resultsByStatus[status] || []}
                searchQuery={searchQuery}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}

// Extracted components for better organization
function LoadingSkeleton() {
  return (
    <div className="px-4 lg:px-6">
      <div className="mb-4">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: LOADING_SKELETON_COUNT }, () => (
          <Card key={`loading-${Math.random()}`}>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-3/4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-3 w-full mb-1" />
              <Skeleton className="h-3 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Header({
  totalResults,
  searchQuery,
  searchResult,
  onSearch,
}: {
  totalResults: number;
  searchQuery: string;
  searchResult: any;
  onSearch?: (query: string) => void;
}) {
  return (
    <div className="mb-4 flex flex-row items-center justify-between">
      <h4 className="text-xl font-semibold tracking-tight">
        {totalResults} creators
      </h4>
      {onSearch && (
        <SearchBar
          onSearch={onSearch}
          totalResults={searchQuery ? totalResults : undefined}
          suggestedTab={searchQuery ? searchResult.suggestedTab : undefined}
          className="w-80"
        />
      )}
    </div>
  );
}

function EmptyState({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="text-center py-8">
      <div className="text-muted-foreground">
        {searchQuery
          ? `No creators found matching "${searchQuery}"`
          : "No creators found"}
      </div>
    </div>
  );
}

function TabContentSection({
  status,
  tasks,
  searchQuery,
}: {
  status: string;
  tasks: Task[];
  searchQuery: string;
}) {
  if (tasks.length === 0) {
    return (
      <Empty
        title={`No creators in "${status}"`}
        description={
          searchQuery
            ? "Try adjusting your search terms to find creators in this status."
            : "Creators will appear here when they're assigned this status."
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
