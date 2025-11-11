# backend

fastapi backend for notes app

## setup

1. install dependencies

```bash
pip install -r requirements.txt
```

2. create `.env` file

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

3. run database schema in supabase sql editor

```bash
# copy and paste schema.sql content into supabase sql editor
```

4. run server

```bash
uvicorn app.main:app --reload
```

server runs on `http://localhost:8000`

## api docs

- swagger ui: `http://localhost:8000/docs`
- redoc: `http://localhost:8000/redoc`

## endpoints

- `GET /` - health check
- `GET /health` - health check
- `GET /notes` - list notes
- `GET /notes/{id}` - get note
- `POST /notes` - create note
- `PUT /notes/{id}` - update note
- `DELETE /notes/{id}` - delete note
- `GET /notes/search?q=...` - search notes
- `GET /users/me` - get current user

all endpoints require authentication (bearer token)
