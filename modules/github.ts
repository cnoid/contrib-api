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


// More data formatting, change as you need
function transformGitHubData(data: GitHubApiResponse): TransformedData[] {
  const result: TransformedData[] = [];

  data.user.contributionsCollection.contributionCalendar.weeks.forEach(week => {
    week.contributionDays.forEach(day => {
      const date = new Date(day.date);
      const count = day.contributionCount;
      const month = date.toLocaleString('default', { month: 'long' });
      const dayOfMonth = `${date.getDate()}${getOrdinalSuffix(date.getDate())}`;
      const level = determineLevel(count);

      result.push({ count, month, day: dayOfMonth, level });
    });
  });

  return result;
}

// Helper function to return the ordinal suffix for a day
function getOrdinalSuffix(day: number): string {
  const j = day % 10,
        k = day % 100;
  if (j == 1 && k != 11) {
      return "st";
  }
  if (j == 2 && k != 12) {
      return "nd";
  }
  if (j == 3 && k != 13) {
      return "rd";
  }
  return "th";
}

// Determine the contribution level
function determineLevel(count: number): number {
  if (count === 0) return 0;
  if (count < 5) return 1;
  if (count < 10) return 2;
  if (count < 20) return 3; 
  return 4; 
}


// Main function to retrieve and transform GitHub contribution data
export async function retrieveContributionData(userName: string): Promise<TransformedData[]> {
  const fetchedData = await fetchGitHubData(userName);
  const transformedData = transformGitHubData(fetchedData);
  return transformedData;
}
