/**
 * Generates SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis
 * based on the persona scores.
 * 
 * @param {Object} personaScores - Scores from the 8 personas
 * @returns {Object} Object containing arrays for strengths, weaknesses, opportunities, threats
 */
const generateSWOT = (personaScores) => {
  const {
    fox_score,
    owl_score,
    shark_score,
    bee_score,
    wolf_score,
    cheetah_score,
    peacock_score,
    eagle_score
  } = personaScores;

  const strengths = [];
  const weaknesses = [];
  const opportunities = [];
  const threats = [];

  // Fox: Logic and problem-solution fit
  if (fox_score > 70) strengths.push('Strong problem-solution alignment in concept');
  else if (fox_score < 50) weaknesses.push('Logic of the solution may be flawed or unclear');

  // Owl: Market size and target audience
  if (owl_score > 75) opportunities.push('Large, well-defined target market identified');
  else if (owl_score < 50) weaknesses.push('Unclear market opportunity or small total addressable market (TAM)');

  // Shark: Monetization and revenue model
  if (shark_score > 75) strengths.push('Clear and viable monetization strategy');
  else if (shark_score < 50) weaknesses.push('Revenue model is unproven or difficult to scale');

  // Bee: Demand signals and customer need
  if (bee_score > 75) strengths.push('High customer pain point and strong demand signals');
  else if (bee_score < 50) threats.push('Lack of burning customer need; nice-to-have product');

  // Wolf: Competitive advantage
  if (wolf_score > 75) strengths.push('Strong competitive moat identified');
  else if (wolf_score < 50) threats.push('Strong existing competition in this space');

  // Cheetah: MVP feasibility and speed to market
  if (cheetah_score > 70) opportunities.push('Fast MVP development and quick time-to-market possible');
  else if (cheetah_score < 50) weaknesses.push('MVP development is complex and time-consuming');

  // Peacock: Branding clarity and storytelling
  if (peacock_score > 75) strengths.push('Compelling brand story and value proposition');
  else if (peacock_score < 50) weaknesses.push('Value proposition is confusing or hard to communicate');

  // Eagle: Long term scalability and industry opportunity
  if (eagle_score > 80) opportunities.push('Massive long-term scalability potential');
  else if (eagle_score < 50) threats.push('Industry headwinds or limited scaling potential');

  // Fallback defaults in case scores are mid-range
  if (strengths.length === 0) strengths.push('Adequate baseline concept');
  if (weaknesses.length === 0) weaknesses.push('No critical flaws identified in initial analysis');
  if (opportunities.length === 0) opportunities.push('Potential for niche market capture');
  if (threats.length === 0) threats.push('Standard execution risks apply');

  return {
    strengths,
    weaknesses,
    opportunities,
    threats
  };
};

module.exports = {
  generateSWOT
};
