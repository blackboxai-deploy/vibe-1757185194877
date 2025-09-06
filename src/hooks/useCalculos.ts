"use client";

import { useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { TotalDia, RelatoriGeral } from '@/types';

export function useCalculos() {
  const { state } = useApp();

  // Calcular totais do dia selecionado
  const totalDia = useMemo((): TotalDia => {
    const pedidosDoDia = state.pedidos.filter(p => p.data === state.dataAtual);
    
    return pedidosDoDia.reduce(
      (acc, pedido) => ({
        data: state.dataAtual,
        totalPedidos: acc.totalPedidos + 1,
        valorTotalPago: acc.valorTotalPago + (pedido.pago ? pedido.valorTotal : 0),
        valorTotalNaoPago: acc.valorTotalNaoPago + (!pedido.pago ? pedido.valorTotal : 0),
        valorTotal: acc.valorTotal + pedido.valorTotal
      }),
      {
        data: state.dataAtual,
        totalPedidos: 0,
        valorTotalPago: 0,
        valorTotalNaoPago: 0,
        valorTotal: 0
      }
    );
  }, [state.pedidos, state.dataAtual]);

  // Calcular relatório geral
  const relatorioGeral = useMemo((): RelatoriGeral => {
    const totais = state.pedidos.reduce(
      (acc, pedido) => ({
        totalGeralPago: acc.totalGeralPago + (pedido.pago ? pedido.valorTotal : 0),
        totalGeralNaoPago: acc.totalGeralNaoPago + (!pedido.pago ? pedido.valorTotal : 0),
        totalGeral: acc.totalGeral + pedido.valorTotal,
        totalPedidos: acc.totalPedidos + 1
      }),
      {
        totalGeralPago: 0,
        totalGeralNaoPago: 0,
        totalGeral: 0,
        totalPedidos: 0
      }
    );

    // Calcular sabores mais vendidos
    const contadorSabores = state.pedidos.reduce((acc, pedido) => {
      acc[pedido.sabor] = (acc[pedido.sabor] || 0) + pedido.quantidade;
      return acc;
    }, {} as Record<string, number>);

    const saboresMaisVendidos = Object.entries(contadorSabores)
      .map(([sabor, quantidade]) => ({ sabor, quantidade: quantidade as number }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);

    return {
      ...totais,
      saboresMaisVendidos
    };
  }, [state.pedidos]);

  // Obter pedidos do dia atual
  const pedidosDoDia = useMemo(() => {
    return state.pedidos
      .filter(p => p.data === state.dataAtual)
      .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
  }, [state.pedidos, state.dataAtual]);

  // Calcular valor total do pedido temporário
  const valorTotalPedidoTemp = useMemo(() => {
    if (!state.pedidoTemp.sabor || !state.pedidoTemp.quantidade) return 0;
    
    const sabor = state.sabores.find(s => s.nome === state.pedidoTemp.sabor);
    if (!sabor) return 0;
    
    return sabor.preco * state.pedidoTemp.quantidade;
  }, [state.pedidoTemp, state.sabores]);

  // Obter preço unitário do sabor selecionado
  const precoUnitarioAtual = useMemo(() => {
    if (!state.pedidoTemp.sabor) return 0;
    
    const sabor = state.sabores.find(s => s.nome === state.pedidoTemp.sabor);
    return sabor?.preco || 0;
  }, [state.pedidoTemp.sabor, state.sabores]);

  // Verificar se pedido temporário está completo
  const pedidoTempCompleto = useMemo(() => {
    return !!(
      state.pedidoTemp.data &&
      state.pedidoTemp.nome?.trim() &&
      state.pedidoTemp.sabor &&
      state.pedidoTemp.quantidade &&
      state.pedidoTemp.quantidade > 0
    );
  }, [state.pedidoTemp]);

  // Formatar moeda
  const formatarMoeda = (valor: number): string => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Formatar data
  const formatarData = (data: string): string => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return {
    totalDia,
    relatorioGeral,
    pedidosDoDia,
    valorTotalPedidoTemp,
    precoUnitarioAtual,
    pedidoTempCompleto,
    formatarMoeda,
    formatarData
  };
}