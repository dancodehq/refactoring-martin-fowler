export function statement(invoice, plays) {

    function amountFor(performance) {
        let amount = 0;
        switch (playFor(performance).type) {
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
                throw new Error(`unknown type: ${playFor(performance).type}`);
        }
        return amount;
    }

    function playFor(perf) {
        return plays[perf.playID];
    }

    function volumeCreditsFor(perf) {
        let volumeCredits = 0;
        volumeCredits += Math.max(perf.audience - 30, 0);
        if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);
        return volumeCredits;
    }

    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format;
    for (let perf of invoice.performances) {
        volumeCredits += volumeCreditsFor(perf);

        // print line for this order
        result += `  ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
        totalAmount += amountFor(perf);
    }
    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}