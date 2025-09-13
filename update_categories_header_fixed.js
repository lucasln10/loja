// Script corrigido para atualizar categorias existentes e configurá-las para aparecer no header
const API_BASE_URL = 'http://localhost:8080';

async function updateCategories() {
  try {
    console.log('Iniciando atualização das categorias...');
    
    // Obter todas as categorias
    const response = await fetch(`${API_BASE_URL}/api/categories`);
    if (!response.ok) {
      throw new Error(`Erro HTTP! status: ${response.status}`);
    }
    
    const categories = await response.json();
    console.log(`Encontradas ${categories.length} categorias`);
    
    // Atualizar cada categoria para mostrar no header
    for (const category of categories) {
      console.log(`Atualizando categoria: ${category.name} (ID: ${category.id})`);
      
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
        console.log(`✓ Categoria ${category.name} atualizada com sucesso!`);
      } else {
        console.error(`✗ Erro ao atualizar categoria ${category.name}:`, await updateResponse.text());
      }
    }
    
    console.log('Todas as categorias foram processadas!');
    
    // Verificar categorias do header após atualização
    console.log('Verificando categorias do header...');
    const headerResponse = await fetch(`${API_BASE_URL}/api/categories/header`);
    if (headerResponse.ok) {
      const headerCategories = await headerResponse.json();
      console.log(`Categorias visíveis no header: ${headerCategories.length}`);
      headerCategories.forEach(cat => console.log(`  - ${cat.name}`));
    } else {
      console.error('Erro ao obter categorias do header');
    }
  } catch (error) {
    console.error('Erro ao atualizar categorias:', error);
  }
}

// Executar a função
console.log('Script de atualização de categorias iniciado...');
updateCategories()
  .then(() => console.log('Script finalizado com sucesso!'))
  .catch(error => console.error('Erro no script:', error));