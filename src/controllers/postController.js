import fetch from "node-fetch";
globalThis.fetch = fetch;

import {
  insertPost,
  insertHashTags,
  selectLinkrs,
  getPostById,
  getPostsByUserId,
  updatePost,
  insertLike,
  deleteLike,
  deleteHashPost,
  deletePostById,
  sharePostById,
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
    const newPost = {
      description,
      link,
      id: idPost.rows[0].id,
      user: info,
      postLikes: [null],
    };

    res.status(201).send(newPost);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function getLinkrs(req, res) {
  try {
    const linkrs = await selectLinkrs();
    res.status(200).send(linkrs.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

async function patchPost(req, res) {
  const { id } = req.params;
  const { description, hashtags } = req.body;

  try {
    const post = await getPostById(id);
    if (post.rows.length === 0) return res.sendStatus(404);
    if (post.rows[0].userId !== res.locals.user.id) return res.sendStatus(401);
    await deleteHashPost(id);
    await updatePost(id, description);
    for (const hashtag of hashtags) {
      await insertHashTags(hashtag, id);
    }
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

    return res.send(linkrs.rows);
  } catch (err) {
    res.status(500);
  }
}

async function postLike(req, res) {
  const { userId, postId, type } = req.body;
  let userLike;
  try {
    if (type === "like") {
      userLike = await insertLike(userId, postId, type);
    }
    if (type === "dislike") {
      userLike = await deleteLike(userId, postId, type);
    }
    res.status(201).send(userLike);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function deletePost(req, res) {
  const { id } = req.params;

  try {
    const post = await getPostById(id);
    if (post.rows.length === 0) return res.sendStatus(404);
    if (post.rows[0].userId !== res.locals.user.id) return res.sendStatus(401);

    await deletePostById(id);

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function sharePost(req, res) {
  const { id } = req.params;
  const { user } = res.locals;

  try {
    await sharePostById(id, user.id);

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export {
  postLinkr,
  getLinkrs,
  patchPost,
  getPostsByUser,
  postLike,
  deletePost,
  sharePost,
};
