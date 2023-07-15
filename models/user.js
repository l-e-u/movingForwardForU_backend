import { Schema, model as Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';
import validator from 'validator';

const userSchema = new Schema({

   password: String,
   avatar: String,
   address: String,
   firstName: {
      type: String,
      trim: true,
      required: true,
   },
   comments: {
      type: String,
      trim: true,
      set: i => !i ? null : i
   },
   email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      match: [/\S+@\S+\.\S+/, 'is invalid'],
   },
   //Our password is hashed with bcrypt
   isActive: {
      type: Boolean,
      default: true
   },
   isAdmin: {
      type: Boolean,
      default: false
   },
   isVerified: {
      type: Boolean,
      default: false
   },
   lastName: {
      type: String,
      trim: true,
      required: true
   },
}, {
   timestamps: true,
   toJSON: {
      transform: function (doc, json) {
         delete json.password
      }
   }
}
);

userSchema.plugin(uniqueValidator, { message: 'Is already in use.' });

// changes a user's password
userSchema.statics.changePassword = async function ({ _id, password, confirmPassword }) {
   const errMsg1 = 'Passwords do not match.';
   const errMsg2 = 'Password is not strong enough.';
   const message = { message: errMsg1 };

   if (password !== confirmPassword) {
      throw {
         errors: {
            password: message,
            confirmPassword: message
         }
      };
   };

   if (!validator.isStrongPassword(password)) {
      throw {
         errors: {
            password: { message: errMsg2 }
         }
      };
   };

   const salt = await bcrypt.genSalt(10);
   const hash = await bcrypt.hash(password, salt);

   const user = await this.findByIdAndUpdate(
      { _id },
      { password: hash }
   );

   return user;
};

// search for the user since model returns a json without password for security reasons
userSchema.statics.authenticate = async function (email, password) {
   const user = await this.findOne({ email });
   const match = await bcrypt.compare(password, user.password);
   if (!match) return false;
   return true;
};

const User = Model('User', userSchema);

// updates user document password
User.prototype.setEncryptedPassword = async function (newPassword) {
   if (!validator.isStrongPassword(newPassword)) {
      console.log("passed test", newPassword)
      return { error: true, passwordNotStrong: true };
   };

   const salt = await bcrypt.genSalt(10);
   const hash = await bcrypt.hash(newPassword, salt);

   this.password = hash;

   return { error: false };
};

export default User;