import { Follow } from './follow.model';

const toggleFollow = async (follower: string, following: string) => {
    const isFollowing = await Follow.findOne({ follower, following });

    if (isFollowing) {
        await Follow.findOneAndDelete({ follower, following });
        return { following: false };
    } else {
        await Follow.create({ follower, following });
        return { following: true };
    }
};


const getFollowers = async (userId: string) => {
  return await Follow.find({ following: userId }).populate('follower');
};

const getFollowing = async (userId: string) => {
  return await Follow.find({ follower: userId }).populate('following');
};

const isFollowing = async (follower: string, following: string) => {
    return !!(await Follow.findOne({ follower, following }));
};

export const FollowService = {
  toggleFollow,
  getFollowers,
  getFollowing,
  isFollowing,
};