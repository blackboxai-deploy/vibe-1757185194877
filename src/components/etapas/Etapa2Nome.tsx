"use client";

import { useApp } from '@/contexts/AppContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function Etapa2Nome() {
  const { state, dispatch } = useApp();

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nome = e.target.value;
    dispatch({ type: 'UPDATE_PEDIDO_TEMP', payload: { nome } });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          👤 Nome da Pessoa
        </h2>
        <p className="text-sm text-gray-600">
          Digite o nome para identificar o pedido
        </p>
      </div>

      {/* Campo de Nome */}
      <div className="space-y-3">
        <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
          Nome do Cliente
        </Label>
        <Input
          id="nome"
          type="text"
          value={state.pedidoTemp.nome || ''}
          onChange={handleNomeChange}
          placeholder="Ex: Maria Silva"
          className="text-center text-lg h-12 border-2 focus:border-blue-500"
          autoComplete="name"
          autoFocus
        />
      </div>

      {/* Prévia do Nome */}
      {state.pedidoTemp.nome && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="text-center">
            <p className="text-sm text-green-600 font-medium">
              Nome do Cliente:
            </p>
            <p className="text-lg font-semibold text-green-800">
              {state.pedidoTemp.nome}
            </p>
          </div>
        </Card>
      )}

      {/* Dicas */}
      <div className="space-y-2">
        <div className="text-center text-xs text-gray-500">
          💡 Dicas úteis:
        </div>
        <ul className="text-xs text-gray-500 space-y-1 pl-4">
          <li>• Digite o nome completo para melhor identificação</li>
          <li>• Você pode usar apelidos se preferir</li>
          <li>• Este nome aparecerá na lista de pedidos</li>
        </ul>
      </div>

      {/* Validação Visual */}
      <div className="flex justify-center">
        {state.pedidoTemp.nome?.trim() ? (
          <div className="flex items-center text-green-600 text-sm">
            <span className="mr-1">✓</span>
            Nome válido
          </div>
        ) : (
          <div className="flex items-center text-gray-400 text-sm">
            <span className="mr-1">○</span>
            Digite um nome para continuar
          </div>
        )}
      </div>
    </div>
  );
}