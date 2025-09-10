import type { NextApiRequest, NextApiResponse } from "next";
import { getAllProjects } from "@/lib/mdx";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const projects = getAllProjects();
    res.status(200).json(projects);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res
      .status(500)
      .json({ error: "Failed to list projects", details: message });
  }
}
