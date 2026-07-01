import React, { useState, useEffect, useRef } from 'react';
import { FiUpload, FiCheckCircle, FiAlertCircle, FiFileText, FiClock, FiDatabase, FiRefreshCw } from 'react-icons/fi';

const API_HOST = 'http://localhost:5001/api';

const Integration = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentImports, setRecentImports] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  const fileInputRef = useRef(null);

  // Fetch recent imports history
  const fetchImportsHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch(`${API_HOST}/imports`);
      if (response.ok) {
        const data = await response.json();
        setRecentImports(data);
      } else {
        console.error('Failed to fetch import history');
      }
    } catch (err) {
      console.error('Network error fetching history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchImportsHistory();
  }, []);

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Process the file content
  const processFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/json" && !selectedFile.name.endsWith('.json')) {
      setError("Please upload a valid JSON file (.json).");
      setFile(null);
      setParsedData([]);
      return;
    }

    setError(null);
    setSuccess(null);
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (!Array.isArray(json)) {
          setError("Invalid JSON format. The file must contain an array of address objects.");
          setParsedData([]);
        } else if (json.length === 0) {
          setError("The JSON array is empty. Please upload a file with records.");
          setParsedData([]);
        } else {
          setParsedData(json);
        }
      } catch (err) {
        setError(`Malformed JSON file: ${err.message}`);
        setParsedData([]);
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
    };
    reader.readAsText(selectedFile);
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file select via browse
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Trigger input click
  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  // Reset file selection
  const handleReset = () => {
    setFile(null);
    setParsedData([]);
    setError(null);
    setSuccess(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Execute import
  const handleImport = async () => {
    if (!file || parsedData.length === 0) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_HOST}/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          records: parsedData
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(`Success! Successfully imported ${result.importedCount} records from "${file.name}".`);
        // Clean up input
        setFile(null);
        setParsedData([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        // Refresh history logs
        fetchImportsHistory();
      } else {
        setError(result.error || "Failed to process database import.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error: Could not reach the backend import API.");
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Info */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-white">Batch Import</h1>
        <p className="text-slate-400 text-sm">Upload a JSON file to process and store address records in the database.</p>
      </div>

      {/* Main Upload Box & Preview */}
      <div className="bg-[#090d16] border border-slate-900 rounded-xl p-6 md:p-8 shadow-xl space-y-6">
        
        {/* Alerts */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-200 text-sm">
            <FiAlertCircle className="shrink-0 mt-0.5" size={16} />
            <div>
              <span className="font-semibold">Import Error</span>
              <p className="mt-1 text-xs text-rose-350">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-200 text-sm">
            <FiCheckCircle className="shrink-0 mt-0.5" size={16} />
            <div>
              <span className="font-semibold">Import Completed</span>
              <p className="mt-1 text-xs text-emerald-350">{success}</p>
            </div>
          </div>
        )}

        {/* Drag and Drop Container */}
        {!file ? (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
            className={`
              relative flex flex-col items-center justify-center py-12 px-6 rounded-xl border-2 border-dashed 
              cursor-pointer select-none transition-all duration-300 group
              ${dragActive 
                ? 'border-indigo-500 bg-indigo-500/5' 
                : 'border-slate-800 bg-[#070b13] hover:border-slate-700 hover:bg-[#070b13]/80'}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleChange}
            />

            {/* Custom styled icon representing "JS" */}
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-5 font-mono text-2xl font-bold tracking-wider group-hover:scale-105 transition-transform duration-300">
              JS
            </div>

            <p className="text-base font-semibold text-slate-200 mb-1 group-hover:text-white transition-colors">
              Drag and drop a JSON file
            </p>
            
            <p className="text-xs text-slate-500">
              or <span className="text-indigo-400 group-hover:underline font-medium">click to browse</span>. Any file size is allowed.
            </p>
          </div>
        ) : (
          /* File Preview State */
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-[#070b13] border border-slate-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono font-bold text-sm">
                  JS
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white truncate max-w-md">{file.name}</h3>
                  <p className="text-xs text-slate-500">{formatSize(file.size)} • {parsedData.length} records detected</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                disabled={loading}
                className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-slate-800 border border-slate-800/80 transition-all duration-200"
              >
                Clear
              </button>
            </div>

            {/* Data Preview Table */}
            {parsedData.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Preview (First 3 Records)</h4>
                  <span className="text-xs text-slate-400 font-medium">Total: {parsedData.length} rows</span>
                </div>
                
                <div className="overflow-x-auto border border-slate-900 rounded-lg">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#070b13] text-slate-400 border-b border-slate-900">
                        <th className="py-2.5 px-4 font-semibold">Name</th>
                        <th className="py-2.5 px-4 font-semibold">Street Address</th>
                        <th className="py-2.5 px-4 font-semibold">City</th>
                        <th className="py-2.5 px-4 font-semibold">Postal Code</th>
                        <th className="py-2.5 px-4 font-semibold">Country</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 bg-[#070b13]/40">
                      {parsedData.slice(0, 3).map((record, index) => (
                        <tr key={index} className="text-slate-300">
                          <td className="py-2.5 px-4 truncate max-w-[120px] font-medium text-slate-200">{record.name || record.businessName || <span className="text-slate-600 font-normal">N/A</span>}</td>
                          <td className="py-2.5 px-4 truncate max-w-[200px]">{record.street || record.addressLine1 || record.address || <span className="text-rose-500 font-normal">Missing</span>}</td>
                          <td className="py-2.5 px-4 truncate max-w-[100px]">{record.city || <span className="text-rose-500 font-normal">Missing</span>}</td>
                          <td className="py-2.5 px-4 truncate max-w-[80px] font-mono">{record.postalCode || record.zip || record.zipCode || <span className="text-rose-500 font-normal">Missing</span>}</td>
                          <td className="py-2.5 px-4 truncate max-w-[100px]">{record.country || 'India'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Start Import Action Button */}
        <button
          onClick={handleImport}
          disabled={!file || parsedData.length === 0 || loading}
          className={`
            w-full py-3.5 px-4 rounded-xl text-sm font-semibold tracking-wide text-white shadow-lg transition-all duration-200
            flex items-center justify-center gap-2
            ${(!file || parsedData.length === 0) 
              ? 'bg-[#5850ec]/40 cursor-not-allowed text-slate-300/80 shadow-none' 
              : 'bg-[#5850ec] hover:bg-[#4f46e5] active:scale-[0.99] hover:shadow-indigo-500/10 cursor-pointer'}
          `}
        >
          {loading ? (
            <>
              <FiRefreshCw className="animate-spin" size={16} />
              <span>Importing Address Data...</span>
            </>
          ) : (
            <span>Start Import</span>
          )}
        </button>

      </div>

      {/* History Log Section */}
      <div className="bg-[#090d16] border border-slate-900 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-900 pb-4">
          <div className="flex items-center gap-2">
            <FiDatabase className="text-indigo-400" size={18} />
            <h2 className="text-base font-bold text-white">Recent Imports History</h2>
          </div>
          
          <button 
            onClick={fetchImportsHistory}
            disabled={loadingHistory}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Refresh History"
          >
            <FiRefreshCw className={loadingHistory ? "animate-spin" : ""} size={15} />
          </button>
        </div>

        {loadingHistory && recentImports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500 text-xs gap-2">
            <FiRefreshCw className="animate-spin text-slate-400" size={20} />
            <span>Loading database import history...</span>
          </div>
        ) : recentImports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-500 text-sm gap-2">
            <FiClock size={24} className="text-slate-600 mb-1" />
            <span>No import history found in PostgreSQL</span>
            <p className="text-xs text-slate-650">Run your first batch import to populate logs.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-500 font-semibold border-b border-slate-900/60 pb-2">
                  <th className="py-2.5 px-3">Filename</th>
                  <th className="py-2.5 px-3">Upload Date</th>
                  <th className="py-2.5 px-3 text-center">Records</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3">Log Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/40">
                {recentImports.map((imp) => (
                  <tr key={imp.id} className="text-slate-350 hover:bg-[#070b13]/20 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-200 max-w-[200px] truncate" title={imp.filename}>
                      <div className="flex items-center gap-2">
                        <FiFileText size={14} className="text-slate-500 shrink-0" />
                        <span className="truncate">{imp.filename}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {new Date(imp.createdAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold font-mono text-slate-200">
                      {imp.recordCount}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {imp.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                          Completed
                        </span>
                      ) : imp.status === 'failed' ? (
                        <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                          Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider animate-pulse">
                          Processing
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-500 italic max-w-[200px] truncate text-[11px]" title={imp.error || ""}>
                      {imp.status === 'failed' ? imp.error : 'Successfully stored'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Integration;
