import { getPostById, getPostsByUserId, updatePost } from "../repositories/post.repository.js";
import { getUserById } from "../repositories/user.repository.js";


export async function patchPost(req, res){
    const { id } = req.params;
    const { description } = req.body;

    try {
        const post = await getPostById(id);
        if (post.rows.length === 0) return res.sendStatus(404);
        if (post.rows[0].userId !== res.locals.user.id) return res.sendStatus(401);
        await updatePost(id, description);
        res.sendStatus(204);
    } catch(err){
        res.status(500).send(err.message);
    }
}

export async function getPostsByUser(req, res){
    const { userId } = req.params;
    
    try {
        const user = await getUserById(userId);
        if (user.rows.length === 0) return res.sendStatus(404);
        const posts = await getPostsByUserId(userId);
        return res.send(posts.rows);
    } catch(err){
        res.status(500);
    }
}