import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";

const { model, models } = mongoose;

export interface IPlant {
  _id: ObjectId;
  name: string;
  waterFrequency: number;
  waterQuantity?: number;
  lastWatered?: Date;
  location?: string;
}

export const PlantSchema = new Schema<IPlant>(
  {
    name: { type: String, required: true },
    waterFrequency: { type: Number, required: true },
    waterQuantity: Number,
    lastWatered: Date,
    location: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Plant =
  (models.Plants as mongoose.Model<IPlant>) ||
  model<IPlant>("Plants", PlantSchema);
