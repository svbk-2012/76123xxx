// Degree system for educational progression
export const degrees = {
    highSchool: {
        name: "High School Diploma",
        requiredTestScore: 60,
        description: "Basic high school education"
    },
    associate: {
        name: "Associate's Degree", 
        requiredTestScore: 75,
        description: "Two-year college degree"
    },
    bachelor: {
        name: "Bachelor's Degree",
        requiredTestScore: 85,
        description: "Four-year college degree"
    }
};

// Check if player qualifies for a degree
export function checkDegreeQualification(testScore, currentDegrees) {
    const newDegrees = [];
    
    if (!currentDegrees.highSchool && testScore >= degrees.highSchool.requiredTestScore) {
        newDegrees.push('highSchool');
    }
    
    if (!currentDegrees.associate && testScore >= degrees.associate.requiredTestScore) {
        newDegrees.push('associate');
    }
    
    if (!currentDegrees.bachelor && testScore >= degrees.bachelor.requiredTestScore) {
        newDegrees.push('bachelor');
    }
    
    return newDegrees;
}

// Get education level display text
export function getEducationDisplay(degrees) {
    if (degrees.bachelor) return "Bachelor's Degree";
    if (degrees.associate) return "Associate's Degree";
    if (degrees.highSchool) return "High School Diploma";
    return "None";
}
