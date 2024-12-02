import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  plan: 'free' | 'basic' | 'advanced' | 'ultimate' | 'enterprise';
  shopifyApiKey?: string;
  facebookAdsApiKey?: string;
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'advanced', 'ultimate', 'enterprise'],
    default: 'free',
  },
}, { timestamps: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
