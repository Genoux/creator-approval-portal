import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CUSTOM_FIELD_IDS } from "@/constants/customFields";
import type { Task } from "@/types/tasks";
import { EmptyState } from "./EmptyState";
import { TaskCard } from "./TaskCard";

interface TasksGridProps {
  tasks: Task[];
  isLoading: boolean;
}

export function TasksGrid({ tasks, isLoading }: TasksGridProps) {
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i.toString()}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const groupedTasks = tasks.reduce((groups: Record<string, Task[]>, task) => {
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
        } else if (status === "Sufficient (Backup)") {
          category = "Backup";
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

  // Define the 4 categories with simplified names
  const fixedCategories = ["Accepted", "Declined", "Review", "Backup"];

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Creator Approval Portal ({tasks.length} creators)
        </h2>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">No tasks found</div>
        </div>
      ) : (
        <Tabs defaultValue="Accepted" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {Object.entries(orderedGroups).map(([status, statusTasks]) => (
              <TabsTrigger key={status} value={status} className="text-sm">
                {status} ({statusTasks.length})
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(orderedGroups).map(([status, statusTasks]) => (
            <TabsContent key={status} value={status} className="mt-6">
              {statusTasks.length === 0 ? (
                <EmptyState
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
