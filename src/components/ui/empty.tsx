import { Card, CardContent } from "@/components/ui/card";

interface EmptyProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function Empty({
  title = "No items found",
  description = "There are no items to display at this time.",
  icon,
}: EmptyProps) {
  return (
    <Card className="border-dashed border-2 w-full shadow-none h-[calc(100vh-20rem)] flex items-center justify-center">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6">
        {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
