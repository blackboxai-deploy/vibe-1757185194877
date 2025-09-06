"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import NovoPedidoTab from './tabs/NovoPedidoTab';
import PedidosTab from './tabs/PedidosTab';
import RelatoriosTab from './tabs/RelatoriosTab';
import ConfiguracoesTab from './tabs/ConfiguracoesTab';

export default function TabNavigation() {
  const [activeTab, setActiveTab] = useState('novo-pedido');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header iOS Style */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            🥧 Tortas & Pedidos
          </h1>
          <p className="text-sm text-gray-600">
            Gerencie seus pedidos com facilidade
          </p>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <Card className="mb-4 p-1 shadow-sm">
            <TabsList className="grid w-full grid-cols-4 bg-transparent gap-1">
              <TabsTrigger 
                value="novo-pedido"
                className="text-xs py-2 px-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md"
              >
                Novo
              </TabsTrigger>
              <TabsTrigger 
                value="pedidos"
                className="text-xs py-2 px-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md"
              >
                Hoje
              </TabsTrigger>
              <TabsTrigger 
                value="relatorios"
                className="text-xs py-2 px-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md"
              >
                Relatórios
              </TabsTrigger>
              <TabsTrigger 
                value="config"
                className="text-xs py-2 px-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-md"
              >
                Config
              </TabsTrigger>
            </TabsList>
          </Card>

          <TabsContent value="novo-pedido" className="space-y-4">
            <NovoPedidoTab />
          </TabsContent>

          <TabsContent value="pedidos" className="space-y-4">
            <PedidosTab />
          </TabsContent>

          <TabsContent value="relatorios" className="space-y-4">
            <RelatoriosTab />
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            <ConfiguracoesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}