export function statement(invoice, plays) {

    function enrichPerformance(performance) {
        const result = Object.assign({}, performance);
        result.play = playFor(result);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);

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

    function usd(number) {
        return new Intl.NumberFormat("en-US",
            {
                style: "currency", currency: "USD",
                minimumFractionDigits: 2
            }).format(number / 100);
    }

    function totalVolumeCredits() {
        let volumeCredits = 0;
        for (let perf of statementData.performances) {
            volumeCredits += perf.volumeCredits;
        }
        return volumeCredits;
    }

    function totalAmount() {
        return statementData.performances.reduce((total, p) => total + p.amount, 0);
    }

    function renderPlainText(data, invoice) {
        let text = `Statement for ${data.customer}\n`;
    
        for (let perf of data.performances) {
            // print line for this order
            text += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
        }
    
        text += `Amount owed is ${usd(data.totalAmount)}\n`;
        text += `You earned ${data.totalVolumeCredits} credits\n`;
        return text;
    }

    return renderPlainText(statementData, invoice);
}