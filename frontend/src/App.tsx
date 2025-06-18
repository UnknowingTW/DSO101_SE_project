import React, { useState, useEffect } from 'react';

const BMICalculator = () => {
  // State management
  const [inputs, setInputs] = useState({
    height: '',
    weight: '',
    age: ''
  });
  const [bmi, setBmi] = useState<number | null>(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'calculator' | 'history'>('calculator');
  const [loading, setLoading] = useState(false);

  // Color theme
  const theme = {
    primary: '#6366f1',
    secondary: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    light: '#f8fafc',
    dark: '#1e293b',
    gray: '#64748b'
  };

  // Fetch history when tab changes
  useEffect(() => {
    if (activeTab === 'history') fetchHistory();
  }, [activeTab]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/bmi');
      if (!res.ok) throw new Error('Failed to load history');
      const data = await res.json();
      setHistory(data);
      showMessage('History loaded', 'success');
    } catch (err: any) {
      showMessage(err.message || 'Error loading history', 'error');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text: string, type: string) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const calculateBmi = () => {
    const height = parseFloat(inputs.height);
    const weight = parseFloat(inputs.weight);
    
    if (!height || !weight || height <= 0 || weight <= 0) {
      showMessage('Please enter valid height and weight', 'error');
      return null;
    }
    
    return +(weight / (height * height)).toFixed(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const bmiValue = calculateBmi();
    if (bmiValue === null) {
      setLoading(false);
      return;
    }

    setBmi(bmiValue);

    try {
      const res = await fetch('/api/create/bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...inputs,
          bmi: bmiValue,
          createdAt: new Date().toISOString()
        })
      });

      if (!res.ok) throw new Error('Failed to save');
      
      showMessage('BMI saved successfully!', 'success');
      setInputs({ height: '', weight: '', age: '' });
      if (activeTab === 'history') fetchHistory();
    } catch (err: any) {
      showMessage(err.message || 'Error saving data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = () => {
    const bmiValue = calculateBmi();
    if (bmiValue !== null) {
      setBmi(bmiValue);
      showMessage('BMI calculated (not saved)', 'info');
    }
  };

  const clearForm = () => {
    setInputs({ height: '', weight: '', age: '' });
    setBmi(null);
    setMessage({ text: '', type: '' });
  };

  const deleteRecord = async (id: string) => {
    if (!confirm('Delete this record?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/user/bmi/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      showMessage('Record deleted', 'success');
      fetchHistory();
    } catch (err: any) {
      showMessage(err.message || 'Delete failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getBmiCategory = (value: number) => {
    if (value < 18.5) return { label: 'Underweight', color: theme.primary };
    if (value < 25) return { label: 'Healthy', color: theme.secondary };
    if (value < 30) return { label: 'Overweight', color: theme.warning };
    return { label: 'Obese', color: theme.danger };
  };

  const getBmiAdvice = (value: number) => {
    if (value < 18.5) return 'Consider consulting a healthcare provider about healthy weight gain.';
    if (value < 25) return 'Great! Maintain your current lifestyle.';
    if (value < 30) return 'Consider healthier eating habits and more physical activity.';
    return 'Please consult with a healthcare provider about weight management.';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      {/* Main Card */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">BMI Tracker</h1>
          <p className="text-indigo-100 mt-2">Monitor your body mass index</p>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-4 font-medium ${activeTab === 'calculator' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('calculator')}
          >
            Calculator
          </button>
          <button
            className={`flex-1 py-4 font-medium ${activeTab === 'history' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>
        
        {/* Message Alert */}
        {message.text && (
          <div className={`mx-6 mt-4 p-3 rounded-lg ${message.type === 'error' ? 'bg-red-100 text-red-800' : message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {message.text}
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          {activeTab === 'calculator' ? (
            <>
              {/* Calculator Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (m)</label>
                    <input
                      type="number"
                      name="height"
                      value={inputs.height}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0.5"
                      max="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="1.75"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={inputs.weight}
                      onChange={handleInputChange}
                      step="0.1"
                      min="10"
                      max="500"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="70.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={inputs.age}
                      onChange={handleInputChange}
                      min="1"
                      max="120"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="25"
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleCalculate}
                    disabled={loading}
                    className="flex-1 bg-indigo-100 text-indigo-700 py-2 px-4 rounded-lg font-medium hover:bg-indigo-200 transition disabled:opacity-50"
                  >
                    Calculate
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={clearForm}
                    disabled={loading}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-50"
                  >
                    Clear
                  </button>
                </div>
              </form>
              
              {/* Results */}
              {bmi !== null && (
                <div className="mt-8 bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-center mb-4">Your Results</h3>
                  
                  <div className="flex flex-col items-center mb-6">
                    <span className="text-5xl font-bold" style={{ color: getBmiCategory(bmi).color }}>
                      {bmi}
                    </span>
                    <span 
                      className="mt-2 px-3 py-1 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: `${getBmiCategory(bmi).color}20`,
                        color: getBmiCategory(bmi).color
                      }}
                    >
                      {getBmiCategory(bmi).label}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-center mb-6">
                    {getBmiAdvice(bmi)}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded text-center">
                      Underweight &lt;18.5
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded text-center">
                      Healthy 18.5-24.9
                    </div>
                    <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded text-center">
                      Overweight 25-29.9
                    </div>
                    <div className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded text-center">
                      Obese ≥30
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* History Section */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Your BMI History</h3>
                <button
                  onClick={fetchHistory}
                  disabled={loading}
                  className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-lg text-sm font-medium hover:bg-indigo-200 transition disabled:opacity-50"
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No records found</p>
                  <button
                    onClick={() => setActiveTab('calculator')}
                    className="bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition"
                  >
                    Calculate BMI
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {history.map((record) => {
                    const category = getBmiCategory(record.bmi);
                    return (
                      <div key={record.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-sm transition">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-2xl font-bold" style={{ color: category.color }}>
                              {record.bmi}
                            </span>
                            <span 
                              className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{ 
                                backgroundColor: `${category.color}20`,
                                color: category.color
                              }}
                            >
                              {category.label}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(record.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>{record.height}m</span>
                          <span>{record.weight}kg</span>
                          <span>{record.age}yrs</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-500 italic">
                            {getBmiAdvice(record.bmi).substring(0, 60)}...
                          </p>
                          <button
                            onClick={() => deleteRecord(record.id)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;