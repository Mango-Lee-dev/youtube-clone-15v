import { Client } from "@upstash/workflow";

export const workflow = new Client({
  token: process.env.QSTASH_TOKEN!,
});

// await workflow.trigger({
//   url: "https://beetle-direct-ram.ngrok-free.app/api/videos/workflows/title",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
