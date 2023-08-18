import urlMetadata from "url-metadata";
import fetch from "node-fetch";
globalThis.fetch = fetch;

import {
  insertPost,
  insertHashTags,
  selectLinkrs,
  getPostById,
  getPostsByUserId,
  updatePost,
} from "../repositories/post.repository.js";

import { getUserById } from "../repositories/user.repository.js";

async function postLinkr(req, res) {
  const { link, description, hashtags } = req.body;
  const info = res.locals.user;

  try {
    const idPost = await insertPost(link, description, info);

    for (const hashtag of hashtags) {
      await insertHashTags(hashtag, idPost.rows[0].id);
    }

    try {
      const metadata = await urlMetadata(post.link);
      const newPost = {
        post: { description, link, id: idPost.rows[0].id, user: info },
        meta: {
          title: metadata["og:title"],
          description: metadata["og:description"],
          image: metadata["og:image"],
        },
      };
      res.status(201).send(newPost);
    } catch (error) {
      const newPost = {
        post: { description, link, id: idPost.rows[0].id, user: info },
        meta: {
          title: "",
          description: "",
          image: "",
        },
      };
      res.status(201).send(newPost);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function getLinkrs(req, res) {
  try {
    const linkrs = await selectLinkrs();
    let data = [];

    for (const post of linkrs.rows) {
      try {
        const metadata = await urlMetadata(post.link);
        data = [
          ...data,
          {
            post,
            meta: {
              title: metadata["og:title"],
              description: metadata["og:description"],
              image: metadata["og:image"],
            },
          },
        ];
      } catch (error) {
        data = [
          ...data,
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

    res.status(200).send(data);
  } catch (error) {
    console.log(error);
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

async function getPostsByUser(req, res) {
  const { userId } = req.params;

  try {
    const user = await getUserById(userId);
    if (user.rows.length === 0) return res.sendStatus(404);
    const linkrs = await getPostsByUserId(userId);
    let data = [];

    for (const post of linkrs.rows) {
      try {
        const metadata = await urlMetadata(post.link);
        data = [
          ...data,
          {
            post,
            meta: {
              title: metadata["og:title"],
              description: metadata["og:description"],
              image: metadata["og:image"],
            },
          },
        ];
      } catch (error) {
        data = [
          ...data,
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
    return res.send(data);
  } catch (err) {
    res.status(500);
  }
}

export { postLinkr, getLinkrs, patchPost, getPostsByUser };
