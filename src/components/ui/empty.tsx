import { cn } from "@/lib/utils";

interface EmptyProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function Empty({
  title = "No items found",
  description = "There are no items to display at this time.",
  icon,
  className,
}: EmptyProps) {
  return (
    <div
      className={cn(
        "bg-[#F9F7F7] w-full shadow-none h-full flex items-center justify-center rounded-3xl",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center py-12 px-6">
        {icon && <div className="mb-2 text-muted-foreground">{icon}</div>}
        <h3 className="text-lg font-normal text-muted-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          {description}
        </p>
      </div>
    </div>
  );
}
