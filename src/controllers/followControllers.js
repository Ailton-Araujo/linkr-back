import { checkFollower, checkForAnyFollow, registerFollow, unfollowUser } from "../repositories/follow.repository.js";

export const hasFollows = async (req, res) => {
    const userId = res.locals.user.id;

    try {
        const isThereAnyFollow = await checkForAnyFollow(userId)
        res.status(200).send(isThereAnyFollow)
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const isFollowing = async (req, res) => {
    const { id } = req.params;
    const userId = res.locals.user.id;

    try {
        const getFollow = await checkFollower(id, userId);
        res.status(200).send(getFollow);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const follow = async (req, res) => {
    const { id } = req.params;
    const userId = res.locals.user.id;

    try {
        const addFollow = await registerFollow(id, userId);
        res.status(200).send(addFollow);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const unfollow = async (req, res) => {
    const { id } = req.params;
    const userId = res.locals.user.id;

    try {
        const removeFollow = await unfollowUser(id, userId);
        if (removeFollow.rowCount === 0) return res.sendStatus(404);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
};