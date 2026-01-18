
import React, { useState, useEffect } from 'react';
import { Operation, Target, TeamMember } from '../types';
import { resizeImage } from '../services/storageService';

interface Props {
  initialData?: Operation;
  onSave: (op: Operation) => void;
  onCancel: () => void;
}

const OperationForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Operation>(initialData || {
    id: crypto.randomUUID(),
    name: '',
    briefingLocation: '',
    briefingTime: '',
    date: new Date().toISOString().split('T')[0],
    targets: []
  });

  const addTarget = () => {
    const newTarget: Target = {
      id: crypto.randomUUID(),
      name: '',
      address: '',
      description: '',
      team: { leader: '', members: [], vehicles: [] }
    };
    setFormData(prev => ({ ...prev, targets: [...prev.targets, newTarget] }));
  };

  const updateTarget = (id: string, updates: Partial<Target>) => {
    setFormData(prev => ({
      ...prev,
      targets: prev.targets.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  };

  const handlePhotoUpload = async (id: string, type: 'suspect' | 'location', file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      const smallBase64 = await resizeImage(base64);
      updateTarget(id, type === 'suspect' ? { suspectPhoto: smallBase64 } : { locationPhoto: smallBase64 });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-2xl max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-400">
          {initialData ? 'Editar Operação' : 'Novo Planejamento'}
        </h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-white">Fechar</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase">Nome da Missão</label>
          <input 
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase">Local de Briefing</label>
          <input 
            value={formData.briefingLocation}
            onChange={e => setFormData({ ...formData, briefingLocation: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase">Horário</label>
          <input 
            type="time"
            value={formData.briefingTime}
            onChange={e => setFormData({ ...formData, briefingTime: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <h3 className="text-lg font-semibold">Alvos e Equipes</h3>
          <button 
            onClick={addTarget}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm transition"
          >
            + Adicionar Alvo
          </button>
        </div>

        {formData.targets.map((target, idx) => (
          <div key={target.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs text-slate-400">Nome do Alvo / Codinome</label>
                <input 
                  value={target.name}
                  onChange={e => updateTarget(target.id, { name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-slate-400">Endereço</label>
                <input 
                  value={target.address}
                  onChange={e => updateTarget(target.id, { address: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs text-slate-400">Foto Suspeito</label>
                <input type="file" onChange={e => e.target.files?.[0] && handlePhotoUpload(target.id, 'suspect', e.target.files[0])} className="text-xs" />
                {target.suspectPhoto && <img src={target.suspectPhoto} className="h-20 w-20 object-cover rounded border border-slate-600" />}
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-slate-400">Fachada Local</label>
                <input type="file" onChange={e => e.target.files?.[0] && handlePhotoUpload(target.id, 'location', e.target.files[0])} className="text-xs" />
                {target.locationPhoto && <img src={target.locationPhoto} className="h-20 w-20 object-cover rounded border border-slate-600" />}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-700 pt-4">
              <div>
                <label className="block text-xs text-slate-400">Líder de Equipe</label>
                <input 
                  value={target.team.leader}
                  onChange={e => updateTarget(target.id, { team: { ...target.team, leader: e.target.value } })}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400">Viaturas (separadas por vírgula)</label>
                <input 
                  value={target.team.vehicles.join(', ')}
                  onChange={e => updateTarget(target.id, { team: { ...target.team, vehicles: e.target.value.split(',').map(s => s.trim()) } })}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm"
                />
              </div>
            </div>
            
            <button 
              onClick={() => setFormData(prev => ({ ...prev, targets: prev.targets.filter(t => t.id !== target.id) }))}
              className="text-red-400 text-xs hover:underline"
            >
              Remover Alvo
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button onClick={onCancel} className="px-6 py-2 rounded bg-slate-800 hover:bg-slate-700 transition">Cancelar</button>
        <button 
          onClick={() => onSave(formData)}
          className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-500 font-bold transition shadow-lg shadow-blue-900/20"
        >
          Salvar Operação
        </button>
      </div>
    </div>
  );
};

export default OperationForm;
