// handles errors by setting name, message, and status code

class UserInputError extends Error {
   constructor(propertyName, displayName, useDisplayName = false) {
      super();
      let property;
      let field;

      // sometimes the property name of a model is camelCased, if so, don't format the property name and use the display name
      if (useDisplayName) {
         property = propertyName;
         field = displayName;
         this[propertyName] = true;
      }
      else {
         property = propertyName.toLowerCase();
         field = property.charAt(0).toUpperCase() + property.substring(1);
         this[property] = true;
      };

      this.field = field;
      this.statusCode = 400;

      if (this instanceof EmptyStringError) {
         this.name = 'Empty String';
         this.message = `${this.field} cannot be empty.`;
      };

      if (this instanceof NoSelectionError) {
         this.name = 'No Selection';
         this.message = `Select a ${this.field}.`;
      };

      if (this instanceof NaNError) {
         this.name = 'NaN';
         this.message = `${this.field} is not a number.`;
      };
   }
};

export class NaNError extends UserInputError { };
export class EmptyStringError extends UserInputError { };
export class NoSelectionError extends UserInputError { };

class LoginError extends Error {
   constructor() {
      super();
      this.login = true;
      this.statusCode = 401;

      if (this instanceof EmailVerificationError) {
         this.email = true;
         this.name = 'Email Not Verified';
         this.message = 'Your email has not been verified.'
      };

      if (this instanceof WrongPasswordError) {
         this.password = true;
         this.name = 'Wrong Password';
         this.message = 'Password is incorrect.';
      };
   }
};

export class WrongPasswordError extends LoginError { };
export class EmailVerificationError extends LoginError { };

class NewPasswordError extends Error {
   constructor() {
      super();
      this.password = true;
      this.confirmPassword = true;
      this.statusCode = 401;

      if (this instanceof PasswordsDoNotMatch) {
         this.name = 'Passwords Do Not Match';
         this.message = 'Passwords do not match.';
      };

      if (this instanceof PasswordNotStrongError) {
         this.name = 'Password Not Strong';
         this.message = 'Password is not strong.';
      };
   }
};

export class PasswordsDoNotMatch extends NewPasswordError { };
export class PasswordNotStrongError extends NewPasswordError { };

class JSONWebTokenError extends Error {
   constructor() {
      super();
      this.token = true;

      if (this instanceof TokenExpiredError) {
         this.name = 'Login Expired';
         this.message = 'You have been auto-logged out, please log back in.';
         this.statusCode = 401;
      };

      if (this instanceof MalformedTokenError) {
         this.name = 'Invalid Token';
         this.message = 'Please log back in.';
         this.statusCode = 400;
      };
   }
};

export class TokenExpiredError extends JSONWebTokenError { };
export class MalformedTokenError extends JSONWebTokenError { };

export class DocumentNotFoundError extends Error {
   constructor(modelName) {
      super();
      this.model = modelName.charAt(0).toUpperCase() + modelName.substring(1).toLowerCase();
      this.statusCode = 404;
      this.name = `${this.model} Not Found`;
      this.message = `${this.model} does not exist.`;
   }
};

export class InvalidMongoDBObjectID extends Error {
   constructor() {
      super();
      this.statusCode = 404;
      this.name = 'Invalid MongoDB ObjectID';
      this.message = 'Document not found due to invalid ObjectID';
   }
};

// export class InvalidValueError extends Error {
//    constructor({ message, property }) {
//       super();
//       this.statusCode = 404;
//       this.name = 'Invalid Value';
//       this.property = property;
//       this.message = message;
//    }
// };

class UniqueValueError extends Error {
   constructor({ path, value }) {
      super();
      this.statusCode = 409;
      this.path = path;
      this.name = `MongoDB Unique Valdation Failed`;
      this.message = `${path.charAt(0).toUpperCase() + path.substring(1)} is already in use.`;
      this.value = value;
   };
};

class InvalidValueError extends Error {
   constructor({ path, message, value }) {
      super();
      this.message = message;
      this.name = 'Invalid Value'
      this.path = path;
      this.statusCode = 400;
      this.value = value;
   };
};

class MongoDBDocumentNotFoundError extends Error {
   constructor({ id, modelName }) {
      super();
      this.message = `${modelName} was not found.`;
      this.name = 'Document Not Found';
      this.value = id;
   };
};

const mongoDBdocumentNotFound = (modelName) => {
   return ({ id }) => {
      throw new MongoDBDocumentNotFoundError({
         id,
         modelName,
      });
   };
};

export const emptyString = ({ path, value }) => {
   throw new InvalidValueError({
      path,
      value,
      message: `${path} cannot be empty.`
   });
};

export const feeNotFound = mongoDBdocumentNotFound('Fee');

export const isNaN = ({ path, value }) => {
   throw new InvalidValueError({
      path,
      value,
      message: `${path} must be a number.`
   });
};

export const objectIDisInvalid = ({ value }) => {
   throw new InvalidValueError({
      value,
      path: 'Mongoose ObjectID',
      message: 'ObjectID is invalid.'
   });
};

export const uniqueValueError = ({ errors }) => {
   // const { errors } = mongoDBError;
   const key = Object.keys(errors)[0];
   const { path, value } = errors[key];

   console.log('in handler:', errors)
   console.log(path, value)

   throw new UniqueValueError({ path, value });
}

export default {
   emptyString,
   feeNotFound,
   isNaN,
   objectIDisInvalid,
   uniqueValueError
};