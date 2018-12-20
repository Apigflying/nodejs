import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const aSchema = Schema({
  _id:Number,
  name:String
})

const aa = mongoose.model('A', aSchema);
export default aa;

