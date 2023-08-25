import { insertComment } from "../repositories/comments.repository.js";

async function addComment(req, res) {
  const { postId, userId, comment } = req.body;
  console.log(postId, userId, comment);
  try {
    await insertComment(postId, userId, comment);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

export { addComment };
