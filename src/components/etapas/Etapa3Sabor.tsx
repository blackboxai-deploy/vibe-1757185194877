"use client";

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useCalculos } from '@/hooks/useCalculos';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function Etapa3Sabor() {
  const { state, dispatch } = useApp();
  const { formatarMoeda } = useCalculos();
  const [novoSabor, setNovoSabor] = useState('');
  const [novoPreco, setNovoPreco] = useState('');
  const [dialogAberto, setDialogAberto] = useState(false);

  const handleSaborChange = (sabor: string) => {
    dispatch({ type: 'UPDATE_PEDIDO_TEMP', payload: { sabor } });
  };

  const adicionarSabor = () => {
    if (novoSabor.trim() && novoPreco) {
      const preco = parseFloat(novoPreco.replace(',', '.'));
      if (preco > 0) {
        dispatch({ 
          type: 'ADD_SABOR', 
          payload: { nome: novoSabor.trim(), preco } 
        });
        // Selecionar automaticamente o novo sabor
        dispatch({ type: 'UPDATE_PEDIDO_TEMP', payload: { sabor: novoSabor.trim() } });
        setNovoSabor('');
        setNovoPreco('');
        setDialogAberto(false);
      }
    }
  };

  const saborSelecionado = state.sabores.find(s => s.nome === state.pedidoTemp.sabor);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          🍰 Sabor da Torta
        </h2>
        <p className="text-sm text-gray-600">
          Escolha um sabor ou adicione um novo
        </p>
      </div>

      {/* Seletor de Sabor */}
      <div className="space-y-3">
        <Label htmlFor="sabor" className="text-sm font-medium text-gray-700">
          Sabor Disponível
        </Label>
        <Select value={state.pedidoTemp.sabor || ''} onValueChange={handleSaborChange}>
          <SelectTrigger className="h-12 text-lg">
            <SelectValue placeholder="Selecione um sabor..." />
          </SelectTrigger>
          <SelectContent>
            {state.sabores.map((sabor) => (
              <SelectItem key={sabor.nome} value={sabor.nome}>
                <div className="flex justify-between items-center w-full">
                  <span>{sabor.nome}</span>
                  <span className="text-sm text-gray-500 ml-4">
                    {formatarMoeda(sabor.preco)}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sabor Selecionado */}
      {saborSelecionado && (
        <Card className="p-4 bg-purple-50 border-purple-200">
          <div className="text-center">
            <p className="text-sm text-purple-600 font-medium">
              Sabor Selecionado:
            </p>
            <p className="text-lg font-semibold text-purple-800">
              {saborSelecionado.nome}
            </p>
            <p className="text-sm text-purple-600">
              Preço: {formatarMoeda(saborSelecionado.preco)}
            </p>
          </div>
        </Card>
      )}

      {/* Botão Adicionar Novo Sabor */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            ➕ Adicionar Novo Sabor
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Sabor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="novo-sabor">Nome do Sabor</Label>
              <Input
                id="novo-sabor"
                value={novoSabor}
                onChange={(e) => setNovoSabor(e.target.value)}
                placeholder="Ex: Chocolate Branco"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="novo-preco">Preço (R$)</Label>
              <Input
                id="novo-preco"
                value={novoPreco}
                onChange={(e) => setNovoPreco(e.target.value)}
                placeholder="Ex: 25,00"
                type="number"
                step="0.01"
                min="0"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setDialogAberto(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={adicionarSabor}
                disabled={!novoSabor.trim() || !novoPreco}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lista de Sabores Disponíveis */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Sabores Disponíveis:
        </h3>
        <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
          {state.sabores.map((sabor) => (
            <div
              key={sabor.nome}
              className={`p-2 rounded-lg border text-sm flex justify-between items-center ${
                sabor.nome === state.pedidoTemp.sabor
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <span className="font-medium">{sabor.nome}</span>
              <span className="text-gray-600">{formatarMoeda(sabor.preco)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Validação Visual */}
      <div className="flex justify-center">
        {state.pedidoTemp.sabor ? (
          <div className="flex items-center text-green-600 text-sm">
            <span className="mr-1">✓</span>
            Sabor selecionado
          </div>
        ) : (
          <div className="flex items-center text-gray-400 text-sm">
            <span className="mr-1">○</span>
            Selecione um sabor para continuar
          </div>
        )}
      </div>
    </div>
  );
}