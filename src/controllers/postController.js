import {
  insertPost,
  insertHashTags,
  insertHashPost,
  getPostById,
  updatePost,
} from "../repositories/post.repository.js";

async function postLinkr(req, res) {
  const { link, description, hashtags } = req.body;
  const info = res.locals.user;

  try {
    const idPost = await insertPost(link, description, info);

    hashtags.forEach(async (element) => {
      await insertHashTags(element, idPost.rows[0].id);
    });

    res.status(201).send("Post Published");
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function patchPost(req, res) {
  const { id } = req.params;
  const { description } = req.body;

  try {
    const post = await getPostById(id);
    if (post.rows.length === 0) return res.sendStatus(404);
    if (post.rows[0].userId !== res.locals.user.id) return res.sendStatus(401);
    await updatePost(id, description);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export { postLinkr, patchPost };
