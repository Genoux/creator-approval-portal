import { formatNumberCompact } from "@automattic/number-formatters";
import type { ApprovalLabel, ClickUpTask, Task } from "@/types";
import { buildSocials, getS3ImageUrl } from "@/utils";

export class ClickUpTransformer {
  transform(clickUpTask: ClickUpTask): Task {
    const fields = this.createFieldMap(clickUpTask);
    const approvalField = clickUpTask.custom_fields?.find(f =>
      f.name?.toLowerCase().includes("client approval")
    );

    if (!approvalField) {
      console.warn(
        `⚠️  Task "${clickUpTask.name}" (${clickUpTask.id}) is missing "Client Approval" field`
      );
    }
    const task = {
      id: clickUpTask.id,
      date_created: clickUpTask.date_created,
      title: clickUpTask.name,
      thumbnail: getS3ImageUrl(clickUpTask.name),
      followerCount: fields.followercount
        ? formatNumberCompact(Number(fields.followercount))
        : null,
      status: {
        label: this.getApprovalLabel(approvalField),
        fieldId: approvalField?.id || "",
      },
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
        inBeatPortfolio: fields.inbeatportfolio,
      },
    };
    return task;
  }

  private getApprovalLabel(field: any): ApprovalLabel {
    if (!field?.value) {
      return "For Review";
    }

    const options = field.type_config?.options;
    if (!options) {
      return "For Review";
    }

    const index =
      typeof field.value === "number"
        ? field.value
        : parseInt(String(field.value), 10);

    if (!Number.isNaN(index) && options[index]?.name) {
      return options[index].name as ApprovalLabel;
    }

    return "For Review";
  }

  private createFieldMap(
    clickUpTask: ClickUpTask
  ): Record<string, string | null> {
    const map: Record<string, string | null> = {};

    clickUpTask.custom_fields?.forEach(field => {
      if (field.name && field.value) {
        const key = field.name.toLowerCase().replace(/\s+/g, "");
        map[key] = field.value_richtext || String(field.value);
      }
    });

    return map;
  }
}
