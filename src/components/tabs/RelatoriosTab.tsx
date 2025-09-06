"use client";

import { useApp } from '@/contexts/AppContext';
import { useCalculos } from '@/hooks/useCalculos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

export default function RelatoriosTab() {
  const { state } = useApp();
  const { relatorioGeral, formatarMoeda } = useCalculos();

  const percentualPago = relatorioGeral.totalGeral > 0 
    ? (relatorioGeral.totalGeralPago / relatorioGeral.totalGeral) * 100 
    : 0;

  const percentualNaoPago = relatorioGeral.totalGeral > 0 
    ? (relatorioGeral.totalGeralNaoPago / relatorioGeral.totalGeral) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">📊 Relatórios Gerais</CardTitle>
          <p className="text-sm text-gray-600">
            Visão geral de todos os pedidos
          </p>
        </CardHeader>
      </Card>

      {/* Totais Gerais */}
      <div className="grid grid-cols-1 gap-4">
        {/* Total Geral */}
        <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="text-center">
            <p className="text-sm opacity-90 mb-1">Total Geral de Vendas</p>
            <p className="text-3xl font-bold mb-2">
              {formatarMoeda(relatorioGeral.totalGeral)}
            </p>
            <p className="text-sm opacity-80">
              {relatorioGeral.totalPedidos} {relatorioGeral.totalPedidos === 1 ? 'pedido' : 'pedidos'}
            </p>
          </div>
        </Card>

        {/* Divisão Pago vs Não Pago */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="text-center">
              <p className="text-sm text-green-600 font-medium mb-1">💚 Pagos</p>
              <p className="text-xl font-bold text-green-700 mb-1">
                {formatarMoeda(relatorioGeral.totalGeralPago)}
              </p>
              <p className="text-xs text-green-600">
                {percentualPago.toFixed(1)}% do total
              </p>
            </div>
          </Card>

          <Card className="p-4 bg-orange-50 border-orange-200">
            <div className="text-center">
              <p className="text-sm text-orange-600 font-medium mb-1">⏳ Não Pagos</p>
              <p className="text-xl font-bold text-orange-700 mb-1">
                {formatarMoeda(relatorioGeral.totalGeralNaoPago)}
              </p>
              <p className="text-xs text-orange-600">
                {percentualNaoPago.toFixed(1)}% do total
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Progresso Visual */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Status de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Barra de Progresso Pago */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-600 font-medium">Valores Pagos</span>
              <span className="text-green-600">{percentualPago.toFixed(1)}%</span>
            </div>
            <Progress value={percentualPago} className="h-3 bg-gray-200">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${percentualPago}%` }}
              />
            </Progress>
          </div>

          {/* Barra de Progresso Não Pago */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-orange-600 font-medium">Valores Pendentes</span>
              <span className="text-orange-600">{percentualNaoPago.toFixed(1)}%</span>
            </div>
            <Progress value={percentualNaoPago} className="h-3 bg-gray-200">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${percentualNaoPago}%` }}
              />
            </Progress>
          </div>
        </CardContent>
      </Card>

      {/* Sabores Mais Vendidos */}
      {relatorioGeral.saboresMaisVendidos.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">🏆 Sabores Mais Vendidos</CardTitle>
            <p className="text-sm text-gray-600">
              Ranking por quantidade de tortas vendidas
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {relatorioGeral.saboresMaisVendidos.map((item, index) => {
              const maxQuantidade = relatorioGeral.saboresMaisVendidos[0]?.quantidade || 1;
              const percentual = (item.quantidade / maxQuantidade) * 100;
              
              return (
                <div key={item.sabor} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}
                      </span>
                      <span className="font-medium text-gray-900">{item.sabor}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-blue-600">
                        {item.quantidade}
                      </span>
                      <span className="text-sm text-gray-600 ml-1">
                        {item.quantidade === 1 ? 'torta' : 'tortas'}
                      </span>
                    </div>
                  </div>
                  <Progress value={percentual} className="h-2 bg-gray-100">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentual}%` }}
                    />
                  </Progress>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Estatísticas Detalhadas */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">📈 Estatísticas Detalhadas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de Pedidos:</span>
                <span className="font-semibold">{relatorioGeral.totalPedidos}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sabores Únicos:</span>
                <span className="font-semibold">{state.sabores.length}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Ticket Médio:</span>
                <span className="font-semibold">
                  {relatorioGeral.totalPedidos > 0 
                    ? formatarMoeda(relatorioGeral.totalGeral / relatorioGeral.totalPedidos)
                    : formatarMoeda(0)
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">A Receber:</span>
                <span className="font-semibold text-orange-600">
                  {formatarMoeda(relatorioGeral.totalGeralNaoPago)}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Resumo por Status */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Resumo Financeiro</h4>
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">💰 Total Faturado:</span>
                <span className="font-bold text-green-600">
                  {formatarMoeda(relatorioGeral.totalGeral)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">✅ Já Recebido:</span>
                <span className="font-semibold text-green-600">
                  {formatarMoeda(relatorioGeral.totalGeralPago)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">⏰ Pendente:</span>
                <span className="font-semibold text-orange-600">
                  {formatarMoeda(relatorioGeral.totalGeralNaoPago)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mensagem se não houver dados */}
      {relatorioGeral.totalPedidos === 0 && (
        <Card className="p-8">
          <div className="text-center text-gray-500">
            <p className="text-lg mb-2">📊 Nenhum dado encontrado</p>
            <p className="text-sm">
              Adicione alguns pedidos para ver os relatórios aqui
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}