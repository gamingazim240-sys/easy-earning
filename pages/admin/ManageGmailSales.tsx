import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { GmailSubmission } from '../../types';

const ApprovalModal = ({ submission, onConfirm, onClose }: { submission: GmailSubmission, onConfirm: (id: number, price: number) => void, onClose: () => void }) => {
    const { appSettings } = useData();
    const [price, setPrice] = useState<number | ''>(appSettings.gmailSellPrice || '');
    
    const handleConfirm = () => {
        if (price === '' || Number(price) <= 0) {
            alert('Please enter a valid price.');
            return;
        }
        onConfirm(submission.id, Number(price));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-bold mb-4">Approve Gmail Sale</h3>
                <p className="text-sm mb-2">Enter the price for <span className="font-bold">{submission.gmailAddress}</span>.</p>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Price (BDT)</label>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required min="0.01" step="0.01" />
                    <p className="text-xs text-gray-500 mt-1">Default price is ৳{appSettings.gmailSellPrice}. You can change it here.</p>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleConfirm} className="px-4 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700">Confirm Approval</button>
                </div>
            </div>
        </div>
    );
};


const ManageGmailSales = () => {
    const { gmailSubmissions, updateGmailSubmissionStatus, appSettings } = useData();
    const [approvalTarget, setApprovalTarget] = useState<GmailSubmission | null>(null);

    const handleApprove = (id: number, price: number) => {
        updateGmailSubmissionStatus(id, 'approved', price);
        setApprovalTarget(null);
    };

    const handleReject = (id: number) => {
        const reason = prompt("Please provide a reason for rejection:");
        if (reason) {
            updateGmailSubmissionStatus(id, 'rejected', undefined, reason);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Manage Gmail Sales</h2>
            <p className="text-sm text-gray-600 mb-4">
                The default approval price is <span className="font-bold">৳{appSettings.gmailSellPrice}</span>. You can change this for individual submissions when you approve.
            </p>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Gmail & Password</th>
                            <th className="px-4 py-3">Recovery Phone</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gmailSubmissions.map(sub => (
                            <tr key={sub.id} className="border-b hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium text-gray-900">{sub.userName}</td>
                                <td className="px-4 py-3">
                                    <p>{sub.gmailAddress}</p>
                                    <p className="text-xs text-gray-500">Pass: {sub.password}</p>
                                </td>
                                <td className="px-4 py-3">{sub.recoveryPhone}</td>
                                <td className="px-4 py-3">{new Date(sub.submittedDate).toLocaleDateString()}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                                        sub.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        sub.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {sub.status}
                                    </span>
                                    {sub.price && <p className="text-xs mt-1 font-semibold">৳{sub.price.toFixed(2)}</p>}
                                    {sub.rejectionReason && <p className="text-xs mt-1 text-red-600">Reason: {sub.rejectionReason}</p>}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {sub.status === 'pending' && (
                                        <div className="space-x-2">
                                            <button onClick={() => setApprovalTarget(sub)} className="font-medium text-green-600 hover:underline">Approve</button>
                                            <button onClick={() => handleReject(sub.id)} className="font-medium text-red-600 hover:underline">Reject</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {approvalTarget && <ApprovalModal submission={approvalTarget} onConfirm={handleApprove} onClose={() => setApprovalTarget(null)} />}
        </div>
    );
};

export default ManageGmailSales;
