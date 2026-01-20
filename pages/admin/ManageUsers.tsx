import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { User } from '../../types';

const UserDetailsModal = ({ user, onClose, onSaveWallets, onToggleProJob, onToggleBlockStatus, onToggleWithdrawalFreeze }: { user: User; onClose: () => void; onSaveWallets: (user: User) => void; onToggleProJob: (userId: number, isActive: boolean) => void; onToggleBlockStatus: (userId: number) => void; onToggleWithdrawalFreeze: (userId: number, reason?: string) => void; }) => {
  const { transactions, jobSubmissions } = useData();
  const [wallets, setWallets] = useState(user.wallets);
  const [proJobActive, setProJobActive] = useState(user.proJobActive);
  
  const userTransactions = useMemo(() => transactions.filter(t => t.userId === user.id).slice(0, 5), [transactions, user.id]);
  const userSubmissions = useMemo(() => jobSubmissions.filter(s => s.userId === user.id).slice(0, 5), [jobSubmissions, user.id]);

  const handleSave = () => {
    onSaveWallets({ ...user, wallets });
    onToggleProJob(user.id, proJobActive);
    onClose();
  };

  const handleBlockToggle = () => {
    const action = user.isBlocked ? 'unblock' : 'block';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
        onToggleBlockStatus(user.id);
        onClose();
    }
  }

  const handleFreezeToggle = () => {
    if (user.isWithdrawalBlocked) {
        if(window.confirm('Are you sure you want to unfreeze withdrawals for this user?')) {
            onToggleWithdrawalFreeze(user.id);
            onClose();
        }
    } else {
        const reason = window.prompt('Enter reason for freezing withdrawals:');
        if (reason) {
            onToggleWithdrawalFreeze(user.id, reason);
            onClose();
        }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-0 w-full max-w-2xl">
        <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">Details for {user.name}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><i className="fa-solid fa-xmark fa-lg"></i></button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 border rounded-lg bg-slate-50">
                     <h4 className="font-bold text-gray-700">Wallet Balances</h4>
                     {Object.keys(wallets).map((walletKey) => (
                        <div key={walletKey}>
                        <label className="block text-sm font-semibold text-gray-600 capitalize mb-1">{walletKey.replace(/([A-Z])/g, ' $1')}</label>
                        <input
                            type="number"
                            value={wallets[walletKey as keyof typeof wallets]}
                            onChange={(e) => setWallets({ ...wallets, [walletKey]: parseFloat(e.target.value) || 0 })}
                            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm"
                        />
                        </div>
                    ))}
                </div>
                <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-slate-50">
                        <h4 className="font-bold text-gray-700 mb-2">Pro Job Status</h4>
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="font-semibold text-gray-700">{proJobActive ? 'Active' : 'Inactive'}</span>
                            <div className="relative">
                                <input type="checkbox" checked={proJobActive} onChange={() => setProJobActive(!proJobActive)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                            </div>
                        </label>
                         <p className="text-xs text-gray-500 mt-1">Enable to give this user access to Pro Jobs.</p>
                    </div>
                     <div className="p-4 border rounded-lg bg-slate-50 space-y-3">
                        <div>
                            <h4 className="font-bold text-gray-700 mb-2">Account Login</h4>
                            <button 
                                onClick={handleBlockToggle}
                                className={`w-full font-bold py-2 px-4 rounded-lg text-sm ${user.isBlocked ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                            >
                                {user.isBlocked ? 'Unblock User' : 'Block User'}
                            </button>
                             <p className="text-xs text-gray-500 mt-1">{user.isBlocked ? 'Unblocking will allow the user to log in.' : 'Blocking will prevent the user from logging in.'}</p>
                        </div>
                         <div>
                            <h4 className="font-bold text-gray-700 mb-2">Withdrawal Status</h4>
                            <button 
                                onClick={handleFreezeToggle}
                                className={`w-full font-bold py-2 px-4 rounded-lg text-sm ${user.isWithdrawalBlocked ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}
                            >
                                {user.isWithdrawalBlocked ? 'Unfreeze Withdrawals' : 'Freeze Withdrawals'}
                            </button>
                             <p className="text-xs text-gray-500 mt-1">{user.isWithdrawalBlocked ? `Reason: ${user.withdrawalBlockReason}` : 'User can currently make withdrawals.'}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                 <h4 className="font-bold text-gray-700 mb-2">Recent Transactions</h4>
                 <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="p-2 text-left">Type</th>
                                <th className="p-2 text-left">Amount</th>
                                <th className="p-2 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {userTransactions.length > 0 ? userTransactions.map(tx => (
                                <tr key={tx.id}>
                                    <td className="p-2 capitalize">{tx.type.replace('-', ' ')}</td>
                                    <td className="p-2">৳{tx.amount.toFixed(2)}</td>
                                    <td className="p-2">{new Date(tx.date).toLocaleDateString()}</td>
                                </tr>
                            )) : <tr><td colSpan={3} className="p-2 text-center text-gray-500">No transactions</td></tr>}
                        </tbody>
                    </table>
                 </div>
            </div>
            <div>
                 <h4 className="font-bold text-gray-700 mb-2">Recent Job Submissions</h4>
                 <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>
                                <th className="p-2 text-left">Job Title</th>
                                <th className="p-2 text-left">Status</th>
                                <th className="p-2 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {userSubmissions.length > 0 ? userSubmissions.map(sub => (
                                <tr key={sub.id}>
                                    <td className="p-2">{sub.jobTitle}</td>
                                    <td className="p-2 capitalize">{sub.status}</td>
                                    <td className="p-2">{new Date(sub.submittedDate).toLocaleDateString()}</td>
                                </tr>
                            )) : <tr><td colSpan={3} className="p-2 text-center text-gray-500">No submissions</td></tr>}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-cyan-600 text-white font-bold rounded-md hover:bg-cyan-700">Save Changes</button>
        </div>
      </div>
    </div>
  );
};


const ManageUsers = () => {
  const { users, updateUserBalance, updateUserProJobStatus, toggleUserBlockStatus, toggleUserWithdrawalFreeze } = useData();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSaveWallets = (updatedUser: User) => {
    Object.keys(updatedUser.wallets).forEach(walletKey => {
      const key = walletKey as keyof User['wallets'];
      updateUserBalance(updatedUser.id, key, updatedUser.wallets[key]);
    });
  };

  const filteredUsers = useMemo(() => {
    const nonAdminUsers = users.filter(u => !u.isAdmin);
    if (!searchTerm) return nonAdminUsers;
    
    const lowercasedFilter = searchTerm.toLowerCase();
    return nonAdminUsers.filter(u =>
      u.name.toLowerCase().includes(lowercasedFilter) ||
      u.email.toLowerCase().includes(lowercasedFilter) ||
      u.refId.toLowerCase().includes(lowercasedFilter)
    );
  }, [users, searchTerm]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
        <div className="w-full sm:w-auto max-w-xs">
            <input
                type="text"
                placeholder="Search by name, email, ref ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3">Pro Job</th>
              <th className="px-4 py-3">Job Balance</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                <td className="px-4 py-3">
                   <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.isVerified ? 'Yes' : 'No'}
                  </span>
                </td>
                 <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.proJobActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.proJobActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td className="px-4 py-3">৳{user.wallets.jobBalance.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditingUser(user)} className="font-medium text-cyan-600 hover:underline">
                    View / Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingUser && (
        <UserDetailsModal 
          user={editingUser} 
          onClose={() => setEditingUser(null)} 
          onSaveWallets={handleSaveWallets}
          onToggleProJob={updateUserProJobStatus}
          onToggleBlockStatus={toggleUserBlockStatus}
          onToggleWithdrawalFreeze={toggleUserWithdrawalFreeze}
        />
      )}
    </div>
  );
};

export default ManageUsers;
