import { useState, useEffect } from 'react';
import { format, startOfDay, endOfDay } from 'date-fns';
import { FaCalendarDay } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Filtros({ periodo, setPeriodo }) {
    const renderPeriodoSelecionado = () => {
      if (periodo?.start && periodo?.end) {
        const isHoje = format(periodo.start, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') &&
                      format(periodo.end, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
        if (isHoje) return null;
        const inicio = format(periodo.start, 'dd/MM/yyyy');
        const fim = format(periodo.end, 'dd/MM/yyyy');
        return (
          <div className="mb-2 text-sm text-gray-700 font-medium flex items-center gap-2">
            <span className="inline-block bg-green-igreja/10 text-green-900 px-2 py-1 rounded">
              Período filtrado: <b>{inicio}</b> até <b>{fim}</b>
            </span>
          </div>
        );
      }
      return null;
    };
  const today = new Date();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(periodo?.start || today);
  const [endDate, setEndDate] = useState(periodo?.end || today);

  useEffect(() => {
    setStartDate(periodo?.start ? new Date(periodo.start) : today);
    setEndDate(periodo?.end ? new Date(periodo.end) : today);
  }, [periodo]);

  const isHoje = periodo?.start && periodo?.end &&
    format(periodo.start, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') &&
    format(periodo.end, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  const isTodos = !periodo?.start && !periodo?.end;

  const handleHoje = () => {
    setPeriodo({
      start: startOfDay(today),
      end: endOfDay(today)
    });
  };
  const handleTodos = () => {
    setPeriodo({ start: null, end: null });
  };

  return (
    <div className="flex flex-col rounded-lg p-2 mb-2">
      {renderPeriodoSelecionado()}
      <div className="flex items-center">
        <button
          className="mr-2"
          onClick={() => setShowDatePicker(!showDatePicker)}
          title="Selecionar período"
        >
          <FaCalendarDay size={20} className="text-green-igreja" />
        </button>
        {showDatePicker && (
          <div className="flex items-center p-1 rounded gap-2">
            <input
              type="date"
              value={format(startDate, 'yyyy-MM-dd')}
              onChange={e => {
                const [year, month, day] = e.target.value.split('-');
                setStartDate(new Date(year, month - 1, day));
              }}
              className="border px-2 py-1 rounded text-sm"
            />
            <span>até</span>
            <input
              type="date"
              value={format(endDate, 'yyyy-MM-dd')}
              onChange={e => {
                const [year, month, day] = e.target.value.split('-');
                setEndDate(new Date(year, month - 1, day));
              }}
              className="border px-2 py-1 rounded text-sm"
            />
            <button
              className="bg-green-igreja font-medium text-white text-xs px-3 py-1 rounded hover:bg-green-700 transition-colors duration-200"
              onClick={() => {
                setPeriodo({ start: startOfDay(startDate), end: endOfDay(endDate) });
                setShowDatePicker(false);
              }}
            >FILTRAR</button>
          </div>
        )}
        <motion.button
          onClick={handleHoje}
          whileTap={{ scale: 0.95 }}
          animate={isHoje ? { scale: 1.08 } : { scale: 1, boxShadow: 'none' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 mr-2
            ${isHoje
              ? 'bg-green-igreja text-white shadow-md border border-green-igreja'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-200'}
          `}
          title="Atendimentos de hoje"
        >
          HOJE
        </motion.button>
      </div>
    </div>
  );
}




