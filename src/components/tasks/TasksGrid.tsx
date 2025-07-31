import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CUSTOM_FIELD_IDS } from "@/constants/customFields";
import type { Task } from "@/types/tasks";
import { Empty } from "../ui/empty";
import { SearchBar } from "../ui/search-bar";
import { TaskCard } from "./TaskCard";

// Helper function to group tasks by status
const groupTasksByStatus = (tasksToGroup: Task[]) => {
  return tasksToGroup.reduce((groups: Record<string, Task[]>, task) => {
    const clientApprovalField = task.custom_fields?.find(
      field => field.id === CUSTOM_FIELD_IDS.CLIENT_APPROVAL
    );

    let category = "Review";
    if (
      clientApprovalField?.value !== undefined &&
      clientApprovalField?.value !== null
    ) {
      if (clientApprovalField.type === "drop_down") {
        const options = clientApprovalField.type_config?.options || [];
        const value = clientApprovalField.value;
        const selectedOption =
          typeof value === "number"
            ? options[value]
            : options.find(opt => opt.id === String(value));
        const status =
          selectedOption?.name || selectedOption?.label || "Unknown";

        // TODO: USE CAT ID TO DETERMINE CATEGORY
        if (status === "Perfect (Approved)" || status === "Good (Approved)") {
          category = "Accepted";
        } else if (status === "Poor Fit (Rejected)") {
          category = "Declined";
        } else {
          category = "Review";
        }
      }
    }

    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(task);
    return groups;
  }, {});
};

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
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [activeTab, setActiveTab] = useState("Accepted");

  // Filter tasks based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTasks(tasks);
      return;
    }

    const filtered = tasks.filter(task =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTasks(filtered);

    // Auto-switch to tab with results
    if (filtered.length > 0) {
      const groupedFiltered = groupTasksByStatus(filtered);
      const tabWithResults = Object.keys(groupedFiltered).find(
        tab => groupedFiltered[tab].length > 0
      );
      if (tabWithResults && tabWithResults !== activeTab) {
        setActiveTab(tabWithResults);
        onTabChange?.(tabWithResults);
      }
    }
  }, [searchQuery, tasks, activeTab, onTabChange]);

  if (isLoading) {
    return (
      <div className="px-4 lg:px-6">
        <div className="mb-4">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i.toString()}>
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

  const groupedTasks = groupTasksByStatus(filteredTasks);

  // Define the 3 categories with simplified names
  const fixedCategories = ["Accepted", "Declined", "Review"];

  fixedCategories.forEach(category => {
    if (!groupedTasks[category]) {
      groupedTasks[category] = [];
    }
  });

  // Return only the fixed categories in order
  const orderedGroups: Record<string, Task[]> = {};
  fixedCategories.forEach(category => {
    orderedGroups[category] = groupedTasks[category];
  });

  return (
    <div className="px-4 lg:px-6">
      <div className="mb-4 flex flex-row items-center justify-between">
        <h4 className="text-xl font-semibold tracking-tight">
          {tasks.length} creators
        </h4>
        {onSearch && <SearchBar onSearch={onSearch} className="w-80" />}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-muted-foreground">
            {searchQuery
              ? `No creators found matching "${searchQuery}"`
              : "No tasks found"}
          </div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            {Object.entries(orderedGroups).map(([status, statusTasks]) => (
              <TabsTrigger key={status} value={status} className="text-sm">
                {status} ({statusTasks.length})
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(orderedGroups).map(([status, statusTasks]) => (
            <TabsContent key={status} value={status} className="mt-0">
              {statusTasks.length === 0 ? (
                <Empty
                  title={
                    status === "To Review"
                      ? "No creators to review"
                      : status === "Poor"
                        ? "No creators declined"
                        : `No ${status.toLowerCase()} creators`
                  }
                  description={
                    status === "To Review"
                      ? "All creators have been reviewed. New submissions will appear here for review."
                      : status === "Poor"
                        ? "No creators have been declined. Creators that don't meet the requirements will appear here."
                        : "No creators have been approved yet. Successfully reviewed creators will appear here."
                  }
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {statusTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
