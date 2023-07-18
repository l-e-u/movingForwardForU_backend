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

export const contactNotFound = mongoDBdocumentNotFound('Contact');
export const feeNotFound = mongoDBdocumentNotFound('Fee');
export const statusNotFound = mongoDBdocumentNotFound('Status');

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
   contactNotFound,
   feeNotFound,
   statusNotFound
}