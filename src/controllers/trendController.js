import { getTopTemTrending } from "../repositories/trend.repository.js";

export async function getTrending(req, res) {
  try {
    const { rows: trending } = await getTopTemTrending();

    return res.status(200).send(trending);
  } catch (error) {
    return res.status(500).send(error);
  }
}
