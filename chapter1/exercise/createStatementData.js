import plays from './plays.json' with { type: 'json' }

class PerformanceCalculator {
    constructor(performance, play) {
        this.performance = performance;
        this.play = play;
    }
}

function amountFor(performance) {
    let amount = 0;
    switch (performance.play.type) {
        case "tragedy":
            amount = 40000;
            if (performance.audience > 30) {
                amount += 1000 * (performance.audience - 30);
            }
            break;
        case "comedy":
            amount = 30000;
            if (performance.audience > 20) {
                amount += 10000 + 500 * (performance.audience - 20);
            }
            amount += 300 * performance.audience;
            break;
        default:
            throw new Error(`unknown type: ${performance.play.type}`);
    }
    return amount;
}

function playFor(perf) {
    return plays[perf.playID];
}

function volumeCreditsFor(performance) {
    let volumeCredits = 0;
    volumeCredits += Math.max(performance.audience - 30, 0);
    if ("comedy" === performance.play.type) {
        volumeCredits += Math.floor(performance.audience / 5);
    }
    return volumeCredits;
}

function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
}

function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
}

function enrichPerformance(performance) {
    const calculator = new PerformanceCalculator(performance, playFor(performance));
    const result = Object.assign({}, performance);
    result.play = calculator.play;
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
}

export function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;
}