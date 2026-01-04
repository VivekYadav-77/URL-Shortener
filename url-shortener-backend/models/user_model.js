import mongoose from 'mongoose'
import argon2 from 'argon2'
const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
  type: String,
  enum: ["user", "admin"],
  default: "user"
},
}, { timestamps: true });
userSchema.pre('save',async function(next){
  if(!this.isModified("password")){
    return next()
  }
  try {
    this.password = await argon2.hash(this.password)
  } catch (error) {
    next(err);
  }
})
userSchema.methods.comparePassword = function(candidatePassword){
  return argon2.verify(this.password, candidatePassword);
}
const UserCollection = mongoose.model('User',userSchema)
export default UserCollection