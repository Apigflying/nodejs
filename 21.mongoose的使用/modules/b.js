import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const bSchema = Schema({
  creator: { type: Number, ref: 'A' },
  name: String,
  fans: [{ type: Number, ref: 'A' }]
})

const bb = mongoose.model('B', bSchema);
export default bb;