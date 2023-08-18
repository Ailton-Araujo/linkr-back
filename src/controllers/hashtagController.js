import urlMetadata from "url-metadata";
import { getPostsByHashtag } from "../repositories/hashtag.repository.js";

export async function getPostsByHashtagRoute(req, res) {
  const { hashtag } = req.params;

  try {
    const { rows: posts } = await getPostsByHashtag(hashtag);

    let postsWithMetadata = [];

    for (const post of posts) {
      try {
        const metadata = await urlMetadata(post.link);
        postsWithMetadata = [
          ...postsWithMetadata,
          {
            post,
            meta: {
              title: metadata["og:title"],
              description: metadata["og:description"],
              image: metadata["og:image"],
            },
          },
        ];
      } catch {
        postsWithMetadata = [
          ...postsWithMetadata,
          {
            post,
            meta: {
              title: "",
              description: "",
              image: "",
            },
          },
        ];
      }
    }

    return res.status(200).send(postsWithMetadata);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
