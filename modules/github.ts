import fetch from 'node-fetch';

const TOKEN = process.env.GITHUB_TOKEN; // Set your token in .env.local

// Github API Response
type GitHubApiResponse = {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: Array<{
          contributionDays: Array<{
            contributionCount: number;
            date: string;
          }>
        }>
      }
    }
  }
};

// JSON Formatting
type TransformedData = {
  count: number;
  month: string;
  day: string;
  level: number;
};


// Data fetching from github API
async function fetchGitHubData(userName: string): Promise<GitHubApiResponse> {
  const query = `
    query($userName:String!) {
      user(login: $userName){
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    userName: userName
  };

  const body = {
    query,
    variables
  };

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  return data.data;
}
