/**
 * Calculates the final viability score based on persona scores.
 * 
 * @param {Object} personaScores - Object containing scores from all 8 personas
 * @returns {number} The final averaged score (0-100)
 */
const calculateFinalScore = (personaScores) => {
  const scores = Object.values(personaScores);
  
  if (scores.length === 0) return 0;

  const sum = scores.reduce((acc, score) => acc + score, 0);
  const average = sum / scores.length;
  
  return Math.round(average);
};

/**
 * Returns a classification label based on the final score.
 * 0 to 40 weak idea
 * 41 to 70 moderate potential
 * 71 to 100 strong startup potential
 */
const classifyScore = (score) => {
  if (score <= 40) return 'Weak Idea';
  if (score <= 70) return 'Moderate Potential';
  return 'Strong Startup Potential';
};

module.exports = {
  calculateFinalScore,
  classifyScore
};
