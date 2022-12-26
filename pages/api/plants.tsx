import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/mongodb";
import { Plant } from "../../models/plants";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await dbConnect();

    const plants = await Plant.find({});

    const newPlant = new Plant(req.body);
    plants.push(newPlant);

    await newPlant.save();

    res.json(plants);
  } catch (e) {
    console.error(e);
  }
};
