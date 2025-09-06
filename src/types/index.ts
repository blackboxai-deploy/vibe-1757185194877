// Tipos principais do aplicativo
export interface Pedido {
  id: string;
  data: string;
  nome: string;
  sabor: string;
  quantidade: number;
  precoUnitario: number;
  valorTotal: number;
  pago: boolean;
  criadoEm: Date;
}

export interface Sabor {
  nome: string;
  preco: number;
}

export interface TotalDia {
  data: string;
  totalPedidos: number;
  valorTotalPago: number;
  valorTotalNaoPago: number;
  valorTotal: number;
}

export interface RelatoriGeral {
  totalGeralPago: number;
  totalGeralNaoPago: number;
  totalGeral: number;
  totalPedidos: number;
  saboresMaisVendidos: Array<{ sabor: string; quantidade: number }>;
}

export interface AppState {
  pedidos: Pedido[];
  sabores: Sabor[];
  dataAtual: string;
  etapaAtual: number;
  pedidoTemp: Partial<Pedido>;
}