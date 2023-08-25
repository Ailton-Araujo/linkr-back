import { getPostsByHashtag } from "../repositories/hashtag.repository.js";

export async function getPostsByHashtagRoute(req, res) {
  const { hashtag } = req.params;
  const { offset } = req.query;

  try {
    const { rows: posts } = await getPostsByHashtag(hashtag, offset);

    return res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
