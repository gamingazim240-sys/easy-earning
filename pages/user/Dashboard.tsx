import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Notice } from '../../types';

const NoticeModal = ({ notice, onClose }: { notice: Notice; onClose: () => void; }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">{notice.title}</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            </div>
            <div className="p-6">
                <p className="text-sm text-gray-500 mb-4">Posted on: {new Date(notice.date).toLocaleDateString()}</p>
                <div className="text-gray-700 whitespace-pre-wrap">{notice.content}</div>
            </div>
        </div>
    </div>
);


const WalletCard = ({ icon, title, amount, isCurrency = true }: { icon: string, title: string, amount: number, isCurrency?: boolean }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100 text-cyan-600">
        <i className={`${icon} text-2xl`}></i>
      </div>
      <div>
        <p className="font-bold text-xl text-gray-800">
          {isCurrency && '৳ '}
          {amount.toFixed(isCurrency ? 2 : 0)}
        </p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );
};

const VerificationStatus = () => {
    const { currentUser } = useData();
    if (!currentUser) return null;

    if (currentUser.isVerified && currentUser.verificationDate) {
        const verificationDate = new Date(currentUser.verificationDate);
        const expiryDate = new Date(new Date(currentUser.verificationDate).setDate(verificationDate.getDate() + 30));
        const remainingTime = expiryDate.getTime() - new Date().getTime();
        const remainingDays = Math.max(0, Math.ceil(remainingTime / (1000 * 60 * 60 * 24)));

        return (
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 text-center">
                <i className="fa-solid fa-shield-halved text-4xl text-green-500 mb-2"></i>
                <h2 className="text-xl font-bold text-gray-800">Account Verified</h2>
                <p className="text-gray-600">Your verification is valid for <span className="font-bold text-cyan-600">{remainingDays} more days</span>.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Your Account is Not Verified / আপনার অ্যাকাউন্ট ভেরিফাইড নয়</h2>
          <p className="text-gray-600 mb-4">Please verify to access all features. / অনুগ্রহ করে ভেরিফাই করুন।</p>
          <NavLink to="/user/deposit" className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg shadow-blue-500/50">
            <i className="fa-solid fa-lock mr-2"></i> Verify Now / এখনই ভেরিফাই করুন
          </NavLink>
        </div>
    );
};

const ProJobStatus = () => {
    const { currentUser } = useData();
    if (!currentUser) return null;

    if (currentUser.proJobActive) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 text-center">
                <i className="fa-solid fa-star text-4xl text-yellow-500 mb-2"></i>
                <h2 className="text-xl font-bold text-gray-800">Pro Job Active</h2>
                <p className="text-gray-600">You can now access exclusive high-paying jobs.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
          <i className="fa-solid fa-rocket text-4xl text-cyan-500 mb-3"></i>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Upgrade to Pro Job!</h2>
          <p className="text-gray-600 mb-4">Unlock premium tasks and earn more. Contact an admin to activate your Pro Job status.</p>
          <button disabled className="w-full sm:w-auto bg-gray-400 text-white font-bold py-3 px-6 rounded-full cursor-not-allowed">
            Activation Pending Admin Approval
          </button>
        </div>
    );
};


const Dashboard = () => {
  const { currentUser, appSettings, transactions, notices } = useData();
  const [isCopied, setIsCopied] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const activeNotice = useMemo(() => notices.find(n => n.isActive), [notices]);

  if (!currentUser) return null;

  const totalIncome = useMemo(() => {
    return Object.values(currentUser.wallets).reduce((sum: number, val: number) => sum + val, 0);
  }, [currentUser.wallets]);

  const totalWithdraw = useMemo(() => {
    if (!currentUser) return 0;
    return transactions
      .filter(tx => tx.userId === currentUser.id && tx.type === 'withdrawal' && tx.status === 'approved')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions, currentUser]);

  const handleCopy = () => {
    if(!navigator.clipboard) return;
    navigator.clipboard.writeText(currentUser.refId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
       {activeNotice && (
            <div className="bg-white p-3 rounded-lg shadow-sm border border-cyan-200 flex justify-between items-center">
                <div className="flex items-center space-x-3 overflow-hidden">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                    </span>
                    <span className="font-semibold text-gray-700 truncate">{activeNotice.title}</span>
                </div>
                <button onClick={() => setSelectedNotice(activeNotice)} className="text-sm text-cyan-600 font-semibold border border-cyan-200 px-3 py-1 rounded-full hover:bg-cyan-50 flex-shrink-0">
                    View
                </button>
            </div>
       )}

      <VerificationStatus />
      
      <ProJobStatus />

      <div>
        <div className="flex justify-between items-baseline mb-3">
            <h3 className="text-lg font-bold text-gray-800">Your Wallets</h3>
            <span className="text-sm text-gray-500">Balances & summary</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <WalletCard icon="fa-solid fa-briefcase" title="Pro Job" amount={currentUser.wallets.proJob} />
          <WalletCard icon="fa-solid fa-users" title="Referral Income" amount={currentUser.wallets.referral} />
          <WalletCard icon="fa-solid fa-arrow-up-from-bracket" title="Total Withdraw" amount={totalWithdraw} />
          <WalletCard icon="fa-solid fa-sack-dollar" title="Total Income" amount={totalIncome} />
          <WalletCard icon="fa-solid fa-envelope" title="Gmail" amount={currentUser.wallets.gmail} />
          <WalletCard icon="fa-solid fa-server" title="Server" amount={currentUser.wallets.server} />
          <WalletCard icon="fa-solid fa-hand-holding-dollar" title="Salary" amount={currentUser.wallets.salary} />
          <WalletCard icon="fa-solid fa-wallet" title="Job Balance" amount={currentUser.wallets.jobBalance} />
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-xl shadow-lg text-white text-center relative overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/20 rounded-full"></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/20 rounded-full"></div>
        <h3 className="text-2xl font-bold mb-2 relative z-10">
          📢 Refer & Earn! 🤝
        </h3>
        <p className="mb-4 text-cyan-100 relative z-10">
          আপনার বন্ধুকে রেফার করে আয় করুন <span className="font-bold text-white">৳{appSettings.referralBonus}</span> বোনাস! 🥳
        </p>
        <div className="relative z-10 flex items-center border-2 border-dashed border-cyan-300 rounded-lg p-2 bg-white/20 max-w-sm mx-auto">
          <input 
            type="text" 
            readOnly 
            value={currentUser.refId}
            className="flex-grow bg-transparent text-center text-lg font-mono font-bold text-white focus:outline-none tracking-wider placeholder-cyan-200"
            aria-label="Referral Code"
          />
          <button 
            onClick={handleCopy}
            className="bg-white text-cyan-600 text-sm font-bold px-4 py-2 rounded-md hover:bg-cyan-100 transition flex-shrink-0"
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <i className="fa-brands fa-telegram text-5xl text-sky-500 mb-4"></i>
          <h4 className="font-semibold text-gray-800 mb-2">Official Telegram Group</h4>
          <p className="text-sm text-gray-500 mb-4">Get updates, chat & connect</p>
          <a href={appSettings.telegramLinks.group} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition inline-block">
            <i className="fa-solid fa-users mr-2"></i>JOIN GROUP
          </a>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <i className="fa-brands fa-telegram text-5xl text-green-500 mb-4"></i>
          <h4 className="font-semibold text-gray-800 mb-2">Official Telegram Channel</h4>
          <p className="text-sm text-gray-500 mb-4">Latest announcements & news</p>
          <a href={appSettings.telegramLinks.channel} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600 transition inline-block">
            <i className="fa-solid fa-paper-plane mr-2"></i>JOIN CHANNEL
          </a>
        </div>
      </div>
      
      {selectedNotice && <NoticeModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} />}
    </div>
  );
};

export default Dashboard;
