// Script para atualizar categorias existentes e configurá-las para aparecer no header
const API_BASE_URL = 'http://localhost:8080';

async function updateCategories() {
  try {
    // Obter todas as categorias
    const response = await fetch(`${API_BASE_URL}/api/categories`);
    const categories = await response.json();
    
    console.log('Categorias encontradas:', categories);
    
    // Atualizar cada categoria para mostrar no header
    for (const category of categories) {
      // Configurar para mostrar no header e definir ordem
      const updatedCategory = {
        ...category,
        showInHeader: true,
        headerOrder: category.id || 0
      };
      
      // Enviar atualização
      const updateResponse = await fetch(`${API_BASE_URL}/api/categories/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCategory)
      });
      
      if (updateResponse.ok) {
        console.log(`Categoria ${category.name} atualizada com sucesso!`);
      } else {
        console.error(`Erro ao atualizar categoria ${category.name}:`, await updateResponse.text());
      }
    }
    
    console.log('Todas as categorias foram atualizadas!');
    
    // Verificar categorias do header após atualização
    const headerResponse = await fetch(`${API_BASE_URL}/api/categories/header`);
    const headerCategories = await headerResponse.json();
    console.log('Categorias do header após atualização:', headerCategories);
  } catch (error) {
    console.error('Erro ao atualizar categorias:', error);
  }
}

// Executar a função
updateCategories();