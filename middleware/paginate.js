export const paginate = (req,res,next)=>{
     const { page, limit } = req.query;
     const {list} = req.body;
     const numberOfItems = list.length - 1;
      let lastItemIndex = page * limit;
     const firstItemIndex = lastItemIndex - limit;
     
     let totalNumberOfPages = numberOfItems / limit;
     
     if(!Number.isInteger(totalNumberOfPages)){
       totalNumberOfPages = Math.ceil(totalNumberOfPages);
     };
     
     if(lastItemIndex > numberOfItems){
         lastItemIndex = numberOfItems;
     };
      return res
      .status(200)
      .json({ 
        count:numberOfItems, 
        results:list.splice(firstItemIndex,lastItemIndex), 
        totalPages
        });
};