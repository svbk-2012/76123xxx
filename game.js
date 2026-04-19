// Core game state and logic
import { getRandomQuestions, checkAnswer, studyGuides, questions } from './data/questions.js';
import { degrees, checkDegreeQualification, getEducationDisplay } from './data/degrees.js';
import { getAvailableJobs, canApplyForJob } from './data/jobs.js';

class Game {
    constructor() {
        this.player = {
            name: '',
            age: 18,
            money: 1000,
            education: {
                highSchool: false,
                associate: false,
                bachelor: false
            },
            currentJob: null,
            testResults: [],
            studyTime: 0,
            testProgress: {
                science: { level: 1, passed: false },
                math: { level: 1, passed: false },
                history: { level: 1, passed: false },
                medicine: { level: 1, passed: false },
                law: { level: 1, passed: false }
            }
        };
        this.currentTest = {
            subject: null,
            questions: [],
            currentQuestionIndex: 0,
            answers: [],
            startTime: null
        };
        this.loadGame();
        
        // Auto-save on page close
        window.addEventListener('beforeunload', () => {
            this.saveGame();
        });
    }

    // Initialize new game
    newGame(playerName) {
        this.player = {
            name: playerName,
            age: 18,
            money: 1000,
            education: {
                highSchool: false,
                associate: false,
                bachelor: false
            },
            currentJob: null,
            testResults: [],
            studyTime: 0,
            testProgress: {
                science: { level: 1, passed: false },
                math: { level: 1, passed: false },
                history: { level: 1, passed: false },
                medicine: { level: 1, passed: false },
                law: { level: 1, passed: false }
            }
        };
        this.currentTest = {
            subject: null,
            questions: [],
            currentQuestionIndex: 0,
            answers: [],
            startTime: null
        };
        this.saveGame();
        return this.player;
    }

    // Start a new test
    startTest(subject) {
        const questionCount = 7; // 6-8 questions
        this.currentTest = {
            subject: subject,
            questions: getRandomQuestions(subject, questionCount),
            currentQuestionIndex: 0,
            answers: [],
            startTime: new Date()
        };
        return this.currentTest;
    }

    // Get current test question
    getCurrentQuestion() {
        if (!this.currentTest || this.currentTest.currentQuestionIndex >= this.currentTest.questions.length) {
            return null;
        }
        return this.currentTest.questions[this.currentTest.currentQuestionIndex];
    }

    // Submit test answer
    submitTestAnswer(userAnswer) {
        if (!this.currentTest || this.currentTest.currentQuestionIndex >= this.currentTest.questions.length) {
            return null;
        }

        const currentQuestion = this.getCurrentQuestion();
        const isCorrect = checkAnswer(currentQuestion, userAnswer);
        
        // Store answer
        this.currentTest.answers.push({
            questionId: currentQuestion.id,
            userAnswer: userAnswer,
            isCorrect: isCorrect
        });

        // Move to next question or finish test
        this.currentTest.currentQuestionIndex++;

        // Check if test is complete
        if (this.currentTest.currentQuestionIndex >= this.currentTest.questions.length) {
            return this.completeTest();
        }

        this.saveGame();
        return isCorrect;
    }

    // Complete current test
    completeTest() {
        if (!this.currentTest) return null;

        const correctAnswers = this.currentTest.answers.filter(a => a.isCorrect).length;
        const totalQuestions = this.currentTest.questions.length;
        const passed = correctAnswers >= 6; // Need 6+ correct to pass

        // Update test progress
        this.player.testProgress[this.currentTest.subject].passed = passed;
        if (passed) {
            this.player.testProgress[this.currentTest.subject].level++;
        }

        // Check for new degrees based on performance
        const score = Math.round((correctAnswers / totalQuestions) * 100);
        const newDegrees = checkDegreeQualification(score, this.player.education);
        newDegrees.forEach(degree => {
            this.player.education[degree] = true;
        });

        // Reset study time after test
        this.player.studyTime = 0;
        this.player.age += 0.1; // Test takes time
        
        // Clear current test
        this.currentTest = null;
        
        this.saveGame();
        
        return {
            passed: passed,
            score: score,
            correctAnswers: correctAnswers,
            totalQuestions: totalQuestions,
            newDegrees: newDegrees.map(degree => degrees[degree])
        };
    }

    // Study to improve test performance
    study() {
        this.player.studyTime++;
        this.player.age += 0.1; // Studying takes time
        this.saveGame();
        return this.player.studyTime;
    }

    // Apply for job
    applyForJob(jobId) {
        const job = getAvailableJobs(this.player.education).find(j => j.id === jobId);
        if (!job) return false;

        // Simple success probability based on qualifications
        const successRate = job.requiredDegree ? 0.8 : 0.6;
        const isSuccess = Math.random() < successRate;

        if (isSuccess) {
            this.player.currentJob = job;
            this.player.age += 0.2; // Job search takes time
            this.saveGame();
            return true;
        }

        return false;
    }

    // Work and earn money
    work() {
        if (!this.player.currentJob) return 0;
        
        const earnings = this.player.currentJob.salary;
        this.player.money += earnings;
        this.player.age += 0.3; // Work takes time
        this.saveGame();
        return earnings;
    }

    // Get available jobs for player
    getAvailableJobs() {
        return getAvailableJobs(this.player.education);
    }

    // Get player education display
    getEducationDisplay() {
        return getEducationDisplay(this.player.education);
    }

    // Save game to localStorage
    saveGame() {
        const saveData = {
            player: this.player,
            currentTest: this.currentTest,
            version: '1.0'
        };
        localStorage.setItem('lifeSimulatorSave', JSON.stringify(saveData));
    }

    // Load game from localStorage
    loadGame() {
        const saveData = localStorage.getItem('lifeSimulatorSave');
        if (saveData) {
            try {
                const parsed = JSON.parse(saveData);
                this.player = parsed.player;
                this.currentTest = parsed.currentTest;
                return true;
            } catch (error) {
                console.error('Failed to load save data:', error);
                return false;
            }
        }
        return false;
    }

    // Export save data as JSON
    exportSave() {
        const saveData = {
            player: this.player,
            currentTest: this.currentTest,
            version: '1.0',
            exportDate: new Date().toISOString()
        };
        return JSON.stringify(saveData, null, 2);
    }

    // Import save data from JSON
    importSave(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.player && data.version) {
                this.player = data.player;
                this.currentTest = data.currentTest;
                this.saveGame();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to import save data:', error);
            return false;
        }
    }

    // Reset game
    resetGame() {
        localStorage.removeItem('lifeSimulatorSave');
        this.player = {
            name: '',
            age: 18,
            money: 1000,
            education: {
                highSchool: false,
                associate: false,
                bachelor: false
            },
            currentJob: null,
            testResults: [],
            studyTime: 0,
            testProgress: {
                science: { level: 1, passed: false },
                math: { level: 1, passed: false },
                history: { level: 1, passed: false },
                medicine: { level: 1, passed: false },
                law: { level: 1, passed: false }
            }
        };
        this.currentTest = null;
    }

    // Get study guide for subject
    getStudyGuide(subject) {
        return studyGuides[subject] || null;
    }

    // Work and earn money (for employed players)
    work() {
        if (this.player.currentJob) {
            const earnings = this.player.currentJob.salary;
            this.player.money += earnings;
            this.player.age += 0.3; // Work takes time
            this.saveGame();
            return earnings;
        }
        return 0;
    }
}

export default Game;
