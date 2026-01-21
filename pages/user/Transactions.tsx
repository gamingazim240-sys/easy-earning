import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Transaction } from '../../types';

const TransactionIcon = ({ type }: { type: Transaction['type'] }) => {
    const iconMap: { [key in Transaction['type']]: { icon: string; color: string } } = {
        'deposit': { icon: 'fa-arrow-down', color: 'text-green-500' },
        'withdrawal': { icon: 'fa-arrow-up', color: 'text-red-500' },
        'job-reward': { icon: 'fa-briefcase', color: 'text-blue-500' },
        'referral-bonus': { icon: 'fa-users', color: 'text-purple-500' },
    };
    const { icon, color } = iconMap[type] || { icon: 'fa-dollar-sign', color: 'text-gray-500' };
    return <i className={`fa-solid ${icon} ${color}`}></i>;
}

const Transactions = () => {
    const { currentUser, transactions } = useData();
    const location = useLocation();
    const successMessage = location.state?.message;

    const userTransactions = useMemo(() => {
        if (!currentUser) return [];
        return transactions
            .filter(tx => tx.userId === currentUser.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [currentUser, transactions]);

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h2>
            
            {successMessage && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md" role="alert">
                    <p className="font-bold">Success!</p>
                    <p>{successMessage}</p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Details</th>
                                <th scope="col" className="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userTransactions.length > 0 ? userTransactions.map(tx => (
                                <tr key={tx.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 flex items-start space-x-4">
                                        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center mt-1">
                                            <TransactionIcon type={tx.type} />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-3 mb-1">
                                                <p className="font-semibold text-gray-800 capitalize">{tx.type.replace('-', ' ')}</p>
                                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${
                                                    tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    tx.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {tx.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleString()}</p>
                                            {tx.details && <p className="text-xs text-gray-400 mt-1 italic">"{tx.details}"</p>}
                                            {tx.status === 'rejected' && tx.rejectionReason && (
                                                <p className="text-xs text-red-600 font-semibold mt-1">Reason: {tx.rejectionReason}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold ${tx.type === 'withdrawal' || tx.status === 'rejected' ? 'text-red-600' : 'text-green-600'}`}>
                                        {tx.type === 'withdrawal' ? '-' : '+'} ৳{tx.amount.toFixed(2)}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={2} className="text-center py-10 text-gray-500">No transactions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
