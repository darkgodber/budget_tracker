import React, { useState, useEffect } from 'react';
import api from '../services/api';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import * as XLSX from 'xlsx';
import { Pie } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

// Регистрируем необходимые элементы для Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, LineElement, PointElement, CategoryScale, LinearScale);

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState('all');
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const [showToast, setShowToast] = useState(false);
    const [lastDeleted, setLastDeleted] = useState(null);

    // Устанавливаем тему и сохраняем в localStorage
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

    // Добавление новой транзакции
    const handleAddTransaction = (newTransaction) => {
        setTransactions(prev => [...prev, newTransaction]);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    // Удаление транзакции с Undo
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

    // Экспорт в Excel
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

    // Фильтрация транзакций
    const filteredTransactions = transactions
        .filter(t => {
            if (filter === 'all') return true;
            if (filter === 'income') return t.isIncome;
            if (filter === 'expense') return !t.isIncome;
            return true;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Подсчёт общего баланса
    const totalBalance = transactions.reduce((acc, t) => t.isIncome ? acc + t.amount : acc - t.amount, 0);

    // Подготовка данных для кругового графика
    const income = transactions.filter(t => t.isIncome).reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => !t.isIncome).reduce((acc, t) => acc + t.amount, 0);

    const chartData = {
        labels: ['Доходы', 'Расходы'],
        datasets: [
            {
                data: [income, expense],
                backgroundColor: ['#4CAF50', '#F44336'],
                hoverOffset: 4,
            },
        ],
    };

    // Подготовка данных для линейного графика (по датам)
    const transactionsByDate = filteredTransactions.reduce((acc, transaction) => {
        const date = new Date(transaction.date).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = { income: 0, expense: 0 };
        }
        if (transaction.isIncome) {
            acc[date].income += transaction.amount;
        } else {
            acc[date].expense += transaction.amount;
        }
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
            {/* Переключатель темы */}
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

            <h1>Dashboard</h1>
            <h2>Баланс: {totalBalance.toLocaleString()} ₽</h2>

            {showToast && <div className="toast">Транзакция добавлена ✅</div>}
            {lastDeleted && (
                <div className="toast">
                    Транзакция удалена 🗑️
                    <button onClick={handleUndoDelete} style={{ marginLeft: '10px' }}>
                        Отменить удаление
                    </button>
                </div>
            )}

            {/* Круговой график */}
            <div className="pie-chart">
                <h3>Доходы и Расходы</h3>
                <Pie data={chartData} />
            </div>

            {/* Линейный график (по датам) */}
            <div className="line-chart">
                <h3>Динамика по датам</h3>
                <Line data={lineChartData} />
            </div>

            {/* Фильтры и экспорт */}
            <div className="filter-buttons">
                <button onClick={() => setFilter('all')}>
                    Все ({transactions.length})
                </button>
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

            {/* Список транзакций */}
            <TransactionList
                transactions={filteredTransactions}
                onDeleteTransaction={handleDeleteTransaction}
            />

            {/* Форма добавления транзакции */}
            <TransactionForm onAddTransaction={handleAddTransaction} />
        </div>
    );
};

export default Dashboard;
