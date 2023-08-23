export const paginate = (req, res, next) => {
   const { results } = req.body;

   const page = parseInt(req.query.page || 1);
   const limit = parseInt(req.query.limit || 0);

   // zero limit means that all results get returned
   if (limit === 0) {
      return (
         res
            .status(200)
            .json({
               totalNumberOfResults: results.length,
               paginatedResults: results,
               totalNumberOfPages: 1
            })
      );
   };

   const numberOfJobs = results.length;

   let lastItemIndex = page * limit;
   let firstItemIndex = lastItemIndex - limit;
   let numberOfPages = Math.ceil(numberOfJobs / limit);

   // index out of bounds when it exceeds the number of items
   if (lastItemIndex >= numberOfJobs) lastItemIndex = results.length;

   // page is out of bounds, so return the last page.
   if (page > numberOfPages) {
      const previousPage = numberOfPages - 1;

      firstItemIndex = previousPage * limit;
      lastItemIndex = results.length;
   };

   // limit is larger than the total number of items, so return 1 page with all the items
   if (limit > numberOfJobs) {
      firstItemIndex = 0;
      lastItemIndex = results.length;
   };

   return (
      res
         .status(200)
         .json({
            totalNumberOfResults: numberOfJobs,
            paginatedResults: results.slice(firstItemIndex, lastItemIndex),
            totalNumberOfPages: numberOfPages,
         })
   );
};