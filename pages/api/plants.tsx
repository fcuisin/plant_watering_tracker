import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../lib/mongodb";
import { Plant } from "../../models/plants";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      try {
        await dbConnect();

        const plants = await Plant.find({});

        res.json(plants);
      } catch (e) {
        console.error(e);
      }
      break;
    case "POST":
      try {
        await dbConnect();

        const plantsList = await Plant.find({});
        const newPlant = new Plant(req.body);
        plantsList.push(newPlant);
        await newPlant.save();

        res.json({ updatedPlantsList: plantsList, plant: newPlant });
      } catch (e) {
        console.error(e);
      }
      break;
    case "PUT":
      try {
        await dbConnect();

        const plant = await Plant.findById(req.body._id);
        Object.assign(plant, req.body);
        await plant.save();

        const plantsList = await Plant.find({});
        res.json({ updatedPlantsList: plantsList, plant });
      } catch (e) {
        console.error(e);
      }
      break;
    case "DELETE":
      try {
        await dbConnect();

        const plant = await Plant.findById(req.body._id);
        await plant.deleteOne({ _id: req.body._id });

        const plantsList = await Plant.find({});
        res.json(plantsList);
      } catch (e) {
        console.error(e);
      }
      break;
    default:
      break;
  }
};
