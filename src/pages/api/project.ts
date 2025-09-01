import type { NextApiRequest, NextApiResponse } from "next";
import { getSerializedProject } from "@/lib/mdx";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;
  if (!slug || typeof slug !== "string") {
    res.status(400).json({ error: "Missing slug" });
    return;
  }
  try {
    const data = await getSerializedProject(slug);
    res.status(200).json(data);
  } catch (err: any) {
    res.status(404).json({ error: "Not found", details: err?.message });
  }
}
