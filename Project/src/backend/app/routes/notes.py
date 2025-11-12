from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.core.database import get_supabase
from app.core.auth import get_current_user
from supabase import Client

router = APIRouter(prefix="/notes", tags=["notes"])

# ---------------------------
# Models
# ---------------------------

class NoteCreate(BaseModel):
    content: str
    basic_stats: Optional[dict] = None

class NoteUpdate(BaseModel):
    content: Optional[str] = None
    basic_stats: Optional[dict] = None

class NoteResponse(BaseModel):
    id: str
    user_id: str
    content: str
    created_at: datetime
    updated_at: datetime
    basic_stats: Optional[dict] = None

# ---------------------------
# Routes
# ---------------------------

@router.get("/", response_model=List[NoteResponse])
async def list_notes(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """
    Get all notes for the current user.
    """
    # TODO: Implement
    pass

@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(
    note_id: str,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """
    Get a specific note by ID.
    """
    # TODO: Implement
    pass

@router.post("/", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(
    note: NoteCreate,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """
    Create a new note.
    """
    # TODO: Implement
    pass

@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: str,
    note: NoteUpdate,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """
    Update an existing note.
    """
    # TODO: Implement
    pass

@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(
    note_id: str,
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """
    Delete a note.
    """
    # TODO: Implement
    pass

@router.get("/search", response_model=List[NoteResponse])
async def search_notes(
    q: str = Query(..., min_length=1),
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase)
):
    """
    Search notes by content.
    """
    # TODO: Implement
    pass

