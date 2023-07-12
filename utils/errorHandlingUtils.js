// handles errors by setting name, message, and status code

class UserInputError extends Error {
   constructor(propertyName) {
      super();

      let property = propertyName.toLowerCase();
      this[property] = true;
      this.field = property.charAt(0).toUpperCase() + property.substring(1);
      this.statusCode = 400;

      if (this instanceof EmptyStringError) {
         this.name = 'Empty String';
         this.message = `${this.field} cannot be empty.`;
      };

      if (this instanceof NoSelectionError) {
         this.name = 'No Selection';
         this.message = `Select a ${this.field}.`;
      };
   }
};

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

export class DocumentNotFoundError extends Error {
   constructor(modelName) {
      super();
      this.model = modelName.charAt(0).toUpperCase() + modelName.substring(1).toLowerCase();
      this.statusCode = 404;
      this.name = `${this.model} Not Found`;
      this.message = `${this.model} does not exist.`;
   }
};

export class WrongPasswordError extends LoginError { }
export class EmailVerificationError extends LoginError { };

class JSONWebTokenError extends Error {
   constructor() {
      super();

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