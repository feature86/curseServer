import mongoose from 'mongoose';

export interface CurseEntry extends mongoose.Document {
  person: string;
  date: Date;
}

const schema: mongoose.SchemaDefinition = {
  person: { type: mongoose.SchemaTypes.String, required: true },
  date: { type: mongoose.SchemaTypes.Date, required: true },
};

const collectionName = 'curse';
const curseSchema = new mongoose.Schema(schema);

export default mongoose.model<CurseEntry>('Curse', curseSchema);
