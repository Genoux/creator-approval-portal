import Link from "next/link";
import { SocialMediaButtons } from "@/components/social/SocialMediaButtons";
import { SocialPreview } from "@/components/social/SocialPreview";
import { cn } from "@/lib/utils";
import { extractCreator } from "@/services/CreatorService";
import type { Task } from "@/types";
import { RichText } from "@/utils/text";
import { TaskSquircle } from "../TaskSquircle";

interface TaskDetailsProps {
  task: Task;
  className?: string;
}

export function TaskDetails({ task, className }: TaskDetailsProps) {
  const { followerCount, socials, portfolio, er } = extractCreator(task);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <TaskSquircle task={task} data={false} />
      <section className="flex flex-col flex-1 gap-6">
        {/* Task Details */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1 ">
            <h1 className="text-lg font-semibold flex items-center leading-none">
              {task.name}
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
            <RichText
              deltaText={portfolio.whyGoodFit}
              className="text-sm text-black/80 leading-0 pr-16"
            />
          </div>
        )}

        <div className="flex flex-col rounded-xl overflow-hidden flex-1 gap-2">
          <div className="flex items-center justify-between pr-1">
            <h3 className="text-base font-semibold">Content</h3>
            {socials.length > 0 && (
              <SocialMediaButtons variant="dark" task={task} />
            )}
          </div>
          <div className="flex flex-col gap-1 overflow-auto">
            {portfolio.example && (
              <div className="flex flex-col gap-3">
                <div className="w-full">
                  <SocialPreview task={task} type="example" />
                </div>
              </div>
            )}
            {portfolio.inBeatPortfolio && (
              <div className="flex flex-col gap-3">
                <div className="w-full">
                  <SocialPreview
                    task={task}
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
