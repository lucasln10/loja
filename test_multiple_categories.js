// Script de teste para verificar a funcionalidade de múltiplas categorias
const API_BASE_URL = 'http://localhost:8080';

async function testMultipleCategories() {
  try {
    console.log('🔍 Testando funcionalidade de múltiplas categorias...\n');
    
    // 1. Obter todas as categorias
    console.log('1. Obtendo categorias...');
    const categoriesResponse = await fetch(`${API_BASE_URL}/api/categories`);
    const categories = await categoriesResponse.json();
    console.log(`✅ Encontradas ${categories.length} categorias\n`);
    
    // 2. Obter todos os produtos
    console.log('2. Obtendo produtos...');
    const productsResponse = await fetch(`${API_BASE_URL}/api/products`);
    const products = await productsResponse.json();
    console.log(`✅ Encontrados ${products.length} produtos\n`);
    
    // 3. Verificar se produtos têm múltiplas categorias
    console.log('3. Verificando produtos com múltiplas categorias...');
    let productsWithMultipleCategories = 0;
    
    for (const product of products) {
      if (product.categoryIds && product.categoryIds.length > 1) {
        productsWithMultipleCategories++;
        console.log(`   🏷️ Produto "${product.name}" tem ${product.categoryIds.length} categorias: ${product.categoryIds.join(', ')}`);
      }
    }
    
    console.log(`✅ ${productsWithMultipleCategories} produtos com múltiplas categorias\n`);
    
    // 4. Testar filtro por múltiplas categorias
    if (categories.length >= 2) {
      console.log('4. Testando filtro por múltiplas categorias...');
      const categoryIds = [categories[0].id, categories[1].id];
      const filterResponse = await fetch(`${API_BASE_URL}/api/products/by-categories?categoryIds=${categoryIds.join(',')}`);
      
      if (filterResponse.ok) {
        const filteredProducts = await filterResponse.json();
        console.log(`✅ Filtro por múltiplas categorias funcionando! Encontrados ${filteredProducts.content ? filteredProducts.content.length : filteredProducts.length} produtos`);
      } else {
        console.log('❌ Erro ao filtrar por múltiplas categorias');
      }
    }
    
    // 5. Testar criação de produto com múltiplas categorias
    console.log('\n5. Testando criação de produto com múltiplas categorias...');
    if (categories.length >= 2) {
      const testProduct = {
        name: 'Produto de Teste Multicategoria',
        description: 'Produto criado para testar múltiplas categorias',
        price: 99.99,
        quantity: 10,
        categoryId: categories[0].id, // Categoria principal (para compatibilidade)
        categoryIds: [categories[0].id, categories[1].id] // Múltiplas categorias
      };
      
      try {
        const createResponse = await fetch(`${API_BASE_URL}/api/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer seu-token-aqui' // Substitua pelo token real
          },
          body: JSON.stringify(testProduct)
        });
        
        if (createResponse.ok) {
          const createdProduct = await createResponse.json();
          console.log(`✅ Produto criado com sucesso! ID: ${createdProduct.id}`);
          
          // Limpar - deletar o produto de teste
          if (createdProduct.id) {
            await fetch(`${API_BASE_URL}/api/products/${createdProduct.id}`, {
              method: 'DELETE',
              headers: {
                'Authorization': 'Bearer seu-token-aqui' // Substitua pelo token real
              }
            });
            console.log('✅ Produto de teste removido');
          }
        } else {
          console.log('⚠️  Não foi possível criar produto de teste (verifique autenticação)');
        }
      } catch (error) {
        console.log('⚠️  Erro ao criar produto de teste:', error.message);
      }
    }
    
    console.log('\n🎉 Teste concluído!');
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar o teste
testMultipleCategories();