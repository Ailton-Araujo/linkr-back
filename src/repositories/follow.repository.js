import db from "../database/database.connection.js";

export const checkForAnyFollow = async (userId) => {
    const result = await db.query(`SELECT * FROM follows WHERE "followerId"=$1;`, [userId]);
    return result;
};

export const checkFollower = async (id, userId) => {
    const result = await db.query(`SELECT * FROM follows WHERE "followerId"=$1 AND "followedId"=$2;`, [userId, id]);
    return result;
};

export const registerFollow = async (id, userId) => {
    const result = await db.query(`INSERT INTO follows ("followerId", "followedId") VALUES ($1, $2);`, [userId, id]);
    return result;
};

export const unfollowUser = async (id, userId) => {
    const result = await db.query(`DELETE FROM follows WHERE "followerId"=$1 AND "followedId"=$2;`, [userId, id]);
    return result;
};