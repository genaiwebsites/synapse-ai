# Synapse AI Dashboard

This project is a full-stack monorepo containing a Next.js frontend and a FastAPI Python backend.

## How to Run Locally

You need to run **both** the frontend and the backend servers simultaneously in separate terminal windows.

### 1. Start the Frontend (Next.js)

Open a terminal in the root directory (`c:\Projects\synapse_app`) and run:

```bash
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

### 2. Start the Backend (FastAPI + Python)

Open a **second** terminal, navigate to the `backend` directory, activate the virtual environment, and run the server.

If you are using **PowerShell**:
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --port 8080 --reload
```
*(You can also run it in one line: `cd backend; & .\venv\Scripts\Activate.ps1; uvicorn main:app --port 8080 --reload`)*

If you are using **Command Prompt (CMD)**:
```cmd
cd backend
.\venv\Scripts\activate.bat
uvicorn main:app --port 8080 --reload
```

The backend API will be available at [http://localhost:8080](http://localhost:8080).
