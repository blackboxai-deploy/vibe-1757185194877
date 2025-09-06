"use client";

import { useApp } from '@/contexts/AppContext';
import { useCalculos } from '@/hooks/useCalculos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useState } from 'react';

export default function PedidosTab() {
  const { state, dispatch } = useApp();
  const { totalDia, pedidosDoDia, formatarMoeda, formatarData } = useCalculos();
  const [calendarioAberto, setCalendarioAberto] = useState(false);

  const alterarData = (data: Date | undefined) => {
    if (data) {
      const dataString = data.toISOString().split('T')[0];
      dispatch({ type: 'SET_DATA', payload: dataString });
    }
    setCalendarioAberto(false);
  };

  const alterarStatusPagamento = (pedidoId: string, pago: boolean) => {
    dispatch({ 
      type: 'UPDATE_PEDIDO', 
      payload: { id: pedidoId, pedido: { pago } } 
    });
  };

  const excluirPedido = (pedidoId: string) => {
    dispatch({ type: 'DELETE_PEDIDO', payload: pedidoId });
  };

  return (
    <div className="space-y-4">
      {/* Seletor de Data */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Pedidos do Dia</CardTitle>
            <Popover open={calendarioAberto} onOpenChange={setCalendarioAberto}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  📅 Alterar Data
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={new Date(state.dataAtual + 'T00:00:00')}
                  onSelect={alterarData}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-sm text-gray-600 capitalize">
            {formatarData(state.dataAtual)}
          </p>
        </CardHeader>
      </Card>

      {/* Resumo do Dia */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 bg-blue-50 border-blue-200">
          <div className="text-center">
            <p className="text-sm text-blue-600 font-medium">Total de Pedidos</p>
            <p className="text-xl font-bold text-blue-800">
              {totalDia.totalPedidos}
            </p>
          </div>
        </Card>
        
        <Card className="p-3 bg-green-50 border-green-200">
          <div className="text-center">
            <p className="text-sm text-green-600 font-medium">Valor Total</p>
            <p className="text-lg font-bold text-green-800">
              {formatarMoeda(totalDia.valorTotal)}
            </p>
          </div>
        </Card>
      </div>

      {/* Status de Pagamentos */}
      {totalDia.totalPedidos > 0 && (
        <Card className="shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-600">💚 Pago:</span>
              <span className="font-semibold text-green-700">
                {formatarMoeda(totalDia.valorTotalPago)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-orange-600">⏳ Não Pago:</span>
              <span className="font-semibold text-orange-700">
                {formatarMoeda(totalDia.valorTotalNaoPago)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Pedidos */}
      {pedidosDoDia.length === 0 ? (
        <Card className="p-8">
          <div className="text-center text-gray-500">
            <p className="text-lg mb-2">📝 Nenhum pedido encontrado</p>
            <p className="text-sm">
              Não há pedidos para {new Date(state.dataAtual + 'T00:00:00').toLocaleDateString('pt-BR')}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {pedidosDoDia.map((pedido) => (
            <Card key={pedido.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header do Pedido */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{pedido.nome}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(pedido.criadoEm).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <Badge 
                      variant={pedido.pago ? "default" : "outline"}
                      className={pedido.pago 
                        ? "bg-green-500 hover:bg-green-600" 
                        : "border-orange-300 text-orange-700"
                      }
                    >
                      {pedido.pago ? "PAGO" : "NÃO PAGO"}
                    </Badge>
                  </div>

                  {/* Detalhes do Pedido */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Sabor:</span>
                      <p className="font-medium">{pedido.sabor}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Quantidade:</span>
                      <p className="font-medium">
                        {pedido.quantidade} {pedido.quantidade === 1 ? 'torta' : 'tortas'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Preço Unit.:</span>
                      <p className="font-medium">{formatarMoeda(pedido.precoUnitario)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Total:</span>
                      <p className="font-bold text-lg text-green-600">
                        {formatarMoeda(pedido.valorTotal)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Ações */}
                  <div className="flex justify-between items-center">
                    {/* Switch de Pagamento */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={pedido.pago}
                        onCheckedChange={(pago) => alterarStatusPagamento(pedido.id, pago)}
                      />
                      <span className="text-sm text-gray-600">
                        {pedido.pago ? 'Pago' : 'Marcar como pago'}
                      </span>
                    </div>

                    {/* Botão Excluir */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          🗑️ Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o pedido de <strong>{pedido.nome}</strong>?
                            <br />
                            Sabor: {pedido.sabor} - Valor: {formatarMoeda(pedido.valorTotal)}
                            <br />
                            <strong>Esta ação não pode ser desfeita.</strong>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => excluirPedido(pedido.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Excluir Pedido
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}