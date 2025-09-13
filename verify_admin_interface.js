/**
 * Verificação da funcionalidade de múltiplas categorias na interface administrativa
 * 
 * Este script verifica se a interface administrativa está corretamente
 * exibindo e manipulando produtos com múltiplas categorias.
 */

const API_BASE_URL = 'http://localhost:8080';

// Função para obter todos os produtos
async function getAllProducts() {
  try {
    console.log('Obtendo todos os produtos...');
    const response = await fetch(`${API_BASE_URL}/api/products`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const products = await response.json();
    console.log(`✓ Encontrados ${products.length} produtos`);
    return products;
  } catch (error) {
    console.error('Erro ao obter produtos:', error);
    return [];
  }
}

// Função para verificar se os produtos estão corretamente vinculados às categorias
async function verifyProductCategories(products) {
  console.log('\nVerificando vinculação de categorias nos produtos...');
  
  let allValid = true;
  
  for (const product of products) {
    if (product.categoryIds && product.categoryIds.length > 0) {
      console.log(`  Produto: ${product.name}`);
      console.log(`    Categorias vinculadas: [${product.categoryIds.join(', ')}]`);
      
      // Verificar se todas as categorias existem
      for (const categoryId of product.categoryIds) {
        try {
          const catResponse = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`);
          if (!catResponse.ok) {
            console.log(`    ✗ Categoria ${categoryId} não encontrada`);
            allValid = false;
          } else {
            const category = await catResponse.json();
            console.log(`    ✓ Categoria ${categoryId}: ${category.name}`);
          }
        } catch (error) {
          console.log(`    ✗ Erro ao verificar categoria ${categoryId}: ${error.message}`);
          allValid = false;
        }
      }
    }
  }
  
  return allValid;
}

// Função para testar a atualização de um produto com múltiplas categorias
async function testProductUpdate(productId) {
  try {
    console.log(`\nTestando atualização do produto ${productId}...`);
    
    // Obter o produto atual
    const getResponse = await fetch(`${API_BASE_URL}/api/products/${productId}`);
    if (!getResponse.ok) throw new Error(`HTTP ${getResponse.status}`);
    const currentProduct = await getResponse.json();
    
    console.log(`Produto atual:`);
    console.log(`  Nome: ${currentProduct.name}`);
    console.log(`  Categorias: [${currentProduct.categoryIds ? currentProduct.categoryIds.join(', ') : 'Nenhuma'}]`);
    
    // Atualizar o produto com diferentes categorias
    const updatedProduct = {
      ...currentProduct,
      categoryIds: [2, 4], // Mudar para categorias 2 e 4
      description: `${currentProduct.description} (atualizado)`
    };
    
    console.log(`\nAtualizando para:`);
    console.log(`  Categorias: [${updatedProduct.categoryIds.join(', ')}]`);
    
    // Enviar atualização
    const updateResponse = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJhdXRob3JpdGllcyI6WyJBRE1JTiJdLCJpYXQiOjE2MzQ1NjcyMDAsImV4cCI6MTYzNDU3MDgwMH0.5u3dG2mP5z3dG2mP5z3dG2mP5z3dG2mP5z3dG2mP5z3'
      },
      body: JSON.stringify(updatedProduct)
    });
    
    if (updateResponse.ok) {
      const result = await updateResponse.json();
      console.log('✓ Produto atualizado com sucesso!');
      console.log(`  Novas categorias: [${result.categoryIds ? result.categoryIds.join(', ') : 'Nenhuma'}]`);
      return true;
    } else {
      const errorText = await updateResponse.text();
      console.error('✗ Erro ao atualizar produto:', updateResponse.status, errorText);
      return false;
    }
  } catch (error) {
    console.error('Erro ao testar atualização:', error);
    return false;
  }
}

// Função principal de verificação
async function verifyAdminInterface() {
  console.log('=== Verificação da Interface Administrativa ===\n');
  
  // 1. Obter todos os produtos
  const products = await getAllProducts();
  
  if (products.length === 0) {
    console.log('✗ Nenhum produto encontrado para verificação');
    return;
  }
  
  // 2. Verificar vinculação de categorias
  const categoriesValid = await verifyProductCategories(products);
  
  if (categoriesValid) {
    console.log('\n✓ Todas as categorias estão corretamente vinculadas');
  } else {
    console.log('\n✗ Problemas encontrados nas vinculações de categorias');
  }
  
  // 3. Testar atualização de um produto (usando o primeiro produto com múltiplas categorias)
  const multiCategoryProduct = products.find(p => p.categoryIds && p.categoryIds.length > 1);
  if (multiCategoryProduct) {
    const updateSuccess = await testProductUpdate(multiCategoryProduct.id);
    if (updateSuccess) {
      console.log('\n✓ Atualização de produto com múltiplas categorias funcionando corretamente');
    } else {
      console.log('\n✗ Problemas na atualização de produto com múltiplas categorias');
    }
  } else {
    console.log('\n⚠ Nenhum produto com múltiplas categorias encontrado para teste de atualização');
  }
  
  console.log('\n=== Fim da Verificação ===');
}

// Executar a verificação
verifyAdminInterface()
  .then(() => console.log('Verificação concluída!'))
  .catch(error => console.error('Erro na verificação:', error));