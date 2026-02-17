import cron from 'node-cron';
import User from '../modules/users/user.model';

// This job runs every minute to check for expired user verifications.
export const scheduleUserVerifiedExpirationJob = () => {
    console.log('🕒 Scheduling user verified expiration job...');
    
    cron.schedule('0 0 * * *', async () => {
        console.log('🚀 Running user verified expiration job at:', new Date().toISOString());
        
        try {
            const now = new Date();
            
            // Find users whose verification has expired
            const expiredUsers = await User.find({
                isVerified: true,
                verifiedBadgeExpiration: { $lt: now },
            });

            if (expiredUsers.length === 0) {
                console.log('✅ No expired user verifications to process.');
                return;
            }

            console.log(`🔍 Found ${expiredUsers.length} users with expired verification.`);

            const userIdsToUpdate = expiredUsers.map((user: any) => user._id);

            // Bulk update users to remove verification status
            const updateResult = await User.updateMany(
                { _id: { $in: userIdsToUpdate } },
                { 
                    $set: { 
                        isVerified: false,
                        verifiedBadge: null,
                        verifiedBadgeExpiration: null 
                    } 
                }
            );

            console.log(`✅ Updated ${updateResult.modifiedCount} users.`);

        } catch (error) {
            console.error('❌ Error running user verified expiration job:', error);
        }
    });
};
