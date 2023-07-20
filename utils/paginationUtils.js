// takes an array, the current page, and the limit of how many elements to return at a time
export const paginate =({array,currentPage,limit}) => {
  const startIndex = (currentPage - 1) * limit;
   const endIndex = page * limit;
   const totalPages = 0;
   
   const count = array.length;
   totalPages = Math.floor(count / limit);
   
   
   if (count > limit){
     totalPages += (count % limit) === 0 ? 0 : 1;
   };
   
   // set boundaries for safety
   if (!limit || limit === 0 || limit > count || startIndex > count) {
     startIndex = 0;
     endIndex = jobs.length;
     totalPages = 1;
   };
   
   return {
     count,
     results:array.splice(startIndex,endIndex),
     totalPages
   };
};