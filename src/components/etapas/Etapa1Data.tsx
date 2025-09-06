"use client";

import { useApp } from '@/contexts/AppContext';
import { useCalculos } from '@/hooks/useCalculos';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';

export default function Etapa1Data() {
  const { state, dispatch } = useApp();
  const { formatarData } = useCalculos();

  const handleDataChange = (data: Date | undefined) => {
    if (data) {
      const dataString = data.toISOString().split('T')[0];
      dispatch({ type: 'SET_DATA', payload: dataString });
      dispatch({ type: 'UPDATE_PEDIDO_TEMP', payload: { data: dataString } });
    }
  };

  const dataAtual = state.pedidoTemp.data 
    ? new Date(state.pedidoTemp.data + 'T00:00:00')
    : new Date(state.dataAtual + 'T00:00:00');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          📅 Data do Pedido
        </h2>
      </div>

      {/* Data Selecionada */}
      {state.pedidoTemp.data && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="text-center">
            <p className="text-lg font-semibold text-blue-800 capitalize">
              {formatarData(state.pedidoTemp.data)}
            </p>
          </div>
        </Card>
      )}

      {/* Calendário */}
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={dataAtual}
          onSelect={handleDataChange}
          className="rounded-md border shadow-sm"
          locale={{
            localize: {
              day: (n: number) => ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][n],
              month: (n: number) => ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][n]
            }
          }}
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 hover:bg-blue-100 rounded-md",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
            day: "h-9 w-9 p-0 font-normal hover:bg-blue-100 rounded-md",
            day_selected: "bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600",
            day_today: "bg-gray-100 text-gray-900 font-medium",
            day_outside: "text-gray-300",
            day_disabled: "text-gray-300",
            day_hidden: "invisible"
          }}
        />
      </div>

      {/* Dica */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          💡 Os pedidos serão agrupados por data para melhor organização
        </p>
      </div>
    </div>
  );
}