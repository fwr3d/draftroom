# Fantasy Football Draft Room

A simple fantasy football draft application built with vanilla JavaScript and React.

## How to Run

1. **Simple Method**: Just open `index.html` in your web browser
2. **Local Server Method**: Use a local server to avoid CORS issues:
   - Python: `python -m http.server 8000`
   - Node.js: `npx serve .`
   - VS Code: Use the "Live Server" extension

## Features

- **Welcome Screen**: Landing page with start button
- **Player Hub**: Browse and search all available players by position
- **Mock Draft**: Conduct a fantasy football draft with customizable team count

## Project Structure

```
src/
├── data/
│   ├── Players.js          # Player database
│   ├── playerPositionRanks.js
│   ├── playerTiers.js
│   └── teamColors.js
├── pages/
│   ├── WelcomeScreen/      # Landing page
│   ├── PlayerHub/          # Player browsing
│   └── MockDraft/          # Draft interface
├── App.js                  # Main app component
├── index.js                # Entry point
└── index.css               # Global styles
```

## Data

The application uses a comprehensive player database with:
- Quarterbacks (QB)
- Running Backs (RB) 
- Wide Receivers (WR)
- Tight Ends (TE)
- Kickers (K)
- Defense/Special Teams (DST)

Each player includes stats, team info, college, and more.
