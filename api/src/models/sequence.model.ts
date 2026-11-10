import { Schema, model } from "mongoose"

export interface ISequence {
    key: string
    seq: number
    createdAt?: Date
    updatedAt?: Date
}

const sequenceSchema = new Schema<ISequence>(
    {
        key: { type: String, required: true, unique: true, index: true },
        seq: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
)

export const SequenceModel = model<ISequence>("sequence", sequenceSchema)

