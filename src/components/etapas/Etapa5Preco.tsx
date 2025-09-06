"use client";

import { useApp } from '@/contexts/AppContext';
import { useCalculos } from '@/hooks/useCalculos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function Etapa5Preco() {
  const { state } = useApp();
  const { valorTotalPedidoTemp, precoUnitarioAtual, formatarMoeda } = useCalculos();

  const resumoPedido = {
    data: state.pedidoTemp.data || '',
    nome: state.pedidoTemp.nome || '',
    sabor: state.pedidoTemp.sabor || '',
    quantidade: state.pedidoTemp.quantidade || 0,
    precoUnitario: precoUnitarioAtual,
    valorTotal: valorTotalPedidoTemp
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          💰 Resumo do Pedido
        </h2>
        <p className="text-sm text-gray-600">
          Confira os valores e detalhes do pedido
        </p>
      </div>

      {/* Card Principal com Resumo */}
      <Card className="shadow-lg border-2 border-green-200">
        <CardHeader className="bg-green-50 rounded-t-lg">
          <CardTitle className="text-center text-lg text-green-800">
            Detalhes do Pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Informações do Cliente */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Cliente:</span>
              <span className="text-sm font-semibold text-gray-900">{resumoPedido.nome}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Data:</span>
              <span className="text-sm text-gray-900">
                {new Date(resumoPedido.data + 'T00:00:00').toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          <Separator />

          {/* Detalhes do Produto */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Sabor:</span>
              <span className="text-sm font-semibold text-gray-900">{resumoPedido.sabor}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Quantidade:</span>
              <span className="text-sm text-gray-900">
                {resumoPedido.quantidade} {resumoPedido.quantidade === 1 ? 'torta' : 'tortas'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Preço Unitário:</span>
              <span className="text-sm font-mono text-gray-900">
                {formatarMoeda(resumoPedido.precoUnitario)}
              </span>
            </div>
          </div>

          <Separator />

          {/* Cálculo Total */}
          <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Cálculo:</span>
              <span className="font-mono">
                {resumoPedido.quantidade} × {formatarMoeda(resumoPedido.precoUnitario)}
              </span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-green-600">
              <span>Total:</span>
              <span className="font-mono text-2xl">
                {formatarMoeda(resumoPedido.valorTotal)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards de Informação */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 bg-blue-50 border-blue-200">
          <div className="text-center">
            <div className="text-sm text-blue-600 font-medium">Preço Unit.</div>
            <div className="text-lg font-bold text-blue-800">
              {formatarMoeda(resumoPedido.precoUnitario)}
            </div>
          </div>
        </Card>
        
        <Card className="p-3 bg-purple-50 border-purple-200">
          <div className="text-center">
            <div className="text-sm text-purple-600 font-medium">Quantidade</div>
            <div className="text-lg font-bold text-purple-800">
              {resumoPedido.quantidade}
            </div>
          </div>
        </Card>
      </div>

      {/* Valor Total Destacado */}
      <Card className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="text-center">
          <p className="text-sm opacity-90 mb-1">Valor Total do Pedido</p>
          <p className="text-3xl font-bold">
            {formatarMoeda(resumoPedido.valorTotal)}
          </p>
        </div>
      </Card>

      {/* Dica */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          💡 Na próxima etapa você poderá marcar se o pedido já foi pago
        </p>
      </div>

      {/* Validação Visual */}
      <div className="flex justify-center">
        {resumoPedido.valorTotal > 0 ? (
          <div className="flex items-center text-green-600 text-sm">
            <span className="mr-1">✓</span>
            Valores calculados automaticamente
          </div>
        ) : (
          <div className="flex items-center text-red-500 text-sm">
            <span className="mr-1">⚠</span>
            Erro no cálculo dos valores
          </div>
        )}
      </div>
    </div>
  );
}