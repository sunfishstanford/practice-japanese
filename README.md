# Practice Japanese

A React web application for learning Japanese hiragana, katakana, and common phrases. Designed specifically for iPhone Safari with offline support.

## Features

- **Multiple Question Types**: Quiz on hiragana, katakana, and common Japanese phrases
- **Bidirectional Learning**: Both Japanese to English and English to Japanese questions
- **Multiple Choice Format**: 4 answer choices per question with immediate feedback
- **Smart Review System**: Automatically emphasizes questions you answered incorrectly in future sessions
- **Customizable Settings**:
  - Adjust number of questions per session (5-30)
  - Toggle Romaji pronunciation hints on/off
- **Score Tracking**: View your quiz history and track your progress over time
- **Offline Support**: Works completely offline once loaded (PWA)
- **Mobile Optimized**: Large font sizes (minimum 20px) for easy reading on iPhone

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sunfishstanford/practice-japanese.git
cd practice-japanese
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open in your browser at `http://localhost:3000`.

### Building for Production

To create a production build:

```bash
npm run build
```

The build files will be in the `build/` directory, ready to deploy.

## Using on iPhone

### Install as a Web App (PWA)

1. Open the app in Safari on your iPhone
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" in the top right

The app will now be available as an icon on your home screen and will work offline!

## How to Use

### Quiz Page

1. Select one of the 4 answer choices
2. Immediate feedback shows if you're correct or incorrect
3. If incorrect, the correct answer is displayed
4. Click "Next Question" to continue
5. Complete all questions to see your session score

### Settings Page

- **Questions per session**: Choose how many questions you want in each quiz (5-30)
- **Show Romaji**: Toggle whether to show pronunciation hints for Japanese characters
- **Reset All Data**: Clear all history and incorrect question tracking (use with caution!)

### History Page

View your quiz performance over time:
- Total sessions completed
- Average score percentage
- Detailed history of each session with date and score

## Data Included

- **Hiragana**: All 46 basic hiragana characters
- **Katakana**: All 46 basic katakana characters
- **Phrases**: 40 common Japanese phrases including:
  - Greetings
  - Polite expressions
  - Common questions
  - Basic conversation

## Technical Details

- Built with React 19
- Uses localStorage for data persistence
- Service Worker for offline functionality
- Responsive design optimized for iPhone Safari
- No backend required - runs entirely in the browser

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
