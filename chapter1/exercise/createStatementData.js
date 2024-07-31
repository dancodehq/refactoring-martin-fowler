import plays from './plays.json' with { type: 'json' }

class PerformanceCalculator {
    constructor(performance, play) {
        this.performance = performance;
        this.play = play;
    }

    get amount() {
        throw new Error('subclass responsibility');
    }

    get volumeCredits() {
        return Math.max(this.performance.audience - 30, 0);
    }
}

class TragedyCalculator extends PerformanceCalculator {
    get amount() {
        let amount = 40000;
        if (this.performance.audience > 30) {
            amount += 1000 * (this.performance.audience - 30);
        }
        return amount;
    }
}

class ComedyCalculator extends PerformanceCalculator {
    get amount() {
        let amount = 30000;
        if (this.performance.audience > 20) {
            amount += 10000 + 500 * (this.performance.audience - 20);
        }
        amount += 300 * this.performance.audience;
        return amount;
    }

    get volumeCredits() {
        return super.volumeCredits + Math.floor(this.performance.audience / 5);
    }
}

function playFor(perf) {
    return plays[perf.playID];
}

function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
}

function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
}

function createPerformanceCalculator(performance, play) {
    switch (play.type) {
        case "tragedy": return new TragedyCalculator(performance, play);
        case "comedy": return new ComedyCalculator(performance, play);
        default:
            throw new Error(`unknown type: ${play.type}`);
    }
}

function enrichPerformance(performance) {
    const calculator = createPerformanceCalculator(performance, playFor(performance));
    const result = Object.assign({}, performance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
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