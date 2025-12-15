import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Search, FileText, TrendingUp, Settings, BarChart2, Download, Plus, X, Check, Crown, Zap, Loader2 } from 'lucide-react';

// Backend API URL
const API_URL = 'https://easy-receipt-backend-production.up.railway.app/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('belege');
  const [filterCategory, setFilterCategory] = useState('Alle');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [receipts, setReceipts] = useState([]);
  const [stats, setStats] = useState({
    thisMonth: 0,
    totalReceipts: 0,
    business: 0,
    deductible: 0
  });
  const [currentPlan, setCurrentPlan] = useState('free');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const categories = ['Alle', 'Geschäftlich', 'Absetzbar', 'Privat'];

  useEffect(() => {
    loadReceipts();
    loadStats();
  }, []);

  const loadReceipts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/receipts?userId=demo-user`);
      if (!response.ok) throw new Error('Fehler beim Laden der Belege');
      const data = await response.json();
      setReceipts(data);
      setError(null);
    } catch (err) {
      console.error('Error loading receipts:', err);
      setError('Belege konnten nicht geladen werden');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_URL}/receipts/stats?userId=demo-user`);
      if (!response.ok) throw new Error('Fehler beim Laden der Statistiken');
      const data = await response.json();
      setStats({
        thisMonth: parseFloat(data.current_month) || 0,
        totalReceipts: parseInt(data.total_receipts) || 0,
        business: parseFloat(data.business_amount) || 0,
        deductible: parseFloat(data.deductible_amount) || 0
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      if (file.size > 10 * 1024 * 1024) {
        setError('Datei ist zu groß! Maximum 10MB.');
        return;
      }

      setUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('receipt', file);
        formData.append('userId', 'demo-user');

        const response = await fetch(`${API_URL}/receipts/upload`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload fehlgeschlagen');
        }

        await loadReceipts();
        await loadStats();
        
        setShowUploadModal(false);
        setError(null);
      } catch (err) {
        console.error('Upload error:', err);
        setError(err.message || 'Fehler beim Upload. Bitte versuche es erneut.');
      } finally {
        setUploading(false);
      }
    }
  };

  const filteredReceipts = filterCategory === 'Alle' 
    ? receipts 
    : receipts.filter(r => r.category === filterCategory);

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-blue-900 to-blue-700 min-h-screen pb-20">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">EASY RECEIPT</h1>
              <p className="text-blue-200 text-xs">Belege scannen & sparen</p>
            </div>
          </div>
        </div>
        
        <p className="text-blue-200 text-sm">Scan in 3s & Done! 🚀</p>
      </div>

      {/* Stats Cards */}
      <div className="px-6 pb-6 grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">€</div>
            <span className="text-sm text-gray-600">Diesen Monat</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.thisMonth.toFixed(2)} €</div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-sm text-gray-600">Gesamt Belege</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalReceipts}</div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-sm text-gray-600">Geschäftlich</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.business.toFixed(2)} €</div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">📋</div>
            <span className="text-sm text-gray-600">Absetzbar</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.deductible.toFixed(2)} €</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <button 
          onClick={() => setShowUploadModal(true)}
          className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-xl hover:bg-blue-700 transition-colors"
          disabled={uploading}
        >
          <Plus className="w-8 h-8 text-white" />
        </button>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-xl hover:bg-blue-700 transition-colors"
          disabled={uploading}
        >
          <Camera className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-t-3xl min-h-screen">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Suchen..." 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filterCategory === cat 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {currentPlan === 'free' && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Gratis Test: {receipts.length}/10 Belege</span>
                <Crown className="w-5 h-5 text-blue-600" />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: `${(receipts.length/10)*100}%`}}></div>
              </div>
              <button 
                onClick={() => setShowPricingModal(true)}
                className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Jetzt Premium upgraden
              </button>
            </div>
          )}
          
          {loading ? (
            <div className="flex flex-col items-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Lade Belege...</p>
            </div>
          ) : filteredReceipts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Keine Belege vorhanden</p>
              <p className="text-sm text-gray-500 mt-2">Lade deinen ersten Beleg hoch!</p>
            </div>
          ) : (
            filteredReceipts.map(receipt => (
              <div key={receipt.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{receipt.merchant}</h4>
                    <p className="text-sm text-gray-500">{new Date(receipt.date).toLocaleDateString('de-DE')}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{parseFloat(receipt.amount).toFixed(2)} €</div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      receipt.category === 'Geschäftlich' 
                        ? 'bg-purple-100 text-purple-700' 
                        : receipt.category === 'Absetzbar'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {receipt.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>MwSt: {parseFloat(receipt.tax).toFixed(2)} €</span>
                  <button className="text-blue-600 hover:text-blue-700">Details →</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-6 text-center">Beleg hinzufügen</h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            
            {uploading ? (
              <div className="flex flex-col items-center py-8">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Verarbeite Beleg...</p>
                <p className="text-sm text-gray-500 mt-2">OCR-Erkennung läuft</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-2"
                  >
                    <Camera className="w-8 h-8 text-gray-400" />
                    <span className="font-medium">Foto aufnehmen</span>
                    <span className="text-sm text-gray-500">oder Bild auswählen</span>
                  </button>
                  
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="font-medium">Datei hochladen</span>
                    <span className="text-sm text-gray-500">PDF, JPG, PNG (max 10MB)</span>
                  </button>
                </div>
                
                <button 
                  onClick={() => { setShowUploadModal(false); setError(null); }}
                  className="w-full mt-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Abbrechen
                </button>
              </>
            )}
            
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*,.pdf" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-around">
          <button 
            onClick={() => setActiveTab('belege')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'belege' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <FileText className="w-6 h-6" />
            <span className="text-xs font-medium">Belege</span>
          </button>
          <button 
            onClick={() => setActiveTab('berichte')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'berichte' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <BarChart2 className="w-6 h-6" />
            <span className="text-xs font-medium">Berichte</span>
          </button>
          <button 
            onClick={() => { setActiveTab('einstellungen'); setShowPricingModal(true); }}
            className={`flex flex-col items-center gap-1 ${activeTab === 'einstellungen' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs font-medium">Einstellungen</span>
          </button>
        </div>
      </div>
    </div>
  );
}