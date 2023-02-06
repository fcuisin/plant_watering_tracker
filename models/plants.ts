import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";

const { model, models } = mongoose;

export interface IPlant {
  _id: ObjectId;
  name: string;
  description?: string;
  waterFrequency: number;
  lastWatered: Date;
  waterQuantity?: number;
  location?: string;
}

export const PlantSchema = new Schema<IPlant>(
  {
    name: { type: String, required: true },
    description: String,
    waterFrequency: { type: Number, required: true },
    lastWatered: { type: Date, default: Date.now },
    waterQuantity: { type: Number, min: 1 },
    location: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Plant =
  (models.Plants as mongoose.Model<IPlant>) ||
  model<IPlant>("Plants", PlantSchema);
