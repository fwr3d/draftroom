# 🏈 Fantasy Football Mock Draft App

A modern, interactive fantasy football mock draft simulator built with React. Experience the thrill of draft day with a clean, responsive interface and intelligent snake draft logic.

## ✨ Features

- **🎯 Snake Draft Format**: Classic 1→2→3→4→4→3→2→1 draft order
- **👥 Flexible League Sizes**: Support for 6, 8, 10, 12, or 14 teams
- **🔍 Smart Player Filtering**: Search by name and filter by position
- **📊 Real-time Draft Board**: Visual representation of all picks made
- **📱 Responsive Design**: Works perfectly on desktop and mobile devices
- **⚡ Built-in Player Data**: 25 top fantasy football players included
- **🎨 Modern UI**: Dark theme with glass morphism effects

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   cd fantasy-football-mock-draft
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎮 How to Use

### 1. Welcome Screen
- Land on the beautiful welcome page
- Click "Enter Draft Room" to begin

### 2. Player Hub
- Select your league size (6-14 teams)
- Review draft format and rules
- Click "Start Mock Draft" to begin

### 3. Mock Draft
- **You control Team 1** (always goes first)
- **Draft Board**: Left side shows all picks made
- **Player Selection**: Right side shows available players
- **Search & Filter**: Find players by name or position
- **Pagination**: Navigate through available players
- **Turn Management**: Clear indication of whose turn it is

### 4. Drafting Players
- Wait for your turn (Team 1)
- Use search/filters to find desired player
- Click "Draft" button to select player
- Player automatically appears on draft board
- Turn moves to next team

## 🏗️ Project Structure

```
src/
├── App.js                 # Main routing configuration
├── index.js              # App entry point
├── index.css             # Global styles and utilities
└── pages/
    ├── WelcomeScreen/     # Landing page
    ├── PlayerHub/         # League setup & configuration
    └── MockDraft/         # Core draft functionality
```

## 🎯 Technical Features

### Draft Logic
- **Snake Draft Algorithm**: Automatically calculates team order
- **Turn Management**: Tracks current pick and team
- **Pick Validation**: Ensures players can only be drafted once
- **Real-time Updates**: Draft board updates immediately

### Player Management
- **Built-in Database**: 25 top fantasy players
- **Position Categories**: QB, RB, WR, TE
- **Team Information**: NFL team abbreviations
- **Dynamic Filtering**: Real-time search and position filtering

### User Experience
- **Responsive Grid Layout**: Adapts to different screen sizes
- **Glass Morphism Design**: Modern, elegant visual effects
- **Smooth Animations**: CSS transitions and hover effects
- **Intuitive Navigation**: Clear back buttons and breadcrumbs

## 🎨 Design System

### Color Palette
- **Primary**: #3b82f6 (Blue)
- **Background**: #0f172a to #1e293b (Dark gradient)
- **Text**: #ffffff (White)
- **Accents**: #60a5fa (Light blue)

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Fallbacks**: System fonts for optimal performance

### Components
- **Buttons**: Primary, secondary, and disabled states
- **Cards**: Glass morphism with subtle borders
- **Forms**: Clean inputs with focus states
- **Grids**: Responsive layouts for all screen sizes

## 📱 Responsive Design

- **Desktop**: Two-column layout with side-by-side draft board and player selection
- **Tablet**: Responsive grid that adapts to medium screens
- **Mobile**: Single-column layout with stacked components
- **Touch-Friendly**: Optimized button sizes and spacing

## 🔧 Customization

### Adding More Players
Edit the `allPlayers` array in `MockDraft.js`:

```javascript
const [allPlayers] = useState([
  { id: 26, name: "New Player", position: "RB", team: "NE" },
  // Add more players here...
]);
```

### Changing League Sizes
Modify the options in `PlayerHub.js`:

```javascript
<option value={16}>16 Teams</option>
<option value={18}>18 Teams</option>
```

### Styling Updates
- Global styles: `src/index.css`
- Component styles: Individual CSS files in each page folder
- Color variables: Update CSS custom properties for consistent theming

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy automatically on push

## 🐛 Troubleshooting

### Common Issues

**"Module not found" errors**
- Ensure all dependencies are installed: `npm install`
- Check file paths and imports

**Styling not loading**
- Verify CSS files are in correct locations
- Check for syntax errors in CSS files

**Routing issues**
- Ensure `react-router-dom` is installed
- Check route paths in `App.js`

**Performance issues**
- Check browser console for errors
- Verify component re-rendering logic

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with React 18 and modern web technologies
- Inspired by fantasy football enthusiasts worldwide
- Designed for optimal user experience and performance

---

**Ready to draft?** 🏈 Start your fantasy football journey today!
