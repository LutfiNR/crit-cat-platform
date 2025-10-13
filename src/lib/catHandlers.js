export const calculateNewTheta = (itemDifficulty) => {
  const D = 1.7;
  const AI = 1;
  const CI = 0;
  const temp = 0.5 * (1 + Math.sqrt(1 + 8 * CI))
  const tempLNresult = Math.log(temp);
  const newTheta = itemDifficulty + (1 / (D * AI) * tempLNresult);
  return newTheta;
};

export const calculateScore = (tier1Correct, tier2Correct) => {
  if (tier1Correct && tier2Correct) return 4;
  if (!tier1Correct && tier2Correct) return 3;
  if (tier1Correct && !tier2Correct) return 2;
  return 1;
};

export const calculateCorrectProbability = (score, theta, bi1, bi2, bi3) => {
  const temp1 = (theta - bi1);
  const temp2 = (theta - bi2);
  const temp3 = (theta - bi3);
  const pCorrect0 = 1 / (1 + Math.exp(temp1) + Math.exp((temp1 + temp2)) + Math.exp((temp1 + temp2 + temp3)));
  const pCorrect1 = Math.exp(temp1) / (1 + Math.exp(temp1) + Math.exp((temp1 + temp2)) + Math.exp((temp1 + temp2 + temp3)));
  const pCorrect2 = Math.exp(temp1 + temp2) / (1 + Math.exp(temp1) + Math.exp((temp1 + temp2)) + Math.exp((temp1 + temp2 + temp3)));
  const pCorrect3 = Math.exp(temp1 + temp2 + temp3) / (1 + Math.exp(temp1) + Math.exp((temp1 + temp2)) + Math.exp((temp1 + temp2 + temp3)));
  let pCorrect;
  switch (score) {
    case 1:
      pCorrect = pCorrect0;
      break;
    case 2:
      pCorrect = pCorrect1;
      break;
    case 3:
      pCorrect = pCorrect2;
      break;
    case 4:
      pCorrect = pCorrect3;
      break;
    default:
      pCorrect = 0;
  }
  return { pCorrect, pCorrect0, pCorrect1, pCorrect2, pCorrect3 };
}
export const calculcateWrongProbability = (pCorrect) => {
  return 1 - pCorrect;
};

export const calculateInformationItem = (pCorrect, qWrong) => {
  const informationItem = pCorrect * qWrong;
  return informationItem;
}

export const calculateStandardError = (allInformationItem) => {
  const totalInformation = allInformationItem.reduce((sum, info) => sum + info, 0);
  const standardError = 1 / Math.sqrt(totalInformation);
  return standardError;
};

export const calculateDifferenceSE = (oldSE, newSE) => {
  const differenceSE = Math.abs(oldSE - newSE);
  return differenceSE;
};

const CAT_Engine = { calculateScore, calculateNewTheta, calculateStandardError, calculateCorrectProbability, calculcateWrongProbability, calculateInformationItem, calculateDifferenceSE };
export default CAT_Engine;