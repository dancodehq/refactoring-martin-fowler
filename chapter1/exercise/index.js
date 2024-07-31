import { createStatementData } from "./createStatementData.js";

function usd(number) {
    return new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format(number / 100);
}

export function plainTextStatement(invoice, plays) {

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

export function htmlStatement(invoice, plays) {

    function renderHtml(data) {
        let html = `<h1>Statement for ${data.customer}</h1>\n`;
        html += "<table>\n";
        html += "<tr><th>play</th><th>seats</th><th>cost</th></tr>";
        for (let perf of data.performances) {
            html += `  <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
            html += `<td>${usd(perf.amount)}</td></tr>\n`;
        }
        html += "</table>\n";
        html += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
        html += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
        return html;
    }

    return renderHtml(createStatementData(invoice, plays));
}