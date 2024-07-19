import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import { retrieveContributionData } from '../../modules/github';

// CORS
const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'], // Adjust as needed
});


const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors); 
  // CORS end

  try {
    const userName = req.query.userName as string;
    const contributionData = await retrieveContributionData(userName);
    res.status(200).json(contributionData);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
