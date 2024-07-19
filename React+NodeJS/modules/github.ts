import fetch from 'node-fetch';

const TOKEN = process.env.GITHUB_TOKEN; // Remember to put your Github token in .env.local before running

// GraphQL
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

type TransformedData = {
  count: number;
  month: string;
  day: string;
  level: number;
};

// Fetch data
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

// Transform into JSON
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

// Day translate
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

// Activity level
function determineLevel(count: number): number {
  if (count === 0) return 0;
  if (count < 5) return 1;
  if (count < 10) return 2;
  if (count < 20) return 3; 
  return 4; // Level 4 for counts of 20 and above
}

// JSON export
export async function retrieveContributionData(userName: string): Promise<TransformedData[]> {
  const fetchedData = await fetchGitHubData(userName);
  const transformedData = transformGitHubData(fetchedData);
  return transformedData;
}
