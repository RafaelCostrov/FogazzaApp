const API_BASE_URL = 'http://127.0.0.1:5000'

// Função das requisições HTTP
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Erro na requisição:', error)
    throw error
  }
}

export const fogazzaService = {
  async listar() {
    return apiRequest('/fogazza/listar')
  },

  async adicionar(fogazzaData) {
    return apiRequest('/fogazza/adicionar', {
      method: 'POST',
      body: JSON.stringify(fogazzaData),
    })
  },

  async remover(idFogazza) {
    return apiRequest('/fogazza/remover', {
      method: 'DELETE',
      body: JSON.stringify({ id_fogazza: idFogazza }),
    })
  },
}

export const atendimentoService = {
  async adicionar(atendimentoData) {
    return apiRequest('/atendimento/adicionar', {
      method: 'POST',
      body: JSON.stringify(atendimentoData),
    })
  },

  async imprimir(idAtendimento, via) {
    return apiRequest('/atendimento/imprimir', {
      method: 'POST',
      body: JSON.stringify({ id_atendimento: idAtendimento, via: via }),
    })
  },

  async filtrar(filtros = {}) {
    return apiRequest('/atendimento/filtrar', {
      method: 'POST',
      body: JSON.stringify(filtros),
    })
  },

  async listarTodos() {
    // Usar o filtrar sem parâmetros para listar todos
    return this.filtrar({
      pagina: 1,
      limit: 1000, // Limite alto para pegar todos os registros
      order_by: "comprado_em",
      order_dir: "desc"
    })
  },
}

export default fogazzaService