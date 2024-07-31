import { createStatementData } from "./createStatementData.js";

export function statement(invoice, plays) {

    function usd(number) {
        return new Intl.NumberFormat("en-US",
            {
                style: "currency", currency: "USD",
                minimumFractionDigits: 2
            }).format(number / 100);
    }    

    function renderPlainText(data) {
        let text = `Statement for ${data.customer}\n`;
    
        for (let perf of data.performances) {
            // print line for this order
            text += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`;
        }
    
        text += `Amount owed is ${usd(data.totalAmount)}\n`;
        text += `You earned ${data.totalVolumeCredits} credits\n`;
        return text;
    }

    return renderPlainText(createStatementData(invoice, plays));
}