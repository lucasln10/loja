// Script para testar a criação de produtos com múltiplas categorias
const API_BASE_URL = 'http://localhost:8080';

async function createTestProduct() {
  try {
    console.log('Iniciando criação de produto com múltiplas categorias...');
    
    // Dados do produto de teste com múltiplas categorias
    const testProduct = {
      name: "Produto Teste Multicategoria",
      price: 99.90,
      quantity: 15,
      description: "Produto de teste para verificar funcionalidade de múltiplas categorias",
      detailedDescription: "Este é um produto de teste criado para verificar se a funcionalidade de vincular múltiplas categorias a um produto está funcionando corretamente.",
      categoryIds: [1, 2, 3], // Vinculando às categorias: Cortadores, Moldes de Silicone, Polymer Clay
      status: true
    };
    
    console.log('Dados do produto:', testProduct);
    
    // Criar o produto
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJhdXRob3JpdGllcyI6WyJBRE1JTiJdLCJpYXQiOjE2MzQ1NjcyMDAsImV4cCI6MTYzNDU3MDgwMH0.5u3dG2mP5z3dG2mP5z3dG2mP5z3dG2mP5z3dG2mP5z3'
      },
      body: JSON.stringify(testProduct)
    });
    
    if (response.ok) {
      const createdProduct = await response.json();
      console.log('✓ Produto criado com sucesso!');
      console.log('ID do produto:', createdProduct.id);
      console.log('Categorias vinculadas:', createdProduct.categoryIds);
      
      // Verificar o produto criado
      console.log('\nVerificando produto criado...');
      const verifyResponse = await fetch(`${API_BASE_URL}/api/products/${createdProduct.id}`);
      if (verifyResponse.ok) {
        const verifiedProduct = await verifyResponse.json();
        console.log('✓ Produto verificado com sucesso!');
        console.log('Nome:', verifiedProduct.name);
        console.log('Categorias vinculadas:', verifiedProduct.categoryIds);
        
        // Listar produtos para confirmar
        console.log('\nListando produtos...');
        const listResponse = await fetch(`${API_BASE_URL}/api/products`);
        if (listResponse.ok) {
          const products = await listResponse.json();
          const foundProduct = products.find(p => p.id === verifiedProduct.id);
          if (foundProduct) {
            console.log('✓ Produto encontrado na listagem!');
            console.log('Categorias no listagem:', foundProduct.categoryIds);
          } else {
            console.log('⚠ Produto não encontrado na listagem');
          }
        }
      }
      
      return createdProduct;
    } else {
      const errorText = await response.text();
      console.error('✗ Erro ao criar produto:', response.status, errorText);
      return null;
    }
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return null;
  }
}

// Executar a função
console.log('Script de teste de produto com múltiplas categorias iniciado...');
createTestProduct()
  .then(product => {
    if (product) {
      console.log('\n✓ Teste concluído com sucesso!');
    } else {
      console.log('\n✗ Teste falhou!');
    }
  })
  .catch(error => console.error('Erro no script:', error));