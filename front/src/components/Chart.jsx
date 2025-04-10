import React, { useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#4caf50', '#f44336', '#2196f3', '#ff9800', '#9c27b0', '#00bcd4', '#8bc34a', '#ffc107'];

const Chart = ({ transactions }) => {
    const [filter, setFilter] = useState('all');

    const filteredTransactions = transactions.filter((transaction) => {
        if (filter === 'income') return transaction.isIncome;
        if (filter === 'expense') return !transaction.isIncome;
        return true;
    });

    const categoryTotals = filteredTransactions.reduce((acc, transaction) => {
        const category = transaction.category || 'Без категории';
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += transaction.amount;
        return acc;
    }, {});

    const data = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value,
    }));

    if (data.length === 0) {
        return <p style={{ textAlign: 'center' }}>Нет данных для отображения графика.</p>;
    }

    return (
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2>График по категориям</h2>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setFilter('all')} style={{ marginRight: '10px' }}>
                    Все
                </button>
                <button onClick={() => setFilter('income')} style={{ marginRight: '10px' }}>
                    Доходы
                </button>
                <button onClick={() => setFilter('expense')}>
                    Расходы
                </button>
            </div>

            {/* ResponsiveContainer сделает адаптацию */}
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;
