export const errorHandler = (err, req, res, next) => {
   console.log('PATH:', req.path);
   console.error('ERROR -->>', err);

   return res.status(err.statusCode).json({ error: err });
};