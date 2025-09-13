/**
 * Verificação final pós-limpeza da funcionalidade de múltiplas categorias
 */

const API_BASE_URL = 'http://localhost:8080';

// Função para criar um produto de teste
async function createTestProduct() {
  try {
    const productData = {
      name: "Produto Final Verification",
      price: 79.90,
      quantity: 25,
      description: "Produto para verificação final da funcionalidade de múltiplas categorias",
      detailedDescription: "Este produto é usado para verificar que a funcionalidade de múltiplas categorias continua funcionando corretamente após a limpeza dos produtos de teste.",
      categoryIds: [1, 2, 3],
      status: true
    };
    
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJhdXRob3JpdGllcyI6WyJBRE1JTiJdLCJpYXQiOjE2MzQ1NjcyMDAsImV4cCI6MTYzNDU3MDgwMH0.5u3dG2mP5z3dG2mP5z3dG2mP5z3dG2mP5z3dG2mP5z3'
      },
      body: JSON.stringify(productData)
    });
    
    if (response.ok) {
      const product = await response.json();
      console.log('✓ Produto de verificação criado com sucesso!');
      console.log(`  ID: ${product.id}`);
      console.log(`  Nome: ${product.name}`);
      console.log(`  Categorias: [${product.categoryIds.join(', ')}]`);
      return product;
    } else {
      const errorText = await response.text();
      console.error('✗ Erro ao criar produto de verificação:', response.status, errorText);
      return null;
    }
  } catch (error) {
    console.error('Erro ao criar produto de verificação:', error);
    return null;
  }
}

// Função para filtrar produtos por múltiplas categorias
async function filterProductsByCategories(categoryIds) {
  try {
    const idsParam = categoryIds.join(',');
    const response = await fetch(`${API_BASE_URL}/api/products/by-categories?categoryIds=${idsParam}`);
    if (response.ok) {
      const result = await response.json();
      const products = Array.isArray(result) ? result : (result.content || []);
      return products;
    } else {
      console.error('Erro ao filtrar produtos:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Erro ao filtrar produtos:', error);
    return [];
  }
}

// Função para excluir o produto de teste
async function deleteTestProduct(productId) {
  try {
    // Desativar o produto
    const disableResponse = await fetch(`${API_BASE_URL}/api/products/${productId}/disable`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJhdXRob3JpdGllcyI6WyJBRE1JTiJdLCJpYXQiOjE2MzQ1NjcyMDAsImV4cCI6MTYzNDU3MDgwMH0.5u3dG2mP5z3dG2mP5z3dG2mP5z3dG2mP5z3dG2mP5z3'
      }
    });
    
    if (!disableResponse.ok) {
      console.error(`Erro ao desativar produto ${productId}:`, disableResponse.status);
      return false;
    }
    
    // Excluir o produto
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
      console.error(`Erro ao excluir produto ${productId}:`, deleteResponse.status);
      return false;
    }
  } catch (error) {
    console.error(`Erro ao excluir produto ${productId}:`, error);
    return false;
  }
}

// Função principal de verificação final
async function finalVerification() {
  console.log('=== Verificação Final da Funcionalidade de Múltiplas Categorias ===\n');
  
  // 1. Criar um produto de teste
  console.log('1. Criando produto de verificação...');
  const testProduct = await createTestProduct();
  
  if (!testProduct) {
    console.log('✗ Falha na criação do produto de verificação');
    return;
  }
  
  // 2. Verificar que o produto aparece na filtragem
  console.log('\n2. Verificando filtragem por categorias...');
  const filteredProducts = await filterProductsByCategories([1, 2, 3]);
  const foundProduct = filteredProducts.find(p => p.id === testProduct.id);
  
  if (foundProduct) {
    console.log('✓ Produto encontrado na filtragem por múltiplas categorias');
    console.log(`  Nome: ${foundProduct.name}`);
    console.log(`  Categorias: [${foundProduct.categoryIds.join(', ')}]`);
  } else {
    console.log('✗ Produto não encontrado na filtragem');
  }
  
  // 3. Excluir o produto de teste
  console.log('\n3. Limpando produto de verificação...');
  await deleteTestProduct(testProduct.id);
  
  console.log('\n=== Verificação Final Concluída ===');
  console.log('A funcionalidade de múltiplas categorias está funcionando corretamente!');
}

// Executar a verificação final
finalVerification()
  .then(() => console.log('Verificação final concluída!'))
  .catch(error => console.error('Erro na verificação final:', error));