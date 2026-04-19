// Main entry point for the Life Simulator game
import Game from './game.js';
import UIController from './ui.js';

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    const ui = new UIController(game);
    
    // Make ui available globally for onclick handlers
    window.ui = ui;
    
    // Auto-load functionality - check if there's a saved game
    const hasSavedGame = game.loadGame();
    
    if (hasSavedGame) {
        // Game loaded successfully, update display
        ui.updateDisplay();
        console.log('Game auto-loaded successfully');
    } else {
        // No saved game found, prompt for new player name
        const playerName = prompt('Welcome to Life Simulator! Please enter your name:');
        if (playerName) {
            game.newGame(playerName);
            ui.updateDisplay();
        }
    }
    
    // If there's an ongoing test, restore it
    if (game.currentTest && game.currentTest.subject) {
        ui.showTestSection();
        ui.updateTestProgress();
    }
});
