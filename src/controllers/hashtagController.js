import { getPostsByHashtag } from "../repositories/hashtag.repository.js";

export async function getPostsByHashtagRoute(req, res) {
  const { hashtag } = req.params;

  try {
    const { rows: posts } = await getPostsByHashtag(hashtag);

    return res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
