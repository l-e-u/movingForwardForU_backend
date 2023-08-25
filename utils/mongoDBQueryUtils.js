// accepts a mongooseQuery, and user-defined filters, per filter, apply to the query, execute the query and return the filtered query results
export const applyFiltersToQuery = ({ filters, query }) => {
   // boolean
   if (filters.isArchived) query.find({ isArchived: filters.isArchived === 'true' ? true : false });

   // includes
   if (filters.drivers) query.find({ drivers: { $in: filters.drivers.split(',') } });
   if (filters.status) query.find({ status: { $in: filters.status.split(',') } });
   if (filters.customer) query.find({ customer: { $in: filters.customer.split(',') } });
   if (filters.billing) query.find({
      billing: {
         $elemMatch: {
            fee: {
               $in: filters.billing.split(',')
            }
         }
      }
   });

   // regex
   if (filters.reference) query.find({ reference: { $regex: filters.reference, $options: 'i' } },);
   if (filters.notes) {
      const userInput = filters.notes;

      query.find({
         notes: {
            $elemMatch: {
               message: { $regex: userInput, $options: 'i' }
            }
         }
      });
   };

   // mileage: greater than or equal to / less than or equal to
   if (filters.mileageGTE) query.find({ mileage: { $gte: filters.mileageGTE } });
   if (filters.mileageLTE) query.find({ mileage: { $lte: filters.mileageLTE } });

   // pickup date: greater than or equal to / less than or equal to
   if (filters.pickupGTE) query.find({ 'pickup.date': { $gte: filters.pickupGTE } });
   if (filters.pickupLTE) query.find({ 'pickup.date': { $lte: filters.pickupLTE } });

   // delivery date: greater than or equal to / less than or equal to
   if (filters.deliveryGTE) query.find({ 'delivery.date': { $gte: filters.deliveryGTE } });
   if (filters.deliveryLTE) query.find({ 'delivery.date': { $lte: filters.deliveryLTE } });

   // created on: greater than or equal to / less than or equal to
   if (filters.createdOnGTE) query.find({ createdAt: { $gte: filters.createdOnGTE } });
   if (filters.createdOnLTE) query.find({ createdAt: { $lte: filters.createdOnLTE } });

   return query;
}