export const calculateScore = (tier1Correct, tier2Correct) => {
  if (tier1Correct && tier2Correct) return 4;
  if (!tier1Correct && tier2Correct) return 3;
  if (tier1Correct && !tier2Correct) return 2;
  return 1;
};

export const calculateCorrectProbability = (theta, itemDifficulty) => {
  return 1 / (1 + Math.exp(-(theta - itemDifficulty)));
};

export const calculcateWrongProbability = (pCorrect) => {
  return 1 - pCorrect;
};

export const calculateResponsePattern = (score) => {
  if (score > 2) return 1;
  return 0;
}

export const calculateNewTheta = (pCorrect, qWrong, responsePattern,) => {
  const temp = 1 -  responsePattern;
  const newTheta = Math.pow(pCorrect, responsePattern) * Math.pow(qWrong, temp);
  return newTheta;
};

export const calculateInformationFunction = (pCorrect,qWrong) => {
  const scaleConstant = 1.7;
  const informationFunction = pCorrect * qWrong * Math.pow(scaleConstant, 2);
  return informationFunction;
}

export const calculateStandardError = (informationFunction) => {
  const standardError = 1 / Math.sqrt(informationFunction);
  return standardError;
};

export const calculateDifferenceSE = (oldSE, newSE) => {
  const differenceSE = Math.abs(oldSE - newSE);
  return differenceSE;
};

const CAT_Engine = { calculateScore, calculateNewTheta, calculateStandardError, calculateCorrectProbability, calculcateWrongProbability, calculateResponsePattern, calculateInformationFunction, calculateDifferenceSE };
export default CAT_Engine;