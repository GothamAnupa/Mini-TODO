# Import FastAPI to create our web API application
from fastapi import FastAPI

# Import CORS middleware.
# CORS allows the frontend application to communicate with our backend API.
from fastapi.middleware.cors import CORSMiddleware

# Import Base and engine from our database configuration.
# Base contains our database model definitions.
# engine is responsible for connecting to the SQLite database.
from app.database import Base, engine

# Import the tasks router.
# This router contains all the API endpoints related to tasks.
from app.routers import tasks


# Create all database tables defined using our Base class.
# If the tables already exist, SQLAlchemy will not create them again.
Base.metadata.create_all(bind=engine)


# Create the main FastAPI application instance.
app = FastAPI()


# Add CORS middleware to our FastAPI application.
# This controls which frontend applications are allowed to access our API.
app.add_middleware(
    CORSMiddleware,

    # Allow requests from any origin.
    # "*" means any website or frontend can access the API.
    allow_origins=["*"],

    # Allow credentials such as cookies or authentication information.
    allow_credentials=True,

    # Allow all HTTP methods such as GET, POST, PUT, DELETE, etc.
    allow_methods=["*"],

    # Allow all HTTP headers in requests.
    allow_headers=["*"],
)


# Include the tasks router in our main FastAPI application.
# This makes all endpoints defined in tasks.router available in the application.
app.include_router(tasks.router)


# Define a GET endpoint for the root URL "/".
# When a user visits http://127.0.0.1:8000/,
# this function will be executed.
@app.get("/")
def home():

    # Return a simple welcome message as a JSON response.
    return {
        "message": "Welcome to the To-Do API!"
    }