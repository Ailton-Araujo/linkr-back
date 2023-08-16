import { getPostsByHashtag } from "../repositories/hashtag.repository";

export async function getPostsByHashtagRoute(req, res) {
  const { hashtag } = req.params;

  try {
    const { rows: posts } = getPostsByHashtag(hashtag);

    if (![posts]) {
      return res
        .status(404)
        .send({ message: "No posts found with this hashtag!" });
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
