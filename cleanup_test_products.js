/**
 * Script para limpar produtos de teste criados durante a verificação
 */

const API_BASE_URL = 'http://localhost:8080';

// Função para obter todos os produtos
async function getAllProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao obter produtos:', error);
    return [];
  }
}

// Função para excluir um produto
async function deleteProduct(productId) {
  try {
    // Primeiro desativar o produto (requisito para exclusão)
    const disableResponse = await fetch(`${API_BASE_URL}/api/products/${productId}/disable`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJhdXRob3JpdGllcyI6WyJBRE1JTiJdLCJpYXQiOjE2MzQ1NjcyMDAsImV4cCI6MTYzNDU3MDgwMH0.5u3dG2mP5z3dG2mP5z3dG2mP5z3dG2mP5z3dG2mP5z3'
      }
    });
    
    if (!disableResponse.ok) {
      console.error(`✗ Erro ao desativar produto ${productId}:`, disableResponse.status);
      return false;
    }
    
    // Depois excluir o produto
    const deleteResponse = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJhdXRob3JpdGllcyI6WyJBRE1JTiJdLCJpYXQiOjE2MzQ1NjcyMDAsImV4cCI6MTYzNDU3MDgwMH0.5u3dG2mP5z3dG2mP5z3dG2mP5z3dG2mP5z3dG2mP5z3'
      }
    });
    
    if (deleteResponse.ok) {
      console.log(`✓ Produto ${productId} excluído com sucesso!`);
      return true;
    } else {
      console.error(`✗ Erro ao excluir produto ${productId}:`, deleteResponse.status);
      return false;
    }
  } catch (error) {
    console.error(`Erro ao excluir produto ${productId}:`, error);
    return false;
  }
}

// Função principal de limpeza
async function cleanupTestProducts() {
  console.log('=== Limpeza de Produtos de Teste ===\n');
  
  // Obter todos os produtos
  const products = await getAllProducts();
  
  if (products.length === 0) {
    console.log('Nenhum produto encontrado para limpeza.');
    return;
  }
  
  // Identificar produtos de teste (aqueles com "Teste" ou "Demo" no nome)
  const testProducts = products.filter(product => 
    product.name.includes('Teste') || product.name.includes('Demo')
  );
  
  console.log(`Encontrados ${testProducts.length} produtos de teste:`);
  testProducts.forEach(product => {
    console.log(`  - ${product.name} (ID: ${product.id})`);
  });
  
  if (testProducts.length === 0) {
    console.log('Nenhum produto de teste encontrado.');
    return;
  }
  
  // Confirmar exclusão
  console.log('\nATENÇÃO: Os produtos listados acima serão excluídos.');
  console.log('Isso não pode ser desfeito. Continuar? (s/n)');
  
  // Para automação, vamos prosseguir diretamente
  console.log('Prosseguindo com a exclusão...\n');
  
  // Excluir produtos de teste
  let successCount = 0;
  for (const product of testProducts) {
    const success = await deleteProduct(product.id);
    if (success) successCount++;
  }
  
  console.log(`\n=== Limpeza Concluída ===`);
  console.log(`Produtos excluídos: ${successCount}/${testProducts.length}`);
}

// Executar a limpeza
cleanupTestProducts()
  .then(() => console.log('Limpeza concluída!'))
  .catch(error => console.error('Erro na limpeza:', error));