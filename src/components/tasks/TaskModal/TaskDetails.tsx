import Link from "next/link";
import { RenderDelta } from "quill-delta-to-react";
import { PortfolioPreview } from "@/components/social/portfolioPreview";
import { SocialMediaButtons } from "@/components/social/SocialMediaButtons";
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
    <div className={cn("flex flex-col gap-4", className)}>
      <TaskSquircle
        task={task}
        data={false}
        title={title}
        thumbnail={thumbnail}
        socials={socials}
      />
      <section className="flex flex-col flex-1 gap-6">
        {/* Task Details */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1 ">
            <h1 className="text-lg font-semibold flex items-center leading-none">
              {title}
            </h1>
            <Link
              href={socials[0].url || ""}
              className="text-xs text-black/50 hover:underline w-fit"
              target="_blank"
            >
              {socials[0].handle}
            </Link>
          </div>
          <div className="flex gap-4">
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

        {/* Why Good Fit */}
        {portfolio.whyGoodFit && (
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs text-black/50">
                {"Why they're a good fit"}
              </span>
            </div>
            <div className="text-sm text-black/80 leading-relaxed [&_a]:text-[#2A0006] [&_a]:underline [&_a:hover]:text-[#2A0006]/90">
              <RenderDelta
                ops={ops}
                options={{
                  linkTarget: "_blank",
                }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col rounded-xl overflow-hidden flex-1 gap-2">
          <div className="flex items-center justify-between pr-1">
            <h3 className="text-base font-semibold">Content</h3>
            {socials.length > 0 && (
              <SocialMediaButtons socials={socials} variant="dark" />
            )}
          </div>
          <div className="flex flex-col gap-1 overflow-auto">
            {portfolio.example && (
              <div className="flex flex-col gap-3">
                <div className="w-full">
                  <PortfolioPreview portfolio={portfolio} type="example" />
                </div>
              </div>
            )}
            {portfolio.inBeatPortfolio && (
              <div className="flex flex-col gap-3">
                <div className="w-full">
                  <PortfolioPreview
                    portfolio={portfolio}
                    type="inbeat"
                    title="InBeat Portfolio"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
