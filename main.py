from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
import os
from dotenv import load_dotenv

# Load enviromental variables

load_dotenv()

# Initialize FastAPI

app = FastAPI()

# Add CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to Supabase

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_ANON_KEY")
)

# Get schools

@app.get("/schools")
def get_schools():
    try:
        result = supabase.table("schools").select("*").order("name").execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Get surveys

@app.get("/surveys")
def get_surveys():
    try:
        # Get all survey rows from database
        result = supabase.table("surveys").select("*").order("title", "question_number").execute()
        
        # Group questions by survey title
        surveys = {}
        for row in result.data:
            title = row["title"]
            if title not in surveys:
                surveys[title] = {
                    "id": row["id"],
                    "title": title,
                    "category": row["category"],
                    "questions": []
                }
            
            # Parse the question string "What brand?|Nike|Adidas|Vans"
            parts = row["questions"].split("|")
            question_text = parts[0]  # "What brand?"
            options = parts[1:]       # ["Nike", "Adidas", "Vans"]
            
            surveys[title]["questions"].append({
                "question_number": row["question_number"],
                "question_text": question_text,
                "options": options
            })
        
        # Convert to list and sort questions
        survey_list = []
        for survey in surveys.values():
            survey["questions"].sort(key=lambda x: x["question_number"])
            survey_list.append(survey)
        
        return survey_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Post survey reponses 

@app.post("/submit")
def submit_response(data: dict):
    try:
        survey_title = data["survey_title"]  # "Favorite Shoe Brands"
        school_id = data["school_id"]        # 1
        answers = data["answers"]            # ["Nike", "$50-$100"]
        
        # Convert answers to pipe-separated string
        answers_string = "|".join(answers)   # "Nike|$50-$100"
        
        # Find the survey ID from the title
        survey_result = supabase.table("surveys").select("id").eq("title", survey_title).eq("question_number", 1).execute()
        survey_id = survey_result.data[0]["id"]
        
        # Save to database
        result = supabase.table("responses").insert({
            "survey_id": survey_id,
            "school_id": school_id,
            "answers": answers_string
        }).execute()
        
        return {"success": True, "response_id": result.data[0]["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Get results (from classmates)

@app.get("/results/{survey_title}/{school_id}")
def get_results(survey_title: str, school_id: int):
    try:
        # Get school name for display
        school_result = supabase.table("schools").select("name").eq("id", school_id).execute()
        school_name = school_result.data[0]["name"]
        
        # Get all questions for this survey
        survey_questions = supabase.table("surveys").select("*").eq("title", survey_title).order("question_number").execute()
        survey_id = survey_questions.data[0]["id"]
        
        # Get all responses from this school for this survey
        responses_result = supabase.table("responses").select("answers").eq("survey_id", survey_id).eq("school_id", school_id).execute()
        
        total_responses = len(responses_result.data)
        
        # Count answers for each question
        question_results = []
        for i, question_row in enumerate(survey_questions.data):
            parts = question_row["questions"].split("|")
            question_text = parts[0]
            
            # Count answers for this question position
            answer_counts = {}
            for response in responses_result.data:
                answers = response["answers"].split("|")  # ["Nike", "$50-$100"]
                if i < len(answers):
                    answer = answers[i]  # Get answer for question i
                    answer_counts[answer] = answer_counts.get(answer, 0) + 1
            
            question_results.append({
                "question_number": question_row["question_number"],
                "question_text": question_text,
                "answer_counts": answer_counts  # {"Nike": 3, "Adidas": 1}
            })
        
        return {
            "school_name": school_name,
            "total_responses": total_responses,
            "question_results": question_results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
