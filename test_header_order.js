// Script para testar a funcionalidade de ordenação de categorias no header
// Este script pode ser executado no console do navegador na página de administração

async function testHeaderOrder() {
  try {
    // Obter token de autenticação (você precisa estar logado como admin)
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
      console.error('Você precisa estar logado como administrador para executar este teste');
      return;
    }
    
    // Obter todas as categorias
    const response = await fetch('http://localhost:8080/api/categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar categorias: ${response.status}`);
    }
    
    const categories = await response.json();
    console.log('Categorias encontradas:', categories);
    
    // Filtrar categorias que estão configuradas para aparecer no header
    const headerCategories = categories.filter(cat => cat.showInHeader);
    console.log('Categorias do header:', headerCategories);
    
    // Criar uma nova ordem (por exemplo, invertendo a ordem atual)
    const reorderedCategories = [...headerCategories].reverse();
    const categoryIds = reorderedCategories.map(cat => cat.id);
    
    console.log('Nova ordem proposta:', categoryIds);
    
    // Atualizar a ordem no backend
    const updateResponse = await fetch('http://localhost:8080/api/categories/header-order', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(categoryIds)
    });
    
    if (!updateResponse.ok) {
      throw new Error(`Erro ao atualizar ordem das categorias: ${updateResponse.status}`);
    }
    
    console.log('Ordem das categorias atualizada com sucesso!');
    
    // Verificar a nova ordem
    const verifyResponse = await fetch('http://localhost:8080/api/categories/header', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!verifyResponse.ok) {
      throw new Error(`Erro ao verificar categorias do header: ${verifyResponse.status}`);
    }
    
    const updatedCategories = await verifyResponse.json();
    console.log('Categorias do header após atualização:', updatedCategories);
    
  } catch (error) {
    console.error('Erro no teste:', error);
  }
}

// Para executar o teste, chame a função:
// testHeaderOrder();