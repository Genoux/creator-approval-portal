import { Squircle } from "@squircle-js/react";
import { ImageOffIcon, Users } from "lucide-react";
import Image from "next/image";
import { StatusDropdown } from "@/components/shared/StatusDropdown";
import { SocialMediaButtons } from "@/components/social/SocialMediaButtons";
import { TaskModal } from "@/components/tasks/TaskModal";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { extractCreator } from "@/services/CreatorService";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { title, thumbnail, followerCount, socials } = extractCreator(task);

  return (
    <TaskModal task={task}>
      <div className="cursor-pointer rounded-3xl">
        <Squircle
          cornerRadius={24}
          cornerSmoothing={1}
          className="transition-colors relative h-[500px] overflow-hidden will-change-transform"
        >
          {/* Background Image */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden ">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={`${title} profile`}
                width={800}
                height={800}
                placeholder="blur"
                priority
                blurDataURL={thumbnail}
                className="object-cover w-full h-full object-center"
                loading="eager"
              />
            ) : (
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                <ImageOffIcon className=" text-black/50" />
              </div>
            )}
          </div>
          <div
            className="absolute  backdrop-blur-md overflow-hidden w-full h-full bottom-0"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.02) 10%, rgba(0,0,0,0.08) 20%, rgba(0,0,0,0.18) 30%, rgba(0,0,0,0.32) 40%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.68) 60%, rgba(0,0,0,0.82) 70%, rgba(0,0,0,0.92) 80%, rgba(0,0,0,0.98) 90%, black 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.02) 10%, rgba(0,0,0,0.08) 20%, rgba(0,0,0,0.18) 30%, rgba(0,0,0,0.32) 40%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.68) 60%, rgba(0,0,0,0.82) 70%, rgba(0,0,0,0.92) 80%, rgba(0,0,0,0.98) 90%, black 100%)",
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.01) 10%, rgba(0,0,0,0.04) 20%, rgba(0,0,0,0.09) 30%, rgba(0,0,0,0.16) 40%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.36) 60%, rgba(0,0,0,0.49) 70%, rgba(0,0,0,0.64) 80%, rgba(0,0,0,0.81) 90%, rgba(0,0,0,0.9) 100%)",
            }}
          ></div>

          {/* Content Overlay */}
          <div className="absolute inset-2 flex flex-col justify-between p-3 text-white">
            <div></div>

            {/* Bottom Content */}
            <div className="flex flex-col">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg font-semibold flex items-center leading-none">
                  {title}
                </CardTitle>

                <CardDescription className="text-white/80 text-base">
                  {socials[0].handle}
                </CardDescription>
              </div>
              <div className="flex sm:flex-col lg:flex-row md:flex-col flex-wrap gap-2 justify-between lg:items-end items-start">
                <div className="flex items-center gap-3">
                  {followerCount && (
                    <div className="flex items-center gap-1.5 text-sm white/90">
                      <Users className="w-4 h-4" />
                      <span>{followerCount}</span>
                    </div>
                  )}
                  <SocialMediaButtons task={task} />
                </div>
                <StatusDropdown
                  task={task}
                  variant="light"
                  className="sm:w-full md:w-full lg:w-auto w-auto"
                />
              </div>
            </div>
          </div>
        </Squircle>
      </div>
    </TaskModal>
  );
}
