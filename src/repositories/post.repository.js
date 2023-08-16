import db from "../database/database.connection";


export function getPostById(id){
    const post = db.query(`
        SELECT *
        FROM posts
        WHERE id=$1;
    `, [id]);
    return post;
}

export function updatePost(id, newDescription){
    const resp = db.query(`
        UPDATE posts
        SET description=$1
        WHERE id=$2;
    `, [newDescription, id]);
    return resp;
}