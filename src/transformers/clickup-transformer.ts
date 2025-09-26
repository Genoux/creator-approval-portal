import { formatNumberCompact } from "@automattic/number-formatters";
import type { Creator, Task } from "@/types";
import { getS3ImageUrl } from "@/utils/s3";
import { buildSocials } from "@/utils/social";

export class ClickUpTransformer {
  transform(task: Task): Creator {
    const fields = this.createFieldMap(task);
    const creator = {
      title: task.name,
      thumbnail: getS3ImageUrl(task.name),
      followerCount: fields.followercount
        ? formatNumberCompact(Number(fields.followercount))
        : null,
      er: {
        text: fields.er,
        formula: fields.erformula,
      },
      socials: buildSocials({
        instagram: fields.igprofile,
        tiktok: fields.ttprofile,
        youtube: fields.ytprofile,
        linkedin: fields.linkedin,
      }),
      portfolio: {
        example: fields.example,
        whyGoodFit: fields["whythey'reagoodfit"],
        inBeatPortfolio: fields.inBeatPortfolio,
      },
    };
    return creator;
  }

  private createFieldMap(task: Task): Record<string, string | null> {
    const map: Record<string, string | null> = {};

    task.custom_fields?.forEach(field => {
      if (field.name && field.value) {
        const key = field.name.toLowerCase().replace(/\s+/g, "");

        if (field.type === "attachment" && Array.isArray(field.value)) {
          const attachment = field.value[0];
          map[key] =
            attachment?.thumbnail_large?.trim().replace(/\s+/g, "") || null;
        } else {
          // Use value_richtext if available, fallback to value
          map[key] = field.value_richtext || String(field.value);
        }
      }
    });

    return map;
  }
}
