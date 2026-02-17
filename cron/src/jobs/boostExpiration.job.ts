import cron from 'node-cron';
import { Boost } from '../modules/boosts/boost.model';
import Listing from '../modules/listing/listing.model';

// This job runs every hour to check for expired boosts.
export const scheduleBoostExpirationJob = () => {
    console.log('🕒 Scheduling boost expiration job...');
    // 1sec por por hobe
    cron.schedule('0 0 * * *', async () => {
        console.log('🚀 Running boost expiration job at:', new Date().toISOString());
        
        try {
            const now = new Date();
            
            // Find expired boosts that haven't been processed yet
            const expiredBoosts = await Boost.find({
                endAt: { $lt: now },
                processed: false,
            });

            if (expiredBoosts.length === 0) {
                console.log('✅ No expired boosts to process.');
                return;
            }

            console.log(`🔍 Found ${expiredBoosts.length} expired boosts.`);

            const listingIdsToUpdate = expiredBoosts.map((boost: any) => boost.listingId);
            const processedBoostIds = expiredBoosts.map((boost: any) => boost._id);

            // Bulk update listings to set isBoosted to false
            const listingUpdateResult = await Listing.updateMany(
                { _id: { $in: listingIdsToUpdate } },
                { $set: { isBoosted: false } }
            );

            console.log(`✅ Updated ${listingUpdateResult.modifiedCount} listings.`);

            // Bulk update boosts to mark them as processed
            const boostUpdateResult = await Boost.updateMany(
                { _id: { $in: processedBoostIds } },
                { $set: { processed: true } }
            );

            console.log(`✅ Marked ${boostUpdateResult.modifiedCount} boosts as processed.`);

        } catch (error) {
            console.error('❌ Error running boost expiration job:', error);
        }
    });
};
