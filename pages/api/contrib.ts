import { NextApiRequest, NextApiResponse } from 'next';
import { retrieveContributionData } from '../modules/github';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userName = req.query.userName as string;
    const contributionData = await retrieveContributionData(userName);
    res.status(200).json(contributionData);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
