import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  userId: string;
  password: string;
  role: 'admin' | 'user';     // Role can ONLY be 'admin' or 'user'
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// The Schema is like a table definition — what fields exist and their types
const UserSchema = new Schema<IUser>(
  {
    userId: {
      type: String,
      required: true,     // This field is mandatory
      unique: true,       // No two users can have the same userId
      trim: true,         // Removes extra spaces
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],   // Only these two values allowed
      default: 'user',           // If not specified, default to 'user'
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,   // Automatically converts to lowercase
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
  }
);

// This runs BEFORE a user is saved to the database
// It hashes the password so we never store the plain text
UserSchema.pre('save', async function () {
  // Only hash if password was actually changed (new user or password update)
  if (!this.isModified('password')) return;

  // bcrypt.hash turns plain text into a secure hash
  // 10 = salt rounds (higher = more secure but slower)
  this.password = await bcrypt.hash(this.password, 10);
});
// A method we can call on any user to check their password at login
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);