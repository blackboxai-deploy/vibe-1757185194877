"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Pedido, Sabor } from '@/types';

// Estado inicial
const initialState: AppState = {
  pedidos: [],
  sabores: [
    { nome: 'Chocolate', preco: 25.00 },
    { nome: 'Morango', preco: 28.00 },
    { nome: 'Limão', preco: 22.00 },
    { nome: 'Coco', preco: 26.00 },
    { nome: 'Brigadeiro', preco: 30.00 }
  ],
  dataAtual: new Date().toISOString().split('T')[0],
  etapaAtual: 1,
  pedidoTemp: {}
};

// Tipos de ações
type Action =
  | { type: 'SET_DATA'; payload: string }
  | { type: 'SET_ETAPA'; payload: number }
  | { type: 'UPDATE_PEDIDO_TEMP'; payload: Partial<Pedido> }
  | { type: 'RESET_PEDIDO_TEMP' }
  | { type: 'ADD_PEDIDO'; payload: Pedido }
  | { type: 'UPDATE_PEDIDO'; payload: { id: string; pedido: Partial<Pedido> } }
  | { type: 'DELETE_PEDIDO'; payload: string }
  | { type: 'ADD_SABOR'; payload: Sabor }
  | { type: 'UPDATE_SABOR'; payload: { nome: string; sabor: Sabor } }
  | { type: 'DELETE_SABOR'; payload: string }
  | { type: 'LOAD_DATA'; payload: Partial<AppState> }
  | { type: 'RESET_ALL' };

// Reducer
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, dataAtual: action.payload };
    
    case 'SET_ETAPA':
      return { ...state, etapaAtual: action.payload };
    
    case 'UPDATE_PEDIDO_TEMP':
      return { 
        ...state, 
        pedidoTemp: { ...state.pedidoTemp, ...action.payload }
      };
    
    case 'RESET_PEDIDO_TEMP':
      return { ...state, pedidoTemp: {}, etapaAtual: 1 };
    
    case 'ADD_PEDIDO':
      return { 
        ...state, 
        pedidos: [...state.pedidos, action.payload],
        pedidoTemp: {},
        etapaAtual: 1
      };
    
    case 'UPDATE_PEDIDO':
      return {
        ...state,
        pedidos: state.pedidos.map(p => 
          p.id === action.payload.id 
            ? { ...p, ...action.payload.pedido }
            : p
        )
      };
    
    case 'DELETE_PEDIDO':
      return {
        ...state,
        pedidos: state.pedidos.filter(p => p.id !== action.payload)
      };
    
    case 'ADD_SABOR':
      return {
        ...state,
        sabores: [...state.sabores, action.payload]
      };
    
    case 'UPDATE_SABOR':
      return {
        ...state,
        sabores: state.sabores.map(s => 
          s.nome === action.payload.nome 
            ? action.payload.sabor
            : s
        )
      };
    
    case 'DELETE_SABOR':
      return {
        ...state,
        sabores: state.sabores.filter(s => s.nome !== action.payload)
      };
    
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    
    case 'RESET_ALL':
      return initialState;
    
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

// Provider
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('tortas-app-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Converter strings de data para objetos Date nos pedidos
        const pedidosComData = parsedData.pedidos?.map((p: any) => ({
          ...p,
          criadoEm: new Date(p.criadoEm)
        })) || [];
        
        dispatch({ 
          type: 'LOAD_DATA', 
          payload: {
            ...parsedData,
            pedidos: pedidosComData
          }
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    const dataToSave = {
      pedidos: state.pedidos,
      sabores: state.sabores
    };
    localStorage.setItem('tortas-app-data', JSON.stringify(dataToSave));
  }, [state.pedidos, state.sabores]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook customizado
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
}