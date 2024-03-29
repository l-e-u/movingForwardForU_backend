import _ from 'lodash';

// accepts a mongooseQuery, and user-defined filters, per filter, apply to the query, execute the query and return the filtered query results
export const applyFiltersToQuery = ({ filters, query }) => {
   try {
      // boolean
      if (filters.hasOwnProperty('isArchived')) query.find({ isArchived: filters.isArchived });

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
      if (filters.organization) query.find({ organization: { $regex: filters.organization, $options: 'i' } });
      if (filters.reference) query.find({ reference: new RegExp(_.escapeRegExp(filters.reference), 'i') },);
      if (filters.notes) {
         const userInput = filters.notes;

         query.find({
            notes: {
               $elemMatch: {
                  message: { $regex: _.escapeRegExp(userInput), $options: 'i' }
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

      // archived on: greater than or equal to  / less than or equal to
      if (filters.archivedOnGTE) query.find({ 'archive.date': { $gte: filters.archivedOnGTE } });
      if (filters.archivedOnLTE) query.find({ 'archive.date': { $lte: filters.archivedOnLTE } });

      // created on: greater than or equal to / less than or equal to
      if (filters.createdOnGTE) query.find({ createdAt: { $gte: filters.createdOnGTE } });
      if (filters.createdOnLTE) query.find({ createdAt: { $lte: filters.createdOnLTE } });

      return query;
   }
   catch (error) {
      console.log('query error', error)
   }
}