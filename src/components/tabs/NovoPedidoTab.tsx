"use client";

import { useApp } from '@/contexts/AppContext';
import { useCalculos } from '@/hooks/useCalculos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Etapa1Data from '../etapas/Etapa1Data';
import Etapa2Nome from '../etapas/Etapa2Nome';
import Etapa3Sabor from '../etapas/Etapa3Sabor';
import Etapa4Quantidade from '../etapas/Etapa4Quantidade';
import Etapa5Preco from '../etapas/Etapa5Preco';
import Etapa6Pagamento from '../etapas/Etapa6Pagamento';
import { Pedido } from '@/types';

export default function NovoPedidoTab() {
  const { state, dispatch } = useApp();
  const { valorTotalPedidoTemp, precoUnitarioAtual, pedidoTempCompleto } = useCalculos();

  const proximaEtapa = () => {
    if (state.etapaAtual < 6) {
      dispatch({ type: 'SET_ETAPA', payload: state.etapaAtual + 1 });
    }
  };

  const etapaAnterior = () => {
    if (state.etapaAtual > 1) {
      dispatch({ type: 'SET_ETAPA', payload: state.etapaAtual - 1 });
    }
  };

  const finalizarPedido = () => {
    if (pedidoTempCompleto) {
      const novoPedido: Pedido = {
        id: Date.now().toString(),
        data: state.pedidoTemp.data || state.dataAtual,
        nome: state.pedidoTemp.nome || '',
        sabor: state.pedidoTemp.sabor || '',
        quantidade: state.pedidoTemp.quantidade || 0,
        precoUnitario: precoUnitarioAtual,
        valorTotal: valorTotalPedidoTemp,
        pago: state.pedidoTemp.pago || false,
        criadoEm: new Date()
      };

      dispatch({ type: 'ADD_PEDIDO', payload: novoPedido });
      dispatch({ type: 'RESET_PEDIDO_TEMP' });
    }
  };

  const cancelar = () => {
    dispatch({ type: 'RESET_PEDIDO_TEMP' });
  };

  const renderEtapa = () => {
    switch (state.etapaAtual) {
      case 1: return <Etapa1Data />;
      case 2: return <Etapa2Nome />;
      case 3: return <Etapa3Sabor />;
      case 4: return <Etapa4Quantidade />;
      case 5: return <Etapa5Preco />;
      case 6: return <Etapa6Pagamento />;
      default: return <Etapa1Data />;
    }
  };

  const podeProxima = () => {
    switch (state.etapaAtual) {
      case 1: return !!state.pedidoTemp.data;
      case 2: return !!state.pedidoTemp.nome?.trim();
      case 3: return !!state.pedidoTemp.sabor;
      case 4: return !!(state.pedidoTemp.quantidade && state.pedidoTemp.quantidade > 0);
      case 5: return true;
      case 6: return pedidoTempCompleto;
      default: return false;
    }
  };

  const progressoPercentual = (state.etapaAtual / 6) * 100;

  return (
    <div className="space-y-4">
      {/* Indicador de Progresso */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Novo Pedido</CardTitle>
            <span className="text-sm text-gray-500">
              Etapa {state.etapaAtual} de 6
            </span>
          </div>
          <Progress value={progressoPercentual} className="h-2" />
        </CardHeader>
      </Card>

      {/* Etapa Atual */}
      <Card className="shadow-sm min-h-[300px]">
        <CardContent className="p-6">
          {renderEtapa()}
        </CardContent>
      </Card>

      {/* Botões de Navegação */}
      <div className="flex gap-3">
        {state.etapaAtual > 1 && (
          <Button
            variant="outline"
            onClick={etapaAnterior}
            className="flex-1"
          >
            Voltar
          </Button>
        )}

        {state.etapaAtual === 1 && (
          <Button
            variant="outline"
            onClick={cancelar}
            className="flex-1"
          >
            Cancelar
          </Button>
        )}

        {state.etapaAtual < 6 ? (
          <Button
            onClick={proximaEtapa}
            disabled={!podeProxima()}
            className="flex-1 bg-blue-500 hover:bg-blue-600"
          >
            Continuar
          </Button>
        ) : (
          <Button
            onClick={finalizarPedido}
            disabled={!pedidoTempCompleto}
            className="flex-1 bg-green-500 hover:bg-green-600"
          >
            Finalizar Pedido
          </Button>
        )}
      </div>
    </div>
  );
}