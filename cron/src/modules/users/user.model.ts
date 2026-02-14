import mongoose, { model, Types } from 'mongoose';
import {
  IAuthProvider,
  IsActive,
  IUser,
  Role,
} from './user.interface';
import { Schema } from 'mongoose';

// USER DAILY ACTIVITY SCHEMA
// const dailyActivitySchema = new Schema<IUserActivity>(
//   {
//     user: { type: Schema.Types.ObjectId, ref: 'user' },
//     date: { type: Date, required: true },
//   },
//   {
//     versionKey: false,
//     timestamps: true,
//   }
// );

// dailyActivitySchema.index({ user: 1, date: 1 }, { unique: true });

// export const UserActivity = model<IUserActivity>(
//   'user_activity',
//   dailyActivitySchema
// );

// ============USER MAIN SCHEMA=============
const authProviderSchema = new mongoose.Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    _id: false,
    versionKey: false,
  }
);

const userSchema = new mongoose.Schema<IUser>(
  {
    fullName: { type: String },
    bio: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true },
    avatar: { type: String },
    password: { type: String, select: false },
    fcmToken: { type: String },
    verifiedBadge: { type: Schema.Types.ObjectId, ref: 'VerifiedBadgePrice' },
    verifiedBadgeExpiration: { type: Date },
    isVerified: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: [...Object.values(IsActive)],
      default: IsActive.ACTIVE,
    },
    isDeleted: { type: Boolean, default: false },
    role: { type: String, enum: [...Object.values(Role)], default: Role.USER },
    auths: [authProviderSchema],
    location: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);


// Indexing through search field
userSchema.index({
  fullName: 'text',
});

const User = mongoose.model<IUser>('user', userSchema);

export default User;