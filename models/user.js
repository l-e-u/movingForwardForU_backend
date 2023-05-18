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
        required: [true, 'Cannot be empty.']
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
        required: [true, 'Cannot be empty.'],
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
        required: [true, 'Cannot be empty.']
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

// logs in a verified user
userSchema.statics.login = async function (email, password) {
    const errInputMsg = 'Cannot be empty.'
    const errMsg = 'Incorrect credentials.';
    const errors = {}

    if (!email) {
        errors.email = { message: errInputMsg };
    };

    if (!password) {
        errors.password = { message: errInputMsg };
    };

    // all fields are required, send error if any missing
    if (Object.keys(errors).length > 0) throw { errors };

    // getting either field wrong sends the same error to both fields to avoid alerting the user if an email exists on the database
    errors.email = { message: errMsg };
    errors.password = { message: errMsg };

    const user = await this.findOne({ email });

    if (!user) throw { errors };

    // throw error if the user has not verified the email
    if (!user.isVerified) {
        errors.email.message = 'Not verified.';
        throw { errors };
    };

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw { errors };

    return user;
};

const User = Model('User', userSchema);

export default User;