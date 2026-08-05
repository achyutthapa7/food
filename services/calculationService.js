const ELIGIBLE_CAP = 100;

// Eligible reimbursement = MIN(actual price, cap)
function calculateEligible(actualPrice) {
    const price = Number(actualPrice) || 0;
    return Math.min(price, ELIGIBLE_CAP);
}

module.exports = { calculateEligible, ELIGIBLE_CAP };
