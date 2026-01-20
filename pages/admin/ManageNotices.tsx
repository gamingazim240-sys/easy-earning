import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Notice } from '../../types';

const NoticeModal = ({ notice, onSave, onClose }: { notice: Partial<Notice>; onSave: (notice: Notice) => void; onClose: () => void; }) => {
    const [title, setTitle] = useState(notice.title || '');
    const [content, setContent] = useState(notice.content || '');
    const [isActive, setIsActive] = useState(notice.isActive !== undefined ? notice.isActive : true);

    const handleSave = () => {
        if (!title || !content) {
            alert('Title and content are required.');
            return;
        }
        onSave({
            ...notice,
            title,
            content,
            isActive
        } as Notice);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4">{notice.id ? 'Edit' : 'Add'} Notice</h3>
                <div className="space-y-4">
                    <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded"/>
                    <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} rows={5} className="w-full p-2 border rounded"></textarea>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                        <span className="text-sm text-gray-700">Active (will be shown on user dashboard)</span>
                    </label>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-cyan-600 text-white font-bold rounded-md hover:bg-cyan-700">Save</button>
                </div>
            </div>
        </div>
    );
};

const ManageNotices = () => {
    const { notices, addNotice, updateNotice, deleteNotice } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNotice, setEditingNotice] = useState<Partial<Notice> | null>(null);

    const handleSave = (notice: Notice) => {
        if (notice.id) {
            updateNotice(notice);
        } else {
            addNotice(notice);
        }
        setIsModalOpen(false);
        setEditingNotice(null);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Manage Notices</h2>
                    <button onClick={() => { setEditingNotice({}); setIsModalOpen(true); }} className="px-4 py-2 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 flex items-center space-x-2">
                        <i className="fa-solid fa-plus"></i>
                        <span>Add Notice</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left table-auto">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 w-2/5">Title</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notices.map(notice => (
                                <tr key={notice.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold text-gray-900">{notice.title}</td>
                                    <td className="px-6 py-4 text-gray-500">{new Date(notice.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${notice.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {notice.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-4">
                                        <button onClick={() => { setEditingNotice(notice); setIsModalOpen(true); }} className="font-medium text-cyan-600 hover:underline">Edit</button>
                                        <button onClick={() => deleteNotice(notice.id)} className="font-medium text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && editingNotice && <NoticeModal notice={editingNotice} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default ManageNotices;
