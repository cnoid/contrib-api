import os
import httpx
from typing import List, Dict
from memory_profiler import profile

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

@profile
async def fetch_github_data(user_name: str) -> dict:
    query = """
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
    """
    variables = {"userName": user_name}
    headers = {"Authorization": f"Bearer {GITHUB_TOKEN}"}

    async with httpx.AsyncClient() as client:
        response = await client.post('https://api.github.com/graphql', json={"query": query, "variables": variables}, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data['data']

def get_month_day(date_str: str) -> (str, str):
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    date_parts = date_str.split("-")
    year, month, day = int(date_parts[0]), int(date_parts[1]), int(date_parts[2])
    month_name = months[month - 1]
    suffix = "th" if 11 <= day <= 13 else {1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")
    return month_name, f"{day}{suffix}"

def determine_level(count: int) -> int:
    if count == 0:
        return 0
    elif count < 5:
        return 1
    elif count < 10:
        return 2
    elif count < 20:
        return 3
    else:
        return 4

def transform_contribution_data(data: dict) -> List[Dict]:
    transformed = []
    weeks = data['user']['contributionsCollection']['contributionCalendar']['weeks']
    for week in weeks:
        for day in week['contributionDays']:
            month, day_with_suffix = get_month_day(day['date'])
            transformed.append({
                "count": day['contributionCount'],
                "month": month,
                "day": day_with_suffix,
                "level": determine_level(day['contributionCount'])
            })
    return transformed

async def retrieve_contribution_data(user_name: str) -> List[Dict]:
    fetched_data = await fetch_github_data(user_name)
    transformed_data = transform_contribution_data(fetched_data)
    return transformed_data
