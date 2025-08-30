import { serve } from "@upstash/workflow/nextjs";

export const { POST } = serve(
  async (context) => {
    console.log("=== Workflow Started ===");

    const step1Result = await context.run("initial-step", () => {
      console.log("initial-step executed");
      return { step: "initial", timestamp: Date.now() };
    });
    console.log("Step 1 result:", step1Result);

    const step2Result = await context.run("second-step", () => {
      console.log("second-step executed");
      return { step: "second", timestamp: Date.now() };
    });
    console.log("Step 2 result:", step2Result);

    console.log("=== Workflow Completed ===");
    return { success: true, steps: [step1Result, step2Result] };
  },
  {
    // 워크플로우 설정 추가
    retries: 3,
    failureFunction: async ({
      context,
      failStatus,
      failResponse,
      failHeaders,
    }) => {
      console.error("Workflow failed:", failStatus, failResponse, failHeaders);
    },
  }
);
