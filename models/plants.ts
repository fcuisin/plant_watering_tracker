import mongoose, { Schema } from "mongoose";

const { model, models } = mongoose;

export interface IPlant {
  name: string;
  waterFrequency: number;
  lastWatered?: Date;
}

export const PlantSchema = new Schema<IPlant>(
  {
    name: { type: String, required: true },
    waterFrequency: { type: Number, required: true },
    lastWatered: Date,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Plant =
  (models.Plants as mongoose.Model<IPlant>) ||
  model<IPlant>("Plants", PlantSchema);
