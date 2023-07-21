export const paginate = (req, res, next) => {
   const { list } = req.body;
   const page = parseInt(req.query.page || 0);
   const limit = parseInt(req.query.limit || 0);

   const numberOfItems = list.length - 1;

   let lastItemIndex = page * limit;
   let firstItemIndex = lastItemIndex - limit;
   let numberOfPages = Math.ceil(numberOfItems / limit);

   // index out of bounds when it exceeds the number of items
   if (lastItemIndex > numberOfItems) lastItemIndex = list.length;

   // page is out of bounds, so return the last page.
   if (page > numberOfPages) {
      const previousPage = numberOfPages - 1;
      firstItemIndex = previousPage * limit;
      lastItemIndex = list.length;
   };

   // limit is larger than the total number of items, so return 1 page with all the items
   if (limit > numberOfItems) {
      firstItemIndex = 0;
      lastItemIndex = list.length;
   };

   return (
      res
         .status(200)
         .json({
            count: numberOfItems,
            results: list.slice(firstItemIndex, lastItemIndex),
            totalPages: numberOfPages
         })
   );
};