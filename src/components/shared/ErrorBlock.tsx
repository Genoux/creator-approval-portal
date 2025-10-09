import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorBlockProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export function ErrorBlock({
  title = "No items found",
  description = "There are no items to display at this time.",
  icon,
  className,
  action,
  actionText,
  onAction,
}: ErrorBlockProps) {
  return (
    <div
      className={cn(
        "bg-[#F9F7F7] h-[calc(100vh-300px)] w-full shadow-none flex items-center justify-center rounded-3xl",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center py-12 px-6">
        {icon && <div className="mb-1 text-muted-foreground">{icon}</div>}
        <h3 className="text-md font-normal text-muted-foreground">{title}</h3>
        <p className="text-sm text-black/50 text-center max-w-sm">
          {description}
        </p>
        {(action || (actionText && onAction)) && (
          <div className="mt-4">
            {action || (
              <Button
                onClick={onAction}
                className="cursor-pointer rounded-full bg-[#2A0006] text-white hover:bg-[#2A0006]/90"
              >
                {actionText}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
