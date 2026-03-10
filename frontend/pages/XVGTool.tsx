import React, { useState, useRef } from 'react';
import { API_URL } from '../src/config';

export const XVGTool: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Customization State
  const [title, setTitle] = useState('');
  const [xlabel, setXlabel] = useState('');
  const [ylabel, setYlabel] = useState('');
  const [dpi, setDpi] = useState(150);
  const [color, setColor] = useState('#2c3e50');
  const [legendName, setLegendName] = useState('Trajectory');
  const [legendPos, setLegendPos] = useState('best');

  // Appearance State
  const [showGrid, setShowGrid] = useState(true);
  const [bgColor, setBgColor] = useState('white');

  // Axis State
  const [xMin, setXMin] = useState<string>(''); 
  const [xMax, setXMax] = useState<string>('');
  const [yMin, setYMin] = useState<string>('');
  const [yMax, setYMax] = useState<string>('');
  
  // Tick Steps
  const [xStep, setXStep] = useState<string>('');
  const [yStep, setYStep] = useState<string>('');

  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('line_color', color);
    formData.append('legend_label', legendName);
    formData.append('legend_loc', legendPos);
    
    // Add custom settings
    if (title) formData.append('title', title);
    if (xlabel) formData.append('xlabel', xlabel);
    if (ylabel) formData.append('ylabel', ylabel);
    formData.append('dpi', dpi.toString());

    // Send Axis Limits
    if (xMin) formData.append('x_min', xMin);
    if (xMax) formData.append('x_max', xMax);
    if (yMin) formData.append('y_min', yMin);
    if (yMax) formData.append('y_max', yMax);
    
    // Send Step Values
    if (xStep) formData.append('x_step', xStep);
    if (yStep) formData.append('y_step', yStep);

    // Send Appearance Settings
    formData.append('bg_color', bgColor);
    formData.append('show_grid', showGrid.toString());

    try {
      const response = await fetch(`${API_URL}/analyze/xvg`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Server Error: ${response.statusText}`);

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setImageUrl(objectUrl);
    } catch (err) {
      console.error(err);
      setError("Failed to connect to backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCurrentFile(file);
      processFile(file);
    }
  };

  const handleUpdate = () => {
    if (currentFile) {
      processFile(currentFile);
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `analysis_${title || 'plot'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">XVG Analysis</h1>
        <p className="text-slate-400">High-Resolution Python/Matplotlib Rendering</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Controls */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Upload Box */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-2">1. Upload File</label>
            <input 
              type="file" 
              accept=".xvg,.txt"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-cyan-900/30 file:text-cyan-400 hover:file:bg-cyan-900/50 cursor-pointer"
            />
          </div>

          {/* Settings Box */}
          <div className={`bg-slate-800 p-6 rounded-xl border border-slate-700 transition-opacity ${!currentFile ? 'opacity-50 pointer-events-none' : ''}`}>
            <label className="block text-sm font-medium text-slate-300 mb-4">2. Customize Graph</label>
            
            <div className="space-y-4">
              
              {/* Title Input */}
              <div>
                <span className="text-xs text-slate-500">Graph Title</span>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Molecular Dynamics Simulation"
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-slate-500">Line Color</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input 
                      type="color" 
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="h-8 w-8 rounded cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-xs text-slate-400 font-mono">{color}</span>
                  </div>
                </div>
                <div>
                   <span className="text-xs text-slate-500">Legend Pos</span>
                   <select 
                     value={legendPos}
                     onChange={(e) => setLegendPos(e.target.value)}
                     className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1.5 text-xs text-white mt-1 outline-none"
                   >
                     <option value="best">Best (Auto)</option>
                     <option value="upper right">Upper Right</option>
                     <option value="upper left">Upper Left</option>
                     <option value="lower right">Lower Right</option>
                     <option value="lower left">Lower Left</option>
                   </select>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500">Legend Labels (comma separated)</span>
                <input 
                  type="text" 
                  value={legendName} 
                  onChange={(e) => setLegendName(e.target.value)}
                  placeholder="e.g. Native, OX1, CL1"
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-slate-500">X Label</span>
                  <input 
                    type="text" 
                    value={xlabel} 
                    onChange={(e) => setXlabel(e.target.value)}
                    placeholder="Time (ps)"
                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                  />
                </div>
                <div>
                  <span className="text-xs text-slate-500">Y Label</span>
                  <input 
                    type="text" 
                    value={ylabel} 
                    onChange={(e) => setYlabel(e.target.value)}
                    placeholder="nm"
                    className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>

              {/* --- APPEARANCE CONTROLS --- */}
              <div className="pt-2 border-t border-slate-700">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-2">Appearance</span>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Grid Toggle */}
                  <div className="flex items-center justify-between bg-slate-900 p-2 rounded border border-slate-600">
                    <span className="text-xs text-slate-300">Show Grid</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showGrid}
                        onChange={(e) => setShowGrid(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>

                  {/* Background Selector */}
                  <div>
                    <select 
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-2 text-xs text-white outline-none h-full"
                    >
                      <option value="white">White</option>
                      <option value="transparent">Transparent</option>
                      <option value="#f0f2f5">Light Gray</option>
                      <option value="#1e293b">Dark Mode</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* --- AXIS CONTROLS --- */}
              <div className="pt-2 border-t border-slate-700">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-2">Axis Control</span>
                
                {/* X Axis Row */}
                <div className="mb-3">
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">X-Axis (Min / Max / Step)</span>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" value={xMin} onChange={(e) => setXMin(e.target.value)} placeholder="Min" className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:border-cyan-500 outline-none" />
                    <input type="number" value={xMax} onChange={(e) => setXMax(e.target.value)} placeholder="Max" className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:border-cyan-500 outline-none" />
                    <input type="number" value={xStep} onChange={(e) => setXStep(e.target.value)} placeholder="Step" className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:border-cyan-500 outline-none border-l-2 border-l-cyan-900" />
                  </div>
                </div>

                {/* Y Axis Row */}
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block mb-1">Y-Axis (Min / Max / Step)</span>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" value={yMin} onChange={(e) => setYMin(e.target.value)} placeholder="Min" className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:border-cyan-500 outline-none" />
                    <input type="number" value={yMax} onChange={(e) => setYMax(e.target.value)} placeholder="Max" className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:border-cyan-500 outline-none" />
                    <input type="number" value={yStep} onChange={(e) => setYStep(e.target.value)} placeholder="Step" className="bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:border-cyan-500 outline-none border-l-2 border-l-cyan-900" />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500">Resolution (DPI): {dpi}</span>
                <input 
                  type="range" 
                  min="72" max="600" step="10"
                  value={dpi} 
                  onChange={(e) => setDpi(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <button 
                onClick={handleUpdate}
                disabled={isLoading}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2 rounded transition-colors"
              >
                {isLoading ? 'Rendering...' : 'Update Graph'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Graph */}
        <div className="md:col-span-2">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 min-h-[500px] flex flex-col items-center justify-center relative">
            
            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center z-10 rounded-xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
                    <p className="text-cyan-400 font-mono animate-pulse">Generating Plot...</p>
                </div>
            )}

            {/* Error Message */}
            {error && (
               <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center z-10 rounded-xl p-4 text-center">
                 <p className="text-red-400 font-medium">{error}</p>
                 <button onClick={() => setError('')} className="mt-4 text-sm text-slate-400 hover:text-white underline">Dismiss</button>
               </div>
            )}

            {/* The Image */}
            {imageUrl ? (
              <div className="flex flex-col items-center w-full">
                <img src={imageUrl} alt="Analysis Result" className="max-w-full rounded shadow-lg mb-4" />
                
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-full transition-all border border-slate-500"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download PNG
                </button>
              </div>
            ) : (
              !isLoading && (
                <div className="text-center text-slate-500 opacity-50">
                  <p className="text-lg font-medium">No Data</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};