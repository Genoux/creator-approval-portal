// import { useMemo } from "react";
// import type { Social, Task } from "@/types";
// import { buildSocials } from "@/utils";

// /**
//  * Hook to extract and format social profiles from a ClickUp task
//  */
// export function useSocials(task: Task): Social[] {
//   return useMemo(() => {
//     // Create field map for easy access
//     const fieldMap: Record<string, string> = {};

//     task.custom_fields?.forEach(field => {
//       if (field.name && field.value) {
//         const key = field.name.toLowerCase().replace(/\s+/g, "");
//         fieldMap[key] = String(field.value);
//       }
//     });

//     // Extract social URLs
//     return buildSocials({
//       instagram: fieldMap.igprofile || null,
//       tiktok: fieldMap.ttprofile || null,
//       youtube: fieldMap.ytprofile || null,
//       linkedin: fieldMap.linkedin || null,
//     });
//   }, [task.custom_fields]);
// }
