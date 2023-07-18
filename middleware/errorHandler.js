export const errorHandler = (err, req, res, next) => {
   let { statusCode } = err;

   const errorDetails = `
   <<-- ERROR -->>
   Endpoint: ${req.method} ${req.path}
   Name: ${err.name}
   Message: ${err.message}
   Value: ${err.value}
   `;

   console.info(errorDetails)
   console.error(err)

   // this is for unhandled exceptions, check console for details
   if (!statusCode) {
      statusCode = 500;
      err.message = 'An unknown error has occured.'
   };

   return res.status(statusCode).json({ error: err });
};