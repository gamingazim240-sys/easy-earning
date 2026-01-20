import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { User } from '../../types';

const SendBonus = () => {
    const { users, sendBonusToUser } = useData();
    const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
    const [selectedWallet, setSelectedWallet] = useState<keyof User['wallets']>('jobBalance');
    const [amount, setAmount] = useState<number | ''>('');
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId || !selectedWallet || !amount || amount <= 0) {
            setStatusMessage({ type: 'error', text: 'Please fill all fields correctly.' });
            return;
        }

        const success = sendBonusToUser(Number(selectedUserId), selectedWallet, Number(amount));

        if (success) {
            setStatusMessage({ type: 'success', text: `Successfully sent ৳${amount} to the user's ${selectedWallet} wallet.` });
            setSelectedUserId('');
            setAmount('');
        } else {
            setStatusMessage({ type: 'error', text: 'Failed to send bonus. User not found.' });
        }
    };

    const walletOptions: (keyof User['wallets'])[] = ['jobBalance', 'proJob', 'referral', 'gmail', 'server', 'salary'];

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Bonus / Salary</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select User</label>
                        <select
                            value={selectedUserId}
                            onChange={e => setSelectedUserId(Number(e.target.value))}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="" disabled>-- Choose a user --</option>
                            {users.filter(u => !u.isAdmin).map(user => (
                                <option key={user.id} value={user.id}>{user.name} ({user.refId})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Wallet</label>
                        <select
                            value={selectedWallet}
                            onChange={e => setSelectedWallet(e.target.value as keyof User['wallets'])}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md capitalize"
                            required
                        >
                            {walletOptions.map(wallet => (
                                <option key={wallet} value={wallet}>{wallet.replace(/([A-Z])/g, ' $1')}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount (BDT)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(Number(e.target.value))}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            placeholder="e.g., 100"
                            min="0.01"
                            step="0.01"
                            required
                        />
                    </div>
                    
                    {statusMessage.text && (
                        <p className={`text-sm p-3 rounded-md ${statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {statusMessage.text}
                        </p>
                    )}

                    <button type="submit" className="w-full px-4 py-2 bg-cyan-600 text-white font-bold rounded-md hover:bg-cyan-700 transition">
                        Send Bonus
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SendBonus;
