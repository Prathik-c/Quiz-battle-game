Quick steps to run this frontend in VS Code

1. Install the "Live Server" extension (ritwickdey) in VS Code.
2. Open the folder `frontend-vscode` in VS Code.
3. Right-click `index.html` → "Open with Live Server" or press "Go Live" in status bar.
4. The app will be served at http://127.0.0.1:5500 (or http://localhost:5500).
5. Run backend in IntelliJ (QuizBattleApplication) on port 8080.

Notes:
- This frontend uses the REST API at http://localhost:8080. CORS has been updated to allow Live Server origins.
- The frontend is intentionally minimal to reproduce and debug API errors quickly.
