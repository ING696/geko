const transactions = [
    { id: "T001", info: "  apple.com/bill  ", amount: "1200.50 USD", date: "2023-10-01" },
    { id: "T002", info: "Sberbank Transfer", amount: "5000.00 RUB", date: "2023-10-01" },
    { id: "T003", info: "APPLE.COM/BILL", amount: "1200.50 USD", date: "2023-10-01" },
    { id: "T004", info: " Netflix Subscription ", amount: "15.99 USD", date: "2023-10-02" },
    { id: "T005", info: "Amazon Web Services", amount: "450.00 USD", date: "2023-10-03" },
    { id: "T006", info: "Apple.com/bill", amount: "30.00 USD", date: "2023-10-04" }
];

function normalizeAndClean(transactions) {
    return transactions.map(transaction => {
        const cleanedInfo = transaction.info.trim().toLowerCase();
        const [value, currency] = transaction.amount.split(' ');
        return {
            ...transaction,
            info: cleanedInfo,
            amount: { value: parseFloat(value), currency }
        };
    });
}

function deduplicate(transactions) {
    const uniqueTransactions = [];
    const seen = new Set();

    transactions.forEach(transaction => {
        const identifier = `${transaction.info}-${transaction.amount.value}-${transaction.amount.currency}-${transaction.date}`;
        if (!seen.has(identifier)) {
            seen.add(identifier);
            uniqueTransactions.push(transaction);
        }
    });

    return uniqueTransactions;
}

function convertCurrency(transactions) {
    return transactions.map(transaction => {
        if (transaction.amount.currency === 'RUB') {
            return {
                ...transaction,
                amount: {
                    value: parseFloat((transaction.amount.value / 90).toFixed(2)),
                    currency: 'USD'
                }
            };
        }
        return transaction;
    });
}

function groupByInfo(transactions) {
    return transactions.reduce((acc, transaction) => {
        if (!acc[transaction.info]) {
            acc[transaction.info] = [];
        }
        acc[transaction.info].push(transaction);
        return acc;
    }, {});
}

function calculateTotalUSD(transactions) {
    return transactions.reduce((total, transaction) => {
        if (transaction.amount.currency === 'USD') {
            return total + transaction.amount.value;
        }
        return total;
    }, 0);
}

const cleanedTransactions = normalizeAndClean(transactions);
const uniqueTransactions = deduplicate(cleanedTransactions);
const convertedTransactions = convertCurrency(uniqueTransactions);
const groupedTransactions = groupByInfo(convertedTransactions);
const totalUSD = calculateTotalUSD(convertedTransactions);

console.log("Unique Transactions:", uniqueTransactions);
console.log("Converted Transactions:", convertedTransactions);
console.log("Grouped Transactions:", groupedTransactions);
console.log("Total USD:", totalUSD);