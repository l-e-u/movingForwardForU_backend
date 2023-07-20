class AccessError extends Error {
   constructor({ message, value, path = null }) {
      super();
      this.message = message;
      this.name = 'Access Denied';
      this.path = path;
      this.statusCode = 401;
      this.value = value;
   };
};

class AttachmentError extends Error {
   constructor({ message, statusCode }) {
      super();
      this.name = 'Could Not Upload Attachments';
      this.message = message;
      this.statusCode = statusCode;
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
      this.statusCode = 404;
      this.value = id;
   };
};

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

const mongoDBdocumentNotFound = (modelName) => {
   return ({ id }) => {
      return new MongoDBDocumentNotFoundError({
         id,
         modelName,
      });
   };
};

// document not found errors
export const archiveNotFound = mongoDBdocumentNotFound('Archive');
export const contactNotFound = mongoDBdocumentNotFound('Contact');
export const feeNotFound = mongoDBdocumentNotFound('Fee');
export const statusNotFound = mongoDBdocumentNotFound('Status');
export const userNotFound = mongoDBdocumentNotFound('User');
export const jobNotFound = mongoDBdocumentNotFound('Job');

export const emailUnverified = ({ value }) => new AccessError({
   value,
   message: 'Email has not been verified.',
   path: 'email'
});
export const invalidCredentials = () => new AccessError({
   value: null,
   message: 'Wrong password.',
   path: 'password'
});
export const jwtInvalid = (errorName) => new AccessError({ message: 'Invalid authentication.', value: errorName });
export const passwordsDoNotMatch = () => {
   return new InvalidValueError({
      message: 'Passwords do not match.',
      path: 'confirmPassword',
      value: null
   })
};
export const passwordNotStrong = () => {
   return new InvalidValueError({
      message: 'Password is not strong.',
      path: 'password',
      value: null
   })
};
export const valueRequired = ({ fieldName }) => {
   const field = fieldName.charAt(0).toUpperCase() + fieldName.substring(1).toLowerCase();
   return new InvalidValueError({
      message: `${field} is required.`,
      path: fieldName.toLowerCase(),
      value: null
   })
};
export const uploadAttachmentsLimitReached = () => new AttachmentError({ message: 'Too many files to upload', statusCode: 400 });
export const uploadAttachment = () => new AttachmentError({ message: 'Error when trying to upload file(s).', statusCode: 500 });
export const downloadAttachment = () => new AttachmentError({ message: 'Cannot download the attachment.', statusCode: 500 })

export const reformatMongooseError = (err) => {
   // mongoose model validation fails are stored in a object called 'errors', the specific path that threw the error is a self-named object within 'errors'
   // get the first key only to handle one error at a time
   let key = null;
   if (err.errors) key = Object.keys(err.errors)[0];

   const error = err.errors?.[key] || err;
   const { name, message, path, kind, value } = error;
   // console.log('THIS WAS CAUTH SUCCEFULLY:', error)
   console.log('name', name)
   console.log('message', message)
   console.log('path', path)
   console.log('kind', kind)
   console.log('value', value)

   if (kind === 'user defined') return new InvalidValueError({ path, message, value });


   if (kind === 'ObjectId') {
      return new InvalidValueError({
         value,
         path: 'ObjectID',
         message: 'ObjectID is invalid.'
      })
   };

   if (kind === 'required') return new InvalidValueError({ path, message, value });
   if (kind === 'regexp') return new InvalidValueError({ path, message, value });
   if (kind === 'unique') return new UniqueValueError({ path, value });

   if (name === 'CastError') return new InvalidValueError({ path, message, value });
};

export default {
   archiveNotFound,
   contactNotFound,
   feeNotFound,
   statusNotFound,
   userNotFound,
   jobNotFound,
   emailUnverified,
   invalidCredentials,
   jwtInvalid,
   passwordsDoNotMatch,
   passwordNotStrong,
   uploadAttachmentsLimitReached,
   uploadAttachment,
   downloadAttachment,
   valueRequired
};