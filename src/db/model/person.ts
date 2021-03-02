import {
  model,
  Schema,
  SchemaDefinition,
  SchemaTypes,
  Document,
} from 'mongoose';

export interface IPerson extends Document {
  name: string;
  image: string;
  userHash: string;
}

const schema: SchemaDefinition = {
  name: { type: SchemaTypes.String, required: true },
  image: { type: SchemaTypes.String, required: true },
  userHash: { type: SchemaTypes.String, required: true },
};

const personSchema = new Schema(schema);

export default model<IPerson>('Person', personSchema);
