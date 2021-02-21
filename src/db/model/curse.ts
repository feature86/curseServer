import {
  model,
  Schema,
  SchemaDefinition,
  SchemaTypes,
  Document,
} from 'mongoose';

export interface ICurse extends Document {
  person: string;
  date: Date;
}

const schema: SchemaDefinition = {
  person: { type: SchemaTypes.String, required: true },
  date: { type: SchemaTypes.Date, required: true },
};

const curseSchema = new Schema(schema);

export default model<ICurse>('Curse', curseSchema);
