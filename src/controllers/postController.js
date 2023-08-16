import { getPostById, updatePost } from "../repositories/post.repository";


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