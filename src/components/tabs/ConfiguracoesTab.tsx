"use client";

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useCalculos } from '@/hooks/useCalculos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

export default function ConfiguracoesTab() {
  const { state, dispatch } = useApp();
  const { formatarMoeda } = useCalculos();
  const [novoSabor, setNovoSabor] = useState('');
  const [novoPreco, setNovoPreco] = useState('');
  const [editandoSabor, setEditandoSabor] = useState<string | null>(null);
  const [precoEditado, setPrecoEditado] = useState('');
  const [dialogNovoAberto, setDialogNovoAberto] = useState(false);
  const [dialogEditarAberto, setDialogEditarAberto] = useState(false);

  // Adicionar novo sabor
  const adicionarSabor = () => {
    if (novoSabor.trim() && novoPreco) {
      const preco = parseFloat(novoPreco.replace(',', '.'));
      if (preco > 0) {
        dispatch({ 
          type: 'ADD_SABOR', 
          payload: { nome: novoSabor.trim(), preco } 
        });
        setNovoSabor('');
        setNovoPreco('');
        setDialogNovoAberto(false);
      }
    }
  };

  // Iniciar edição
  const iniciarEdicao = (sabor: string, preco: number) => {
    setEditandoSabor(sabor);
    setPrecoEditado(preco.toString().replace('.', ','));
    setDialogEditarAberto(true);
  };

  // Salvar edição
  const salvarEdicao = () => {
    if (editandoSabor && precoEditado) {
      const preco = parseFloat(precoEditado.replace(',', '.'));
      if (preco > 0) {
        dispatch({
          type: 'UPDATE_SABOR',
          payload: {
            nome: editandoSabor,
            sabor: { nome: editandoSabor, preco }
          }
        });
        setEditandoSabor(null);
        setPrecoEditado('');
        setDialogEditarAberto(false);
      }
    }
  };

  // Excluir sabor
  const excluirSabor = (sabor: string) => {
    dispatch({ type: 'DELETE_SABOR', payload: sabor });
  };

  // Resetar todos os dados
  const resetarTodosDados = () => {
    dispatch({ type: 'RESET_ALL' });
    localStorage.removeItem('tortas-app-data');
  };

  // Exportar dados
  const exportarDados = () => {
    const dados = {
      pedidos: state.pedidos,
      sabores: state.sabores,
      exportadoEm: new Date().toISOString()
    };
    const arquivo = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(arquivo);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tortas-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">⚙️ Configurações</CardTitle>
          <p className="text-sm text-gray-600">
            Gerencie sabores, preços e dados do app
          </p>
        </CardHeader>
      </Card>

      {/* Gerenciar Sabores */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">🍰 Gerenciar Sabores</CardTitle>
            <Dialog open={dialogNovoAberto} onOpenChange={setDialogNovoAberto}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                  ➕ Adicionar
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Novo Sabor</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="novo-sabor-config">Nome do Sabor</Label>
                    <Input
                      id="novo-sabor-config"
                      value={novoSabor}
                      onChange={(e) => setNovoSabor(e.target.value)}
                      placeholder="Ex: Chocolate Branco"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="novo-preco-config">Preço (R$)</Label>
                    <Input
                      id="novo-preco-config"
                      value={novoPreco}
                      onChange={(e) => setNovoPreco(e.target.value)}
                      placeholder="Ex: 25,00"
                      type="number"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setDialogNovoAberto(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={adicionarSabor}
                      disabled={!novoSabor.trim() || !novoPreco}
                      className="flex-1 bg-blue-500 hover:bg-blue-600"
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {state.sabores.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              <p>Nenhum sabor cadastrado</p>
            </div>
          ) : (
            state.sabores.map((sabor) => (
              <div key={sabor.nome} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{sabor.nome}</p>
                  <p className="text-sm text-gray-600">{formatarMoeda(sabor.preco)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => iniciarEdicao(sabor.nome, sabor.preco)}
                  >
                    ✏️ Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600">
                        🗑️
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Sabor</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o sabor <strong>{sabor.nome}</strong>?
                          <br />
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => excluirSabor(sabor.nome)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Dialog para Editar Sabor */}
      <Dialog open={dialogEditarAberto} onOpenChange={setDialogEditarAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Sabor: {editandoSabor}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preco-editado">Novo Preço (R$)</Label>
              <Input
                id="preco-editado"
                value={precoEditado}
                onChange={(e) => setPrecoEditado(e.target.value)}
                placeholder="Ex: 25,00"
                type="number"
                step="0.01"
                min="0"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setDialogEditarAberto(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={salvarEdicao}
                disabled={!precoEditado}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Backup e Dados */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">💾 Backup e Dados</CardTitle>
          <p className="text-sm text-gray-600">
            Gerencie seus dados e faça backup
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Total de Pedidos</p>
              <p className="text-xl font-bold text-blue-800">{state.pedidos.length}</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600">Sabores Cadastrados</p>
              <p className="text-xl font-bold text-purple-800">{state.sabores.length}</p>
            </div>
          </div>

          {/* Ações */}
          <div className="space-y-3">
            <Button
              onClick={exportarDados}
              className="w-full"
              variant="outline"
            >
              📥 Exportar Dados (JSON)
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50">
                  🗑️ Resetar Todos os Dados
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Resetar Todos os Dados</AlertDialogTitle>
                  <AlertDialogDescription>
                    <strong>ATENÇÃO:</strong> Esta ação irá excluir todos os pedidos e restaurar os sabores padrão.
                    <br /><br />
                    Dados que serão perdidos:
                    <br />• {state.pedidos.length} pedidos
                    <br />• Sabores personalizados
                    <br />• Todo o histórico
                    <br /><br />
                    <strong>Esta ação NÃO pode ser desfeita.</strong>
                    <br /><br />
                    Recomendamos fazer um backup antes de continuar.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={resetarTodosDados}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Confirmar Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Sobre o App */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">ℹ️ Sobre o App</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>🥧 Tortas & Pedidos</strong></p>
            <p>Aplicativo para gerenciar pedidos de tortas com organização por data.</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline">Navegação em Abas</Badge>
              <Badge variant="outline">Persistência Local</Badge>
              <Badge variant="outline">Cálculos Automáticos</Badge>
              <Badge variant="outline">Interface iOS Style</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}