import mongoose, { Schema } from "mongoose";

const { model } = mongoose;

export interface IPlant {
  name: string;
  waterFrequency: number;
  lastWatered: Date;
  location: string;
}

export const PlantSchema = new Schema(
  {
    name: { type: String, required: true },
    waterFrequency: { type: Number, required: true },
    lastWatered: { type: Date, default: Date.now },
    location: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Plant = model<IPlant>("Blog", PlantSchema);
