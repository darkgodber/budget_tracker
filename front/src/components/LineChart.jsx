import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TimeLineChart = ({ transactions }) => {
    // Группируем по дате
    const dailyTotals = transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.date).toLocaleDateString('ru-RU');

        if (!acc[date]) {
            acc[date] = { date, income: 0, expense: 0 };
        }

        if (transaction.isIncome) {
            acc[date].income += transaction.amount;
        } else {
            acc[date].expense += transaction.amount;
        }

        return acc;
    }, {});

    const data = Object.values(dailyTotals).sort((a, b) => new Date(a.date) - new Date(b.date));

    if (data.length === 0) {
        return <p style={{ textAlign: 'center' }}>Нет данных для отображения динамики.</p>;
    }

    return (
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2>Динамика доходов и расходов</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#4caf50" name="Доходы" />
                    <Line type="monotone" dataKey="expense" stroke="#f44336" name="Расходы" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TimeLineChart;
