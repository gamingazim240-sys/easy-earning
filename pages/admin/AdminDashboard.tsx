import { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, color, link }: { title: string; value: string | number; icon: string; color: string; link?: string }) => {
  const CardContent = () => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center justify-between h-full">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl md:text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color} flex-shrink-0`}>
        <i className={`${icon} text-white fa-lg`}></i>
      </div>
    </div>
  );
  
  return link ? <Link to={link} className="block hover:scale-105 transform transition-transform duration-200"><CardContent /></Link> : <CardContent />;
};

const AdminDashboard = () => {
  const { users, jobs, transactions, jobSubmissions } = useData();
  
  const pendingDeposits = useMemo(() => transactions.filter(tx => tx.type === 'deposit' && tx.status === 'pending').length, [transactions]);
  const pendingWithdrawals = useMemo(() => transactions.filter(tx => tx.type === 'withdrawal' && tx.status === 'pending').length, [transactions]);
  const pendingSubmissions = useMemo(() => jobSubmissions.filter(s => s.status === 'pending').length, [jobSubmissions]);

  const recentActivities = useMemo(() => {
    const newUsers = users
        .filter(u => !u.isAdmin)
        .map(u => ({ type: 'signup' as const, date: new Date(u.joined), message: `${u.name} has registered.`, link: '/admin/users' }));

    const newDeposits = transactions
        .filter(tx => tx.type === 'deposit')
        .map(tx => ({ type: 'deposit' as const, date: new Date(tx.date), message: `${tx.userName} made a deposit of ৳${tx.amount}.`, link: '/admin/deposits' }));

    const newSubmissions = jobSubmissions
        .map(s => ({ type: 'submission' as const, date: new Date(s.submittedDate), message: `${s.userName} submitted proof for "${s.jobTitle}".`, link: '/admin/submissions' }));

    return [...newUsers, ...newDeposits, ...newSubmissions]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 7);
  }, [users, transactions, jobSubmissions]);

  const activityIconMap = {
      signup: { icon: 'fa-user-plus', color: 'bg-blue-500' },
      deposit: { icon: 'fa-arrow-down-to-bracket', color: 'bg-green-500' },
      submission: { icon: 'fa-clipboard-check', color: 'bg-yellow-500' },
  };


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={users.filter(u => !u.isAdmin).length} icon="fa-solid fa-users" color="bg-blue-500" link="/admin/users" />
        <StatCard title="Active Jobs" value={jobs.length} icon="fa-solid fa-briefcase" color="bg-green-500" link="/admin/jobs" />
        <StatCard title="Pending Deposits" value={pendingDeposits} icon="fa-solid fa-arrow-down-to-bracket" color="bg-yellow-500" link="/admin/deposits" />
        <StatCard title="Pending Withdrawals" value={pendingWithdrawals} icon="fa-solid fa-arrow-up-from-bracket" color="bg-red-500" link="/admin/withdrawals" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <StatCard title="Pending Submissions" value={pendingSubmissions} icon="fa-solid fa-hourglass-half" color="bg-indigo-500" link="/admin/submissions" />
         <StatCard title="Total Transactions" value={transactions.length} icon="fa-solid fa-exchange-alt" color="bg-pink-500" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="font-bold text-lg mb-4 text-gray-800">Recent Activity</h3>
        <ul className="space-y-1">
            {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
                <li key={index}>
                    <Link to={activity.link} className="flex items-start space-x-4 p-3 hover:bg-slate-50 rounded-lg">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activityIconMap[activity.type].color} flex-shrink-0`}>
                            <i className={`fa-solid ${activityIconMap[activity.type].icon} text-white`}></i>
                        </div>
                        <div>
                            <p className="text-sm text-gray-700">{activity.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{activity.date.toLocaleString()}</p>
                        </div>
                    </Link>
                </li>
            )) : <p className="text-center text-sm text-gray-500 p-4">No recent activity.</p>}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
