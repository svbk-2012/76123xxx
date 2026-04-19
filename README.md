# Life Simulator

An educational life simulator game inspired by BitLife, where players take tests, earn degrees, apply for jobs, and build their career.

## Features

- **Test System**: Take science tests with 6-8th grade difficulty questions
- **Degree Progression**: Earn High School Diploma, Associate's, and Bachelor's degrees
- **Job Market**: Apply for various jobs with different education requirements
- **Save System**: Local storage and JSON file import/export
- **Responsive Design**: Works on desktop and mobile devices

## How to Play

1. **Enter your character name** when starting the game
2. **Study** to improve your test performance
3. **Take tests** to earn degrees based on your scores
4. **Apply for jobs** that match your education level
5. **Earn money** and progress through your career

## Degree Requirements

- **High School Diploma**: 60+ test score
- **Associate's Degree**: 75+ test score  
- **Bachelor's Degree**: 85+ test score

## Job Categories

- **No Education Required**: Cashier, Waiter
- **High School Diploma**: Office Assistant, Lab Technician, Teacher Assistant
- **Associate's Degree**: Junior Programmer, Registered Nurse
- **Bachelor's Degree**: Junior Engineer, Research Scientist, Project Manager

## Development

This project uses:
- **Vite** for fast development and building
- **Vanilla JavaScript** (no frameworks)
- **CSS Grid/Flexbox** for responsive layout
- **LocalStorage** for game saves

## Getting Started

1. Clone this repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Build for production: `npm run build`

## GitHub Pages Deployment

The project is configured for GitHub Pages deployment. The `base` path in `vite.config.js` is set to `/life-simulator/` for proper asset loading.

## Game Controls

- **Take Science Test**: Start a test with a random science question
- **Apply for Jobs**: View and apply for available jobs
- **Study**: Increase study time to improve test scores
- **Save/Load**: Manage game progress with local storage
- **Export/Import**: Save game data to/from JSON files

## Future Enhancements

- More subjects (Math, English, History)
- Additional job categories
- Character stats and skills
- Life events and random occurrences
- Sound effects and animations
- Multiplayer features
