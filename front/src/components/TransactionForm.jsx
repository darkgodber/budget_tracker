import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const TransactionForm = ({ onAddTransaction }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [isIncome, setIsIncome] = useState(true);
    const [category, setCategory] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!description || !amount || !category) {
            toast.error('Пожалуйста, заполните все поля!');
            return;
        }

        try {
            const response = await api.post('/transactions', {
                description,
                amount: parseFloat(amount),
                isIncome,
                date: new Date().toISOString(),
                category
            });

            onAddTransaction(response.data);

            toast.success('Транзакция успешно добавлена!');

            // Очистим форму после отправки
            setDescription('');
            setAmount('');
            setIsIncome(true);
            setCategory('');
        } catch (error) {
            console.error('Ошибка при добавлении транзакции:', error);
            toast.error('Ошибка при добавлении транзакции!');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <input
                type="text"
                placeholder="Наименование"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Сумма"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Категория"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label>
                    <input
                        type="radio"
                        name="transactionType"
                        value="income"
                        checked={isIncome}
                        onChange={() => setIsIncome(true)}
                    />
                    Доход
                </label>
                <label>
                    <input
                        type="radio"
                        name="transactionType"
                        value="expense"
                        checked={!isIncome}
                        onChange={() => setIsIncome(false)}
                    />
                    Расход
                </label>
            </div>

            <button type="submit">Добавить транзакцию</button>
        </form>
    );
};

export default TransactionForm;
