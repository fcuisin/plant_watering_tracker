import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/mongodb";
import { Plant } from "../../models/plants";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await dbConnect();

    res.json("test");
  } catch (e) {
    console.error(e);
  }
};
