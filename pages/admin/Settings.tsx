import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { AppSettings } from '../../types';

const Settings = () => {
    const { appSettings, updateAppSettings } = useData();
    const [settings, setSettings] = useState<AppSettings>(appSettings);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        setSettings(appSettings);
    }, [appSettings]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const keys = name.split('.');
        
        setSettings(prev => {
            const newSettings = JSON.parse(JSON.stringify(prev)); // Deep copy
            let currentLevel: any = newSettings;
            
            for (let i = 0; i < keys.length - 1; i++) {
                currentLevel = currentLevel[keys[i]];
            }
            
            currentLevel[keys[keys.length - 1]] = type === 'number' ? parseFloat(value) || 0 : value;
            return newSettings;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateAppSettings(settings);
        setStatusMessage('Settings updated successfully!');
        setTimeout(() => setStatusMessage(''), 3000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Settings</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                     <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-3">General</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Verification Fee (BDT)</label>
                                <input type="number" name="verificationFee" value={settings.verificationFee} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Referral Bonus (BDT)</label>
                                <input type="number" name="referralBonus" value={settings.referralBonus} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-3">Payment Numbers</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">bKash Number</label>
                                <input type="text" name="paymentNumbers.bkash" value={settings.paymentNumbers.bkash} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Nagad Number</label>
                                <input type="text" name="paymentNumbers.nagad" value={settings.paymentNumbers.nagad} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Rocket Number</label>
                                <input type="text" name="paymentNumbers.rocket" value={settings.paymentNumbers.rocket} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold border-b pb-2 mb-3">Telegram Links</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Group URL</label>
                                <input type="text" name="telegramLinks.group" value={settings.telegramLinks.group} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Channel URL</label>
                                <input type="text" name="telegramLinks.channel" value={settings.telegramLinks.channel} onChange={handleInputChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                            </div>
                        </div>
                    </div>
                    {statusMessage && <p className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{statusMessage}</p>}
                    <button type="submit" className="px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700">Save Settings</button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
