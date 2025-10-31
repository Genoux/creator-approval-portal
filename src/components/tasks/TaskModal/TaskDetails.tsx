import { RenderDelta } from "quill-delta-to-react";
import { memo, useMemo, useRef } from "react";
import { ScrollGradient } from "@/components/shared/ScrollGradient";
import { PortfolioPreview } from "@/components/social/portfolioPreview";
import { SocialMediaButtons } from "@/components/social/SocialMediaButtons";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import { TaskSquircle } from "../TaskSquircle";

interface TaskDetailsProps {
  task: Task;
  className?: string;
}

function TaskDetailsComponent({ task, className }: TaskDetailsProps) {
  const { followerCount, socials, portfolio, er } = task;

  const ops = useMemo(() => {
    const delta = JSON.parse(portfolio.whyGoodFit || "{}");
    return Array.isArray(delta.ops) ? delta.ops : [];
  }, [portfolio.whyGoodFit]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const hasErData = Boolean(er.text ?? er.formula);
  const hasStatsData = hasErData || Boolean(followerCount);
  const hasPortfolioContent = Boolean(
    portfolio.example || portfolio.inBeatPortfolio
  );

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <TaskSquircle task={task} size="modal" />
      <div className="relative flex-1 min-h-0">
        <ScrollGradient scrollRef={scrollRef} />
        <ScrollGradient scrollRef={scrollRef} position="bottom" />
        <div
          ref={scrollRef}
          className="h-full pr-4 overflow-y-auto flex flex-col gap-4"
        >
          {portfolio.whyGoodFit && (
            <div className="flex flex-col gap-1 w-full">
              <span className="text-xs text-black/50">
                {"Why they're a good fit"}
              </span>
              <div className="text-sm text-black/80 [&_a]:text-[#2A0006] [&_a]:underline [&_a:hover]:text-[#2A0006]/90">
                <RenderDelta
                  ops={ops}
                  options={{
                    linkTarget: "_blank",
                  }}
                />
              </div>
            </div>
          )}

          {hasStatsData && (
            <div className="flex items-start gap-10 w-full">
              {hasErData && (
                <div className="flex flex-col justify-end items-start">
                  <span className="text-xs text-black/50">ER</span>
                  <p className="text-sm font-semibold">
                    {er.text ?? er.formula}
                  </p>
                </div>
              )}
              {followerCount && (
                <div className="flex flex-col justify-end items-start">
                  <span className="text-xs text-black/50">Followers</span>
                  <p className="text-sm font-semibold">{followerCount}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2 flex-1 min-h-0">
            <div className="flex items-end justify-between">
              <h3 className="text-base font-semibold">Socials</h3>
              {socials.length > 0 && (
                <SocialMediaButtons socials={socials} variant="dark" />
              )}
            </div>
            {hasPortfolioContent ? (
              <div className="flex flex-col gap-1">
                {portfolio.example && (
                  <PortfolioPreview
                    portfolio={portfolio}
                    type="example"
                    key={`example-${portfolio.example}`}
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
            ) : (
              <div className="flex-1 bg-[#F9F7F7] rounded-2xl flex flex-col gap-1 justify-center items-center">
                <p className="text-sm text-black/50">No content found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Memoize component to prevent unnecessary re-renders when task hasn't changed
export const TaskDetails = memo(TaskDetailsComponent);
