import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Job, ProofConfig } from '../../types';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const ManageJobs = () => {
  const { jobs, addJob, deleteJob } = useData();
  const initialJobState = {
    title: '',
    description: '',
    thumbnail: '',
    likes: '0',
    views: '0',
    reward: 0,
    taskUrl: '',
    rules: '',
  };
  const [newJob, setNewJob] = useState<Omit<Job, 'id' | 'proofsConfig'>>(initialJobState);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [proofsConfig, setProofsConfig] = useState<ProofConfig[]>([{ type: 'image', label: '' }]);

  const handleProofLabelChange = (index: number, value: string) => {
    setProofsConfig(current => {
        const newConfigs = [...current];
        newConfigs[index] = { ...newConfigs[index], label: value };
        return newConfigs;
    });
  };

  const addProof = (type: 'image' | 'text') => {
    setProofsConfig(prev => [...prev, { type, label: '' }]);
  };

  const removeProof = (index: number) => {
    if (proofsConfig.length > 1) {
        setProofsConfig(prev => prev.filter((_, i) => i !== index));
    } else {
        alert("At least one proof is required.");
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewJob(prev => ({ ...prev, [name]: name === 'reward' ? parseFloat(value) : value }));
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const base64 = await fileToBase64(file);
          setNewJob(prev => ({ ...prev, thumbnail: base64 }));
          setThumbnailPreview(URL.createObjectURL(file));
      }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newJob.title && newJob.description && newJob.reward > 0 && newJob.thumbnail && proofsConfig.every(p => p.label)) {
      addJob({ ...newJob, proofsConfig });
      setNewJob(initialJobState);
      setProofsConfig([{ type: 'image', label: '' }]);
      setThumbnailPreview(null);
      const fileInput = document.getElementById('thumbnail-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      setStatusMessage('Job posted successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } else {
        alert('Please fill all required fields, upload a thumbnail, and provide instructions for all proofs.');
    }
  };

  const handleDeleteJob = (jobId: number, jobTitle: string) => {
    if (window.confirm(`Are you sure you want to delete the job "${jobTitle}"? This action cannot be undone.`)) {
        deleteJob(jobId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Job</h2>
        {statusMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
                {statusMessage}
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" name="title" value={newJob.title} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={newJob.description} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Task URL (Optional)</label>
            <input type="text" name="taskUrl" value={newJob.taskUrl || ''} onChange={handleInputChange} placeholder="https://example.com" className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rules / Extra Instructions (Optional)</label>
            <textarea name="rules" value={newJob.rules || ''} onChange={handleInputChange} rows={4} placeholder="1. Rule one..." className="mt-1 block w-full p-2 border border-gray-300 rounded-md"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reward (৳)</label>
            <input type="number" name="reward" value={newJob.reward} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" min="0" step="0.01"/>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Thumbnail Image</label>
            <input id="thumbnail-input" type="file" name="thumbnail" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"/>
            {thumbnailPreview && <img src={thumbnailPreview} alt="Preview" className="mt-2 h-20 rounded-md" />}
          </div>

          <div className="border-t pt-4">
             <h3 className="text-lg font-semibold text-gray-800 mb-2">Proof Requirements</h3>
             <div className="space-y-4 mt-4">
                {proofsConfig.map((config, index) => (
                    <div key={index} className="border p-4 rounded-md space-y-3 bg-slate-50">
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-gray-700">
                                Proof #{index + 1} <span className="text-xs font-normal px-2 py-1 rounded-full bg-gray-200 text-gray-600">{config.type === 'image' ? 'Image Upload' : 'Text Input'}</span>
                            </h4>
                            {proofsConfig.length > 1 && (
                                <button type="button" onClick={() => removeProof(index)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                                    <i className="fa-solid fa-trash-can mr-1"></i> Remove
                                </button>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Proof Instruction (Bilingual)</label>
                            <input 
                                type="text" 
                                placeholder={config.type === 'image' ? "E.g., Screenshot of the task / কাজের স্ক্রিনশট দিন" : "E.g., Your Facebook name / আপনার ফেসবুক নাম দিন"}
                                value={config.label} 
                                onChange={(e) => handleProofLabelChange(index, e.target.value)} 
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
                            />
                        </div>
                    </div>
                ))}
             </div>
              <div className="flex space-x-2 mt-4">
                <button type="button" onClick={() => addProof('image')} className="flex-1 px-4 py-2 bg-sky-100 text-sky-700 rounded-md hover:bg-sky-200 text-sm font-semibold transition">
                    <i className="fa-solid fa-plus mr-2"></i> Add Image Proof
                </button>
                <button type="button" onClick={() => addProof('text')} className="flex-1 px-4 py-2 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 text-sm font-semibold transition">
                    <i className="fa-solid fa-plus mr-2"></i> Add Text Proof
                </button>
            </div>
          </div>

          <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700">Add Job</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Existing Jobs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3">Thumbnail</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Reward</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3"><img src={job.thumbnail} alt={job.title} className="h-10 w-16 object-cover rounded"/></td>
                  <td className="px-4 py-3 font-medium text-gray-900">{job.title}</td>
                  <td className="px-4 py-3">৳{job.reward.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDeleteJob(job.id, job.title)} className="font-medium text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageJobs;
