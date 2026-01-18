
import { Operation } from '../types';

export const exportToDoc = (operation: Operation) => {
  const content = `
    <h1>RELATÓRIO DE PLANEJAMENTO OPERACIONAL: ${operation.name.toUpperCase()}</h1>
    <p><strong>Data:</strong> ${operation.date}</p>
    <p><strong>Local de Briefing:</strong> ${operation.briefingLocation}</p>
    <p><strong>Horário de Briefing:</strong> ${operation.briefingTime}</p>
    <hr/>
    <h2>ALVOS E EQUIPES</h2>
    ${operation.targets.map(target => `
      <div style="margin-bottom: 20px; border: 1px solid #ccc; padding: 10px;">
        <h3>Alvo: ${target.name}</h3>
        <p><strong>Endereço:</strong> ${target.address}</p>
        <p><strong>Descrição:</strong> ${target.description}</p>
        <p><strong>Líder da Equipe:</strong> ${target.team.leader}</p>
        <p><strong>Efetivo:</strong> ${target.team.members.map(m => `${m.name} (${m.role})`).join(', ')}</p>
        <p><strong>Viaturas:</strong> ${target.team.vehicles.join(', ')}</p>
      </div>
    `).join('')}
  `;

  const blob = new Blob(['\ufeff', content], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Planejamento_${operation.name.replace(/\s+/g, '_')}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
