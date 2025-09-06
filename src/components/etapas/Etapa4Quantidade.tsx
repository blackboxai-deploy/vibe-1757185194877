"use client";

import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function Etapa4Quantidade() {
  const { state, dispatch } = useApp();

  const handleQuantidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantidade = parseInt(e.target.value) || 0;
    if (quantidade >= 0) {
      dispatch({ type: 'UPDATE_PEDIDO_TEMP', payload: { quantidade } });
    }
  };

  const incrementar = () => {
    const quantidade = (state.pedidoTemp.quantidade || 0) + 1;
    dispatch({ type: 'UPDATE_PEDIDO_TEMP', payload: { quantidade } });
  };

  const decrementar = () => {
    const quantidade = Math.max(0, (state.pedidoTemp.quantidade || 0) - 1);
    dispatch({ type: 'UPDATE_PEDIDO_TEMP', payload: { quantidade } });
  };

  const quantidades = [1, 2, 3, 4, 5, 10];

  const selecionarQuantidade = (quantidade: number) => {
    dispatch({ type: 'UPDATE_PEDIDO_TEMP', payload: { quantidade } });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          🔢 Quantidade
        </h2>
        <p className="text-sm text-gray-600">
          Quantas tortas do sabor <strong>{state.pedidoTemp.sabor}</strong>?
        </p>
      </div>

      {/* Controles de Quantidade */}
      <div className="space-y-4">
        {/* Stepper */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="lg"
            onClick={decrementar}
            disabled={(state.pedidoTemp.quantidade || 0) <= 0}
            className="w-12 h-12 rounded-full"
          >
            -
          </Button>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 min-w-[80px]">
              {state.pedidoTemp.quantidade || 0}
            </div>
            <div className="text-xs text-gray-500">
              {(state.pedidoTemp.quantidade || 0) === 1 ? 'torta' : 'tortas'}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="lg"
            onClick={incrementar}
            className="w-12 h-12 rounded-full"
          >
            +
          </Button>
        </div>

        {/* Campo de Input Manual */}
        <div className="space-y-2">
          <Label htmlFor="quantidade" className="text-sm font-medium text-gray-700">
            Ou digite a quantidade:
          </Label>
          <Input
            id="quantidade"
            type="number"
            value={state.pedidoTemp.quantidade || ''}
            onChange={handleQuantidadeChange}
            min="0"
            step="1"
            className="text-center text-lg h-12 border-2 focus:border-blue-500"
            placeholder="0"
          />
        </div>

        {/* Botões de Quantidade Rápida */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Quantidades Rápidas:
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {quantidades.map((qtd) => (
              <Button
                key={qtd}
                variant={state.pedidoTemp.quantidade === qtd ? "default" : "outline"}
                onClick={() => selecionarQuantidade(qtd)}
                className={`h-10 ${
                  state.pedidoTemp.quantidade === qtd
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : ''
                }`}
              >
                {qtd}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Resumo da Quantidade */}
      {(state.pedidoTemp.quantidade && state.pedidoTemp.quantidade > 0) && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="text-center">
            <p className="text-sm text-blue-600 font-medium">
              Quantidade Selecionada:
            </p>
            <p className="text-lg font-semibold text-blue-800">
              {state.pedidoTemp.quantidade} {state.pedidoTemp.quantidade === 1 ? 'torta' : 'tortas'}
            </p>
            <p className="text-sm text-blue-600">
              Sabor: {state.pedidoTemp.sabor}
            </p>
          </div>
        </Card>
      )}

      {/* Dica */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          💡 Use os botões + e - ou digite diretamente a quantidade desejada
        </p>
      </div>

      {/* Validação Visual */}
      <div className="flex justify-center">
        {(state.pedidoTemp.quantidade && state.pedidoTemp.quantidade > 0) ? (
          <div className="flex items-center text-green-600 text-sm">
            <span className="mr-1">✓</span>
            Quantidade válida
          </div>
        ) : (
          <div className="flex items-center text-gray-400 text-sm">
            <span className="mr-1">○</span>
            Selecione uma quantidade maior que 0
          </div>
        )}
      </div>
    </div>
  );
}