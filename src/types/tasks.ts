export type TaskType = "creator" | "project" | "generic";

export interface BaseTask {
  id: string;
  name: string;

  status: {
    status: string;
    color?: string;
  };
  description?: string;
  date_created: string;
  assignees?: Array<{
    id: number;
    username: string;
    email: string;
    profilePicture?: string;
  }>;
  custom_fields?: Array<{
    id: string;
    name: string;
    type: string;
    value: string | number | boolean | null;
    type_config?: {
      options?: Array<{
        id: string;
        name?: string;
        label?: string;
        color?: string;
      }>;
    };
  }>;
}

export interface CreatorTask extends BaseTask {
  type: "creator";
  socialHandle?: string;
  followerCount?: number;
  rate?: number;
  platform?: string;
}

export interface GenericTask extends BaseTask {
  type: "generic";
}

export type Task = CreatorTask | GenericTask;
