import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Transaction } from '../../types';


const RejectionModal = ({ transaction, onClose, onConfirm }: { transaction: Transaction; onClose: () => void; onConfirm: (id: number, reason: string) => void; }) => {
    const [reason, setReason] = useState('');
    const [customReason, setCustomReason] = useState('');

    const predefinedReasons = [
        "Incomplete Info",
        "Security Check Failed",
        "Withdrawal outside allowed dates",
    ];

    const handleConfirm = () => {
        const finalReason = reason === 'custom' ? customReason : reason;
        if (!finalReason) {
            alert('Please select or provide a reason.');
            return;
        }
        onConfirm(transaction.id, finalReason);
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold mb-4">Reject Withdrawal</h3>
                <p className="text-sm mb-2">Select a reason for rejecting the withdrawal request for <span className="font-bold">{transaction.userName}</span>.</p>
                <div className="space-y-3">
                    <select value={reason} onChange={e => setReason(e.target.value)} className="w-full p-2 border rounded">
                        <option value="" disabled>-- Select a reason --</option>
                        {predefinedReasons.map(r => <option key={r} value={r}>{r}</option>)}
                        <option value="custom">Other (Specify)</option>
                    </select>
                    {reason === 'custom' && (
                        <input
                            type="text"
                            value={customReason}
                            onChange={e => setCustomReason(e.target.value)}
                            placeholder="Enter custom reason"
                            className="w-full p-2 border rounded"
                        />
                    )}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleConfirm} className="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700">Confirm Rejection</button>
                </div>
            </div>
        </div>
    );
};


const ManageWithdrawals = () => {
  const { transactions, updateTransactionStatus } = useData();
  const [rejectionTarget, setRejectionTarget] = useState<Transaction | null>(null);
  const withdrawals = transactions.filter(tx => tx.type === 'withdrawal');

  const handleConfirmRejection = (id: number, reason: string) => {
    updateTransactionStatus(id, 'rejected', reason);
    setRejectionTarget(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Withdrawals</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Number</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.length > 0 ? withdrawals.map(tx => (
              <tr key={tx.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-gray-900">{tx.userName}</td>
                <td className="px-4 py-3">৳{tx.amount.toFixed(2)}</td>
                <td className="px-4 py-3 capitalize">{tx.paymentMethod || 'N/A'}</td>
                <td className="px-4 py-3">{tx.withdrawalNumber}</td>
                <td className="px-4 py-3">{new Date(tx.date).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                   <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    tx.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {tx.status === 'pending' && (
                    <div className="space-x-2">
                      <button onClick={() => updateTransactionStatus(tx.id, 'approved')} className="font-medium text-green-600 hover:underline">Approve</button>
                      <button onClick={() => setRejectionTarget(tx)} className="font-medium text-red-600 hover:underline">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            )) : (
               <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">No withdrawal entries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
       {rejectionTarget && <RejectionModal transaction={rejectionTarget} onClose={() => setRejectionTarget(null)} onConfirm={handleConfirmRejection} />}
    </div>
  );
};

export default ManageWithdrawals;
