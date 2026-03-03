
export function formatDateTime(date, hour = 0, min = 0, sec = 0) {
  if (!date) return undefined;
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}


function parseValorMoeda(valor) {
  if (!valor) return undefined;
  const numeroStr = valor.replace(/[R$\s.]/g, '').replace(',', '.');
  const numero = Number(numeroStr);
  return isNaN(numero) ? undefined : numero;
}


function parseDateString(dateStr, isEnd = false) {
  if (!dateStr) return undefined;
  const hour = isEnd ? 23 : 0;
  const min = isEnd ? 59 : 0;
  const sec = isEnd ? 59 : 0;
  return `${dateStr} ${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}


export function buildAtendimentoFilters({
  periodo,
  idFogazzas = [],
  tipoCliente = [],
  valorMinimo = '',
  valorMaximo = '',
  dataMin = '',
  dataMax = '',
  idAtendimentos = []
}) {
  return {
    id_atendimento: idAtendimentos.length > 0 ? idAtendimentos : undefined,
    id_fogazzas: idFogazzas.length > 0 ? idFogazzas : undefined,
    tipo_cliente: tipoCliente.length > 0 ? tipoCliente : undefined,
    preco_min: parseValorMoeda(valorMinimo),
    preco_max: parseValorMoeda(valorMaximo),
    data_hora_min: dataMin ? parseDateString(dataMin, false) : (periodo?.start ? formatDateTime(periodo.start, 0, 0, 0) : undefined),
    data_hora_max: dataMax ? parseDateString(dataMax, true) : (periodo?.end ? formatDateTime(periodo.end, 23, 59, 59) : undefined),
    pagina: 1,
    limit: 20,
    order_by: 'comprado_em',
    order_dir: 'desc'
  };
}
