import { useData } from '../../context/DataContext';

const ManageSubmissions = () => {
  const { jobSubmissions, updateJobSubmissionStatus } = useData();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Job Submissions</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Job Title</th>
              <th className="px-4 py-3">Proofs</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobSubmissions.length > 0 ? jobSubmissions.map(sub => (
              <tr key={sub.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-gray-900">{sub.userName}</td>
                <td className="px-4 py-3">{sub.jobTitle}</td>
                <td className="px-4 py-3">
                    <div className="flex flex-col space-y-2">
                        {sub.proofs.map((proof, index) => (
                           <div key={index} className="text-xs">
                               <p className="font-semibold text-gray-600 break-words">{proof.label}:</p>
                               {proof.type === 'image' ? (
                                   <a href={proof.value} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block">
                                      <img src={proof.value} alt={`Proof for ${sub.jobTitle}`} className="max-h-20 rounded border object-contain" />
                                   </a>
                               ) : (
                                   <span className="text-gray-800 break-all">{proof.value}</span>
                               )}
                           </div>
                        ))}
                    </div>
                </td>
                <td className="px-4 py-3">{new Date(sub.submittedDate).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    sub.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    sub.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {sub.status === 'pending' && (
                    <div className="space-x-2">
                      <button onClick={() => updateJobSubmissionStatus(sub.id, 'approved')} className="font-medium text-green-600 hover:underline">Approve</button>
                      <button onClick={() => updateJobSubmissionStatus(sub.id, 'rejected')} className="font-medium text-red-600 hover:underline">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">No submission entries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageSubmissions;
