'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useTheme } from '@/contexts/theme-context';
import { useToast } from '@/contexts/toast-context';

const SettingsPage = () => {
  const { theme, setTheme, availableThemes } = useTheme();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    emailNotifications: true,
    taskReminders: true,
    weeklyDigest: false,
    darkMode: theme.includes('professional') || theme.includes('dark'),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as any);
    addToast('Theme updated successfully!', 'success');
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Settings saved successfully!', 'success');
  };

  const handleResetToDefault = () => {
    setFormData({
      emailNotifications: true,
      taskReminders: true,
      weeklyDigest: false,
      darkMode: true,
    });
    addToast('Settings reset to default!', 'info');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      addToast('Account deletion is not implemented in demo', 'warning');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
        </div>

        <form onSubmit={handleSaveChanges} className="space-y-8">
          {/* Theme Selection */}
          <div className="bg-[rgba(26,35,71,0.7)] backdrop-blur-md border border-[rgba(255,22,22,0.2)] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-[rgba(255,22,22,0.2)] pb-2">Theme Selection</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableThemes.map((availableTheme) => (
                <div
                  key={availableTheme}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    theme === availableTheme
                      ? 'border-red-500 bg-[rgba(255,22,22,0.2)]'
                      : 'border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,22,22,0.1)]'
                  }`}
                  onClick={() => handleThemeChange(availableTheme)}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3 ${
                      theme === availableTheme ? 'bg-red-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-white capitalize">
                      {availableTheme.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="mt-2 flex space-x-1">
                    <div className="w-6 h-6 rounded bg-red-500"></div>
                    <div className="w-6 h-6 rounded bg-[rgba(26,35,71,0.7)]"></div>
                    <div className="w-6 h-6 rounded bg-gray-300"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-[rgba(26,35,71,0.7)] backdrop-blur-md border border-[rgba(255,22,22,0.2)] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-[rgba(255,22,22,0.2)] pb-2">Notification Settings</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">Email Notifications</label>
                  <p className="text-gray-400 text-sm">Receive emails about important updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">Task Reminders</label>
                  <p className="text-gray-400 text-sm">Get reminded about upcoming tasks</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="taskReminders"
                    checked={formData.taskReminders}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">Weekly Digest</label>
                  <p className="text-gray-400 text-sm">Receive weekly summary of your tasks</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="weeklyDigest"
                    checked={formData.weeklyDigest}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-[rgba(26,35,71,0.7)] backdrop-blur-md border border-[rgba(255,22,22,0.2)] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-[rgba(255,22,22,0.2)] pb-2">Account Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Email Address</label>
                <input
                  type="email"
                  defaultValue="user@example.com"
                  className="w-full px-3 py-2 border border-[rgba(255,255,255,0.2)] rounded-lg bg-[rgba(0,0,0,0.3)] text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-white mb-2">Change Password</label>
                <div className="flex space-x-2">
                  <input
                    type="password"
                    placeholder="Current password"
                    className="flex-1 px-3 py-2 border border-[rgba(255,255,255,0.2)] rounded-lg bg-[rgba(0,0,0,0.3)] text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    className="flex-1 px-3 py-2 border border-[rgba(255,255,255,0.2)] rounded-lg bg-[rgba(0,0,0,0.3)] text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="btn-grad-full"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="btn-outlined"
            >
              Reset to Default
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="btn-grad"
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;