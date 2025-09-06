"use client";

import { useApp } from '@/contexts/AppContext';
import { useCalculos } from '@/hooks/useCalculos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function Etapa6Pagamento() {
  const { state, dispatch } = useApp();
  const { valorTotalPedidoTemp, formatarMoeda } = useCalculos();

  const handlePagamentoChange = (pago: boolean) => {
    dispatch({ type: 'UPDATE_PEDIDO_TEMP', payload: { pago } });
  };

  const resumoCompleto = {
    data: state.pedidoTemp.data || '',
    nome: state.pedidoTemp.nome || '',
    sabor: state.pedidoTemp.sabor || '',
    quantidade: state.pedidoTemp.quantidade || 0,
    valorTotal: valorTotalPedidoTemp,
    pago: state.pedidoTemp.pago || false
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          💳 Status do Pagamento
        </h2>
        <p className="text-sm text-gray-600">
          Marque se o pedido já foi pago ou não
        </p>
      </div>

      {/* Resumo Final do Pedido */}
      <Card className="shadow-lg border-2 border-blue-200">
        <CardHeader className="bg-blue-50 rounded-t-lg">
          <CardTitle className="text-center text-lg text-blue-800">
            Resumo Final
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Cliente:</span>
              <p className="font-semibold text-gray-900">{resumoCompleto.nome}</p>
            </div>
            <div>
              <span className="text-gray-600">Data:</span>
              <p className="font-semibold text-gray-900">
                {new Date(resumoCompleto.data + 'T00:00:00').toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Sabor:</span>
              <p className="font-semibold text-gray-900">{resumoCompleto.sabor}</p>
            </div>
            <div>
              <span className="text-gray-600">Quantidade:</span>
              <p className="font-semibold text-gray-900">
                {resumoCompleto.quantidade} {resumoCompleto.quantidade === 1 ? 'torta' : 'tortas'}
              </p>
            </div>
          </div>
          
          <div className="border-t pt-3">
            <div className="text-center">
              <p className="text-sm text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatarMoeda(resumoCompleto.valorTotal)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controle de Pagamento */}
      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Toggle Switch */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="pagamento" className="text-base font-medium">
                  Status do Pagamento
                </Label>
                <p className="text-sm text-gray-500">
                  Marque se o pagamento já foi realizado
                </p>
              </div>
              <Switch
                id="pagamento"
                checked={resumoCompleto.pago}
                onCheckedChange={handlePagamentoChange}
                className="scale-125"
              />
            </div>

            {/* Status Visual */}
            <div className="flex justify-center">
              {resumoCompleto.pago ? (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm">
                  ✓ PAGO
                </Badge>
              ) : (
                <Badge variant="outline" className="border-orange-300 text-orange-700 px-4 py-2 text-sm">
                  ⏳ NÃO PAGO
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Status */}
      <div className="grid grid-cols-1 gap-3">
        {resumoCompleto.pago ? (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="text-center">
              <p className="text-sm text-green-700 mb-2">
                🎉 <strong>Pedido Pago!</strong>
              </p>
              <p className="text-xs text-green-600">
                O valor de {formatarMoeda(resumoCompleto.valorTotal)} foi recebido.
                O pedido será marcado como pago no sistema.
              </p>
            </div>
          </Card>
        ) : (
          <Card className="p-4 bg-orange-50 border-orange-200">
            <div className="text-center">
              <p className="text-sm text-orange-700 mb-2">
                ⏰ <strong>Pagamento Pendente</strong>
              </p>
              <p className="text-xs text-orange-600">
                O valor de {formatarMoeda(resumoCompleto.valorTotal)} ainda precisa ser recebido.
                Você pode alterar isso depois nos relatórios.
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Dica Final */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          💡 Você pode alterar o status de pagamento a qualquer momento nos relatórios
        </p>
      </div>

      {/* Validação Final */}
      <div className="flex justify-center">
        <div className="flex items-center text-green-600 text-sm">
          <span className="mr-1">✓</span>
          Pedido pronto para ser finalizado
        </div>
      </div>
    </div>
  );
}