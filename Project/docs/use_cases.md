# Mobile Notes App Use Cases

## 1. User Authentication

### 1.1 Sign Up

**Actor:** New User
**Description:** Allows a new user to create an account to access the application.
**Preconditions:** User does not have an account.
**Main Flow:**

1. User navigates to the Sign Up screen.
2. User enters a valid email and password.
3. User submits the form.
4. System validates the input and creates a new account.
5. System logs the user in and redirects to the Home screen.

### 1.2 Log In

**Actor:** Registered User
**Description:** Allows an existing user to access their account.
**Preconditions:** User has an account.
**Main Flow:**

1. User navigates to the Login screen.
2. User enters their email and password.
3. User submits the form.
4. System authenticates the credentials.
5. System redirects the user to the Home screen.

---

## 2. Note Management

### 2.1 Create Note

**Actor:** Authenticated User
**Description:** User creates a new text-based note.
**Preconditions:** User is logged in.
**Main Flow:**

1. User taps the "Create Note" button.
2. User enters a title (optional) and content.
3. User saves the note.
4. System saves the note to the database.
5. System automatically generates embeddings for the note content specific to Semantic Search.
6. User is shown the created note.

### 2.2 View Note List

**Actor:** Authenticated User
**Description:** User views a list of their saved notes.
**Preconditions:** User is logged in.
**Main Flow:**

1. User creates an account or logs in.
2. System retrieves the list of notes associated with the user.
3. System displays the notes, typically showing title and last updated date.
4. User can scroll through the list (pagination is supported).

### 2.3 Edit Note

**Actor:** Authenticated User
**Description:** User updates the content or title of an existing note.
**Preconditions:** User is logged in and has an existing note.
**Main Flow:**

1. User selects a note from the list.
2. User taps on the note content or title to edit.
3. User modifies the text.
4. User saves the changes.
5. System updates the note in the database.
6. System regenerates embeddings for the updated content.

### 2.4 Delete Note

**Actor:** Authenticated User
**Description:** User permanently removes a note.
**Preconditions:** User is logged in and has an existing note.
**Main Flow:**

1. User selects a note or swipes on a note in the list.
2. User chooses the "Delete" option.
3. System removes the note and its associated chunks/embeddings from the database.
4. The note is removed from the user's view.

---

## 3. Search & Discovery

### 3.1 Keyword Search

**Actor:** Authenticated User
**Description:** User searches for notes containing specific words.
**Preconditions:** User is logged in.
**Main Flow:**

1. User enters a search query in the search bar.
2. System filters notes where the title or content matches the query string (case-insensitive).
3. System displays the matching notes.

### 3.2 Semantic Search (Vector Search)

**Actor:** Authenticated User
**Description:** User searches for notes based on meaning/context rather than exact keywords.
**Preconditions:** User is logged in and notes have been embedded.
**Main Flow:**

1. User performs a search (potentially via a specific "Smart Search" toggles or transparently integrated).
2. System converts the search query into a vector embedding.
3. System compares the query embedding with note embeddings stored in the database.
4. System returns notes that are semantically similar to the query, ranked by similarity score.

---

## 4. AI Features

### 4.1 AI Note Assistant

**Actor:** Authenticated User
**Description:** User uses AI to process or answer questions about a specific note.
**Preconditions:** User is logged in and viewing a note.
**Main Flow:**

1. User opens a note.
2. User selects the "AI Assistant" or "Ask AI" option.
3. User provides a prompt (e.g., "Summarize this note", "Fix grammar", "Identify action items").
4. System sends the note title, content, and user prompt to the AI service (Gemini 2.5 Flash).
5. AI processes the request and returns a response.
6. System displays the AI's response to the user.

---

## 5. Optical Character Recognition (OCR)

### 5.1 Extract Text from Image

**Actor:** Authenticated User
**Description:** User captures or uploads an image to convert it into a text/markdown note.
**Preconditions:** User is logged in.
**Main Flow:**

1. User selects "Scan" or "Upload Image" option.
2. User takes a photo or selects an image from the gallery.
3. System sends the image to the OCR service (Mistral OCR).
4. System extracts text and markdown formatting from the image.
5. System creates a new note (or directs user to a new note screen) with the extracted content.
