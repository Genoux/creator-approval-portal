import { RenderDelta } from "quill-delta-to-react";
import { PortfolioPreview } from "@/components/social/portfolioPreview";
import { SocialMediaButtons } from "@/components/social/SocialMediaButtons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import { TaskSquircle } from "../TaskSquircle";

interface TaskDetailsProps {
  task: Task;
  className?: string;
}

export function TaskDetails({ task, className }: TaskDetailsProps) {
  const { title, thumbnail, followerCount, socials, portfolio, er } = task;
  const delta = JSON.parse(portfolio.whyGoodFit || "{}");
  const ops = Array.isArray(delta.ops) ? delta.ops : [];

  return (
    <div className={cn("flex flex-col gap-4 min-h-0", className)}>
      <TaskSquircle
        task={task}
        size="modal"
        title={title}
        thumbnail={thumbnail}
        socials={socials}
      />
      {/* TODO: Is why a good fit MANDATORY? */}
      <section className="flex flex-col flex-1 gap-4 min-h-0">
        {/* Task Details */}
        <div className="grid grid-cols-2 gap-4">
          {/* Why Good Fit */}
          {portfolio.whyGoodFit && (
            <div className="flex flex-col gap-1 w-full">
              <span className="text-xs text-black/50">
                {"Why they're a good fit"}
              </span>
              <div className="text-xs leading-4 text-black/80 [&_a]:text-[#2A0006] [&_a]:underline [&_a:hover]:text-[#2A0006]/90">
                <RenderDelta
                  ops={ops}
                  options={{
                    linkTarget: "_blank",
                  }}
                />
              </div>
            </div>
          )}
          <div
            className={cn(
              "flex items-start gap-10 w-full",
              portfolio.whyGoodFit ? "justify-end" : "justify-start"
            )}
          >
            {(er.text ?? er.formula) && (
              <div className="flex flex-col justify-end items-start">
                <span className="text-xs text-black/50">ER</span>
                <p className="text-sm font-semibold">{er.text ?? er.formula}</p>
              </div>
            )}
            {followerCount && (
              <div className="flex flex-col justify-end items-start">
                <span className="text-xs text-black/50">Followers</span>
                <p className="text-sm font-semibold">{followerCount}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-h-0">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Content</h3>
            {socials.length > 0 && (
              <SocialMediaButtons socials={socials} variant="dark" />
            )}
          </div>
          <ScrollArea className="flex-1 min-h-0 relative bg-[#F9F7F7] rounded-2xl">
            <div className="flex flex-col gap-1 p-2">
              {portfolio.example && (
                <PortfolioPreview
                  portfolio={portfolio}
                  type="example"
                  key={Math.random()}
                />
              )}
              {portfolio.inBeatPortfolio && (
                <PortfolioPreview
                  portfolio={portfolio}
                  type="inbeat"
                  title="InBeat Portfolio"
                />
              )}
            </div>
          </ScrollArea>
        </div>
      </section>
    </div>
  );
}
