
import React, { useState, useEffect } from 'react';
import { Operation } from './types';
import { loadOperations, saveOperations } from './services/storageService';
import { exportToDoc } from './services/docExport';
import OperationForm from './components/OperationForm';

const App: React.FC = () => {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOp, setEditingOp] = useState<Operation | undefined>();

  useEffect(() => {
    setOperations(loadOperations());
  }, []);

  const handleSave = (newOp: Operation) => {
    let updated;
    if (editingOp) {
      updated = operations.map(o => o.id === newOp.id ? newOp : o);
    } else {
      updated = [newOp, ...operations];
    }
    setOperations(updated);
    saveOperations(updated);
    setIsFormOpen(false);
    setEditingOp(undefined);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta operação?')) {
      const updated = operations.filter(o => o.id !== id);
      setOperations(updated);
      saveOperations(updated);
    }
  };

  const handleEdit = (op: Operation) => {
    setEditingOp(op);
    setIsFormOpen(true);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-2">
            <span className="bg-blue-600 px-2 py-1 rounded">EAGLE</span> EYE
          </h1>
          <p className="text-slate-400 font-medium">Sistema de Planejamento Tático Operacional</p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={() => { setEditingOp(undefined); setIsFormOpen(true); }}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-xl shadow-blue-900/40"
          >
            + Nova Operação
          </button>
        )}
      </header>

      {isFormOpen ? (
        <OperationForm 
          initialData={editingOp}
          onSave={handleSave} 
          onCancel={() => { setIsFormOpen(false); setEditingOp(undefined); }} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {operations.length === 0 ? (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-2xl">
              <p className="text-slate-500">Nenhum planejamento encontrado. Inicie uma nova missão.</p>
            </div>
          ) : (
            operations.map(op => (
              <div key={op.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:border-slate-700 transition">
                <div className="p-5 border-b border-slate-800 flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-100">{op.name}</h3>
                    <p className="text-xs text-blue-400 font-mono mt-1">{op.date}</p>
                  </div>
                  <span className="bg-slate-800 text-slate-400 px-2 py-1 rounded text-[10px] font-bold">MISSÃO ATIVA</span>
                </div>
                
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-xs">
                      <p className="text-slate-500 uppercase font-bold mb-1">Briefing</p>
                      <p className="text-slate-300">{op.briefingLocation}</p>
                      <p className="text-slate-300">{op.briefingTime}h</p>
                    </div>
                    <div className="text-xs">
                      <p className="text-slate-500 uppercase font-bold mb-1">Estatísticas</p>
                      <p className="text-slate-300">{op.targets.length} Alvos</p>
                      <p className="text-slate-300">{op.targets.reduce((acc, t) => acc + t.team.vehicles.length, 0)} VTRs</p>
                    </div>
                  </div>

                  {op.targets.length > 0 && (
                    <div className="flex -space-x-2 overflow-hidden">
                      {op.targets.slice(0, 5).map((t, i) => (
                        <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                          {t.suspectPhoto ? <img src={t.suspectPhoto} className="h-full w-full rounded-full object-cover" /> : t.name.charAt(0)}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                    <button 
                      onClick={() => handleEdit(op)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded text-xs font-bold transition"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => exportToDoc(op)}
                      className="flex-1 bg-green-900/30 hover:bg-green-800/40 text-green-400 py-2 rounded text-xs font-bold transition"
                    >
                      DOC
                    </button>
                    <button 
                      onClick={() => {
                        const win = window.open(`https://www.google.com/maps/dir/${encodeURIComponent(op.briefingLocation)}/${op.targets.map(t => encodeURIComponent(t.address)).join('/')}`, '_blank');
                      }}
                      className="flex-1 bg-blue-900/30 hover:bg-blue-800/40 text-blue-400 py-2 rounded text-xs font-bold transition"
                    >
                      Mapa
                    </button>
                    <button 
                      onClick={() => handleDelete(op.id)}
                      className="bg-red-900/20 hover:bg-red-900/40 text-red-500 px-3 py-2 rounded transition"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <footer className="mt-20 py-8 border-t border-slate-900 text-center text-slate-600 text-xs">
        <p>&copy; 2024 EagleEye Intelligence Systems. Uso restrito para forças de segurança.</p>
      </footer>
    </div>
  );
};

export default App;
