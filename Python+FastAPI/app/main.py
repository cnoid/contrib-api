from fastapi import FastAPI, HTTPException
from app.github import retrieve_contribution_data

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)

@app.get("/api/contrib")
async def get_contributions(userName: str):
    try:
        contribution_data = await retrieve_contribution_data(userName)
        return contribution_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
