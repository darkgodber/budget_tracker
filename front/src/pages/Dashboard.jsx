import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { Pie } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, LineElement, PointElement, CategoryScale, LinearScale);

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState('income');
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const [showToast, setShowToast] = useState(false);
    const [lastDeleted, setLastDeleted] = useState(null);

    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Загружаем транзакции с сервера
    useEffect(() => {
        api.get('/transactions')
            .then(response => setTransactions(response.data))
            .catch(error => console.error('Ошибка при загрузке транзакций:', error));
    }, []);

    const handleAddTransaction = (newTransaction) => {
        setTransactions(prev => [...prev, newTransaction]);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const handleDeleteTransaction = (id) => {
        const transactionToDelete = transactions.find(t => t.id === id);
        if (transactionToDelete) {
            setLastDeleted(transactionToDelete);
            api.delete(`/transactions/${id}`)
                .then(() => setTransactions(prev => prev.filter(t => t.id !== id)))
                .catch(error => console.error('Ошибка при удалении транзакции:', error));
        }
    };

    const handleUndoDelete = () => {
        if (lastDeleted) {
            api.post('/transactions', lastDeleted)
                .then(response => {
                    setTransactions(prev => [...prev, response.data]);
                    setLastDeleted(null);
                })
                .catch(error => console.error('Ошибка при восстановлении транзакции:', error));
        }
    };

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(transactions.map(t => ({
            Дата: new Date(t.date).toLocaleDateString(),
            Категория: t.category,
            Описание: t.description,
            Сумма: t.amount,
            Тип: t.isIncome ? 'Доход' : 'Расход',
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Транзакции');
        XLSX.writeFile(workbook, 'Отчет.xlsx');
    };

    // Фильтрация и сортировка транзакций
    const filteredTransactions = transactions
        .filter(t => {
            if (filter === 'all') return true;
            if (filter === 'income') return t.isIncome;
            if (filter === 'expense') return !t.isIncome;
            return true;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Сортировка только для списка

    // Данные для линейного графика (сортировка по возрастанию дат)
    const transactionsForChart = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date)); // Сортировка для графика

    // Общий баланс
    const totalBalance = transactions.reduce((acc, t) => t.isIncome ? acc + t.amount : acc - t.amount, 0);

    // Данные для кругового графика (по категориям)
    const categoriesData = filteredTransactions.reduce((acc, transaction) => {
        const category = transaction.category;
        if (!acc[category]) {
            acc[category] = { income: 0, expense: 0 };
        }
        if (transaction.isIncome) {
            acc[category].income += transaction.amount;
        } else {
            acc[category].expense += transaction.amount;
        }
        return acc;
    }, {});

    // Разнообразие цветов для доходов и расходов
    const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    const chartData = {
        labels: Object.keys(categoriesData),
        datasets: [
            {
                label: 'Доходы и Расходы по категориям',
                data: Object.values(categoriesData).map(item => item.income + item.expense),
                backgroundColor: Object.keys(categoriesData).map(() => randomColor()), // Генерируем случайные цвета
                hoverOffset: 4,
            },
        ],
    };

    // Данные для линейного графика (по датам)
    const transactionsByDate = transactionsForChart.reduce((acc, transaction) => {
        const date = new Date(transaction.date).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = { income: 0, expense: 0 };
        }
        transaction.isIncome
            ? acc[date].income += transaction.amount
            : acc[date].expense += transaction.amount;
        return acc;
    }, {});

    const lineChartData = {
        labels: Object.keys(transactionsByDate),
        datasets: [
            {
                label: 'Доходы',
                data: Object.values(transactionsByDate).map(item => item.income),
                fill: false,
                borderColor: '#4CAF50',
                tension: 0.1,
            },
            {
                label: 'Расходы',
                data: Object.values(transactionsByDate).map(item => item.expense),
                fill: false,
                borderColor: '#F44336',
                tension: 0.1,
            },
        ],
    };

    return (
        <div className="container">
            <header>
                <div className="theme-switch-wrapper">
                    <label className="theme-switch">
                        <input
                            type="checkbox"
                            onChange={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
                            checked={theme === 'dark'}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
                <h1>Система учета бюджета</h1>
                <h2>Баланс: {totalBalance.toLocaleString()} ₽</h2>
            </header>

            {showToast && <div className="toast">Транзакция добавлена ✅</div>}
            {lastDeleted && (
                <div className="toast">
                    Транзакция удалена 🗑️
                    <button onClick={handleUndoDelete} style={{ marginLeft: '10px' }}>
                        Отменить удаление
                    </button>
                </div>
            )}

            <section className="charts-section">
                <div className="charts-container">
                    <div className="pie-chart">
                        <h3>Доходы и Расходы по категориям</h3>
                        <Pie data={chartData} />
                    </div>
                    <div className="line-chart">
                        <h3>Динамика по датам</h3>
                        <Line data={lineChartData} />
                    </div>
                </div>
            </section>

            <section className="main-content centered-content">
                <div className="filter-buttons">
                    <button onClick={() => setFilter('income')}>
                        Доходы ({transactions.filter(t => t.isIncome).length})
                    </button>
                    <button onClick={() => setFilter('expense')}>
                        Расходы ({transactions.filter(t => !t.isIncome).length})
                    </button>
                    <button onClick={handleExportExcel} style={{ marginLeft: '10px' }}>
                        Экспорт в Excel
                    </button>
                </div>
                <TransactionForm onAddTransaction={handleAddTransaction} />
                <TransactionList
                    transactions={filteredTransactions}
                    onDeleteTransaction={handleDeleteTransaction}
                />
            </section>
        </div>
    );
};

export default Dashboard;
