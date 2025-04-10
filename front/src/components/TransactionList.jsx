import React, { useState, useEffect } from 'react';

function TransactionList({ transactions, onDeleteTransaction }) {
    const [latestId, setLatestId] = useState(null);

    useEffect(() => {
        if (transactions.length > 0) {
            const newest = transactions[0].id;
            setLatestId(newest);
        }
    }, [transactions]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount);
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('ru-RU').format(new Date(date));
    };

    return (
        <div>
            <h2>Список транзакций</h2>

            {transactions.length === 0 && <p>Пока нет транзакций 🎉</p>}

            <ul className="transaction-list">
                {transactions.map(transaction => (
                    <li
                        key={transaction.id}
                        data-id={transaction.id}
                        className={`transaction-item ${transaction.id === latestId ? 'new-transaction' : ''}`}
                    >
                        <div>
                            {formatDate(transaction.date)} — [{transaction.category}] {transaction.description}: {formatCurrency(transaction.amount)} {transaction.isIncome ? '(Доход)' : '(Расход)'}
                        </div>
                        <button
                            onClick={() => onDeleteTransaction(transaction.id)}
                            style={{ marginLeft: '10px' }}
                        >
                            🗑️
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TransactionList;
