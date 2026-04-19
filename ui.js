// UI Controller for handling all interface interactions
export default class UIController {
    constructor(game) {
        this.game = game;
        this.initializeEventListeners();
        this.updateDisplay();
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Action buttons
        document.getElementById('take-test-btn').addEventListener('click', () => this.showTestSection());
        document.getElementById('apply-jobs-btn').addEventListener('click', () => this.showJobsSection());
        document.getElementById('study-btn').addEventListener('click', () => this.handleStudy());

        // Test section
        document.getElementById('submit-test-btn').addEventListener('click', () => this.submitTest());

        // Save/Load controls
        document.getElementById('save-btn').addEventListener('click', () => this.saveGame());
        document.getElementById('load-btn').addEventListener('click', () => this.loadGame());
        document.getElementById('export-btn').addEventListener('click', () => this.exportSave());
        document.getElementById('import-btn').addEventListener('click', () => this.triggerImport());
        document.getElementById('import-file').addEventListener('change', (e) => this.importSave(e));

        // Initialize player name if new game
        if (!this.game.player.name) {
            this.showNameDialog();
        }
    }

    // Show name dialog for new game
    showNameDialog() {
        const name = prompt('Welcome to Life Simulator! Please enter your character name:');
        if (name && name.trim()) {
            this.game.newGame(name.trim());
            this.updateDisplay();
        }
    }

    // Update all display elements
    updateDisplay() {
        const player = this.game.player;
        
        document.getElementById('player-name').textContent = player.name || 'Unnamed';
        document.getElementById('player-age').textContent = Math.floor(player.age);
        document.getElementById('player-money').textContent = `$${player.money.toLocaleString()}`;
        document.getElementById('player-education').textContent = this.game.getEducationDisplay();
        document.getElementById('player-job').textContent = player.currentJob ? player.currentJob.title : 'Unemployed';
    }

    // Select subject
    selectSubject(subject) {
        // Update button states
        document.querySelectorAll('.subject-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-subject') === subject);
        });

        // Show study guide for selected subject
        this.showStudyGuide(subject);

        // Start test for selected subject
        this.game.startTest(subject);
        this.showTestSection();
        this.updateTestProgress();
    }

    // Show study guide
    showStudyGuide(subject) {
        this.hideAllSections();
        document.getElementById('study-section').classList.remove('hidden');
        
        const studyGuide = this.game.getStudyGuide(subject);
        const studyGuideContent = document.getElementById('study-guide-content');
        
        if (studyGuide) {
            studyGuideContent.innerHTML = `
                <h3>${studyGuide.title}</h3>
                <div class="study-guide-content">
                    ${studyGuide.content}
                </div>
            `;
        } else {
            studyGuideContent.innerHTML = '<p>No study guide available for this subject.</p>';
        }
    }

    // Show test section with progress
    showTestSection() {
        this.hideAllSections();
        document.getElementById('test-section').classList.remove('hidden');
        
        const currentTest = this.game.currentTest;
        if (!currentTest) return;

        const question = this.game.getCurrentQuestion();
        if (!question) return;

        // Update test progress
        this.updateTestProgress();

        // Display current question
        document.getElementById('test-question').innerHTML = `
            <strong>Question ${currentTest.currentQuestionIndex + 1} of ${currentTest.questions.length}</strong><br>
            <span class="question-text">${question.question}</span>
        `;

        // Clear previous results
        document.getElementById('test-result').innerHTML = '';
        document.getElementById('test-answer').value = '';
        document.getElementById('test-answer').focus();
    }

    // Update test progress bar
    updateTestProgress() {
        const currentTest = this.game.currentTest;
        if (!currentTest) return;

        const progress = (currentTest.currentQuestionIndex / currentTest.questions.length) * 100;
        document.getElementById('test-progress-fill').style.width = `${progress}%`;
        document.getElementById('test-progress-text').textContent = `Question ${currentTest.currentQuestionIndex + 1} of ${currentTest.questions.length}`;
    }

    // Submit test answer
    submitTestAnswer() {
        const answerInput = document.getElementById('test-answer');
        const userAnswer = answerInput.value.trim();
        
        if (!userAnswer) {
            alert('Please enter an answer!');
            return;
        }

        const result = this.game.submitTestAnswer(userAnswer);
        this.displayTestResult(result);
        
        // Auto-advance if test is complete
        if (this.game.currentTest.currentQuestionIndex >= this.game.currentTest.questions.length) {
            setTimeout(() => {
                this.showTestResult();
            }, 1500);
        }
    }

    // Display test result
    displayTestResult(result) {
        const resultDiv = document.getElementById('test-result');
        
        let message = `<h3>Test Result</h3>`;
        message += `<p>Score: ${result.score}%</p>`;
        message += `<p>Correct Answers: ${result.correctAnswers} out of ${result.totalQuestions}</p>`;
        
        if (result.passed) {
            message += `<h4>🎉 Congratulations! You passed!</h4>`;
            if (result.newDegrees.length > 0) {
                message += `<h5>New Degrees Earned:</h5>`;
                result.newDegrees.forEach(degree => {
                    message += `<p>🎓 ${degree.name}</p>`;
                });
            }
            message += `<p>You can now apply for better jobs!</p>`;
        } else {
            message += `<h4>❌ You did not pass. Need 6+ correct answers.</h4>`;
            message += `<p>Keep studying and try again!</p>`;
        }
        
        resultDiv.innerHTML = message;
        resultDiv.className = result.passed ? 'success' : 'failure';
    }

    // Show final test result
    showTestResult() {
        const currentTest = this.game.currentTest;
        if (!currentTest) return;

        const correctAnswers = currentTest.answers.filter(a => a.isCorrect).length;
        const totalQuestions = currentTest.questions.length;
        const passed = correctAnswers >= 6;

        const result = {
            passed: passed,
            score: Math.round((correctAnswers / totalQuestions) * 100),
            correctAnswers: correctAnswers,
            totalQuestions: totalQuestions
        };

        const resultDiv = document.getElementById('test-result');
        
        let message = `<h3>Final Test Result</h3>`;
        message += `<p>Score: ${result.score}%</p>`;
        message += `<p>Correct Answers: ${result.correctAnswers} out of ${result.totalQuestions}</p>`;
        
        if (result.passed) {
            message += `<h4>🎉 Congratulations! You passed!</h4>`;
            if (this.game.player.testProgress[currentTest.subject].level === 1) {
                message += `<p>You've passed the first test! You can now take the second test.</p>`;
            } else {
                message += `<p>You've passed the second test! Great job!</p>`;
            }
        } else {
            message += `<h4>❌ You did not pass. Need 6+ correct answers.</h4>`;
            message += `<p>Keep studying and try again!</p>`;
        }
        
        resultDiv.innerHTML = message;
        resultDiv.className = result.passed ? 'success' : 'failure';
    }

    // Show jobs section
    showJobsSection() {
        this.hideAllSections();
        document.getElementById('jobs-section').classList.remove('hidden');
        this.displayJobs();
    }

    // Hide all sections
    hideAllSections() {
        document.getElementById('subject-selection').classList.add('hidden');
        document.getElementById('study-section').classList.add('hidden');
        document.getElementById('test-section').classList.add('hidden');
        document.getElementById('jobs-section').classList.add('hidden');
    }

    // Display available jobs
    displayJobs() {
        const availableJobs = this.game.getAvailableJobs();
        const jobsList = document.getElementById('jobs-list');
        
        if (availableJobs.length === 0) {
            jobsList.innerHTML = '<p>No jobs available. Take some tests to earn degrees!</p>';
            return;
        }

        jobsList.innerHTML = '';
        availableJobs.forEach(job => {
            const hasCurrentJob = this.game.player.currentJob && this.game.player.currentJob.id === job.id;
            
            const jobDiv = document.createElement('div');
            jobDiv.className = 'job-item';
            jobDiv.innerHTML = `
                <div class="job-info">
                    <h3>${job.title}</h3>
                    <p>${job.description}</p>
                    ${job.requiredDegree ? `<p><strong>Requires:</strong> ${this.getDegreeName(job.requiredDegree)}</p>` : '<p><strong>No education required</strong></p>'}
                </div>
                <div class="job-salary">$${job.salary.toLocaleString()}/month</div>
                <button class="apply-btn" ${hasCurrentJob ? 'disabled' : ''} onclick="ui.applyForJob('${job.id}')">
                    ${hasCurrentJob ? 'Current Job' : 'Apply'}
                </button>
            `;
            
            jobsList.appendChild(jobDiv);
        });
    }

    // Get degree name
    getDegreeName(degreeKey) {
        const degreeNames = {
            highSchool: 'High School Diploma',
            associate: "Associate's Degree",
            bachelor: "Bachelor's Degree"
        };
        return degreeNames[degreeKey] || 'Unknown';
    }

    // Save game
    saveGame() {
        this.game.saveGame();
        alert('Game saved successfully!');
    }

    // Load game
    loadGame() {
        const success = this.game.loadGame();
        if (success) {
            this.updateDisplay();
            alert('Game loaded successfully!');
        } else {
            alert('No saved game found!');
        }
    }

    // Export save
    exportSave() {
        const saveData = this.game.exportSave();
        const blob = new Blob([saveData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `life-simulator-save-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Save file exported successfully!');
    }

    // Trigger import
    triggerImport() {
        document.getElementById('import-file').click();
    }

    // Import save
    importSave(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const success = this.game.importSave(e.target.result);
            if (success) {
                this.updateDisplay();
                alert('Save file imported successfully!');
            } else {
                alert('Failed to import save file. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }

    // Apply for job
    applyForJob(jobId) {
        const success = this.game.applyForJob(jobId);
        if (success) {
            this.updateDisplay();
            this.displayJobs();
            alert(`Congratulations! You got the job as ${this.game.player.currentJob.title} with a salary of $${this.game.player.currentJob.salary.toLocaleString()}/month!`);
        } else {
            alert('Sorry, your application was not successful. Keep studying and try again!');
        }
    }
}
