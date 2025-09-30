import { Squircle } from "@squircle-js/react";
import { ImageOffIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Social, Task } from "@/types";
import { StatusDropdown } from "../shared/StatusDropdown";
import { CardDescription, CardTitle } from "../ui/card";

interface TaskSquircleProps {
  task: Task;
  data?: boolean;
  title: string;
  thumbnail: string | null;
  socials: Social[];
}

export function TaskSquircle({ task, data = true, title, thumbnail, socials }: TaskSquircleProps) {

  return (
    <div>
      <Squircle
        cornerRadius={24}
        cornerSmoothing={1}
        className="transition-colors w-full h-[350px] overflow-hidden will-change-transform flex-shrink-0"
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
        <div className="absolute bottom-0 left-0 right-0 h-[150px] pointer-events-none bg-gradient-to-b from-transparent via-black/70 to-black"></div>

        {/* Content Overlay */}
        <div className="absolute inset-2 flex self-end flex-wrap justify-between gap-2 p-3 text-white items-end">
          {data && (
            <div className="flex flex-col">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg font-semibold flex items-center leading-none">
                  {title}
                </CardTitle>

                <CardDescription className="text-white/80 text-base">
                  {socials[0].handle}
                </CardDescription>
              </div>
            </div>
          )}
          <StatusDropdown
            task={task}
            variant="light"
            className={cn(
              "sm:w-full md:w-full w-auto",
              data ? "lg:w-auto" : "w-full"
            )}
          />
        </div>
      </Squircle>
    </div>
  );
}
