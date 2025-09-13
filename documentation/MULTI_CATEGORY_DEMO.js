/**
 * Demonstração da funcionalidade de múltiplas categorias
 * 
 * Este script mostra como utilizar a nova funcionalidade de vincular
 * múltiplas categorias a um único produto.
 */

const API_BASE_URL = 'http://localhost:8080';

// Função para obter todas as categorias disponíveis
async function getAllCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao obter categorias:', error);
    return [];
  }
}

// Função para criar um produto com múltiplas categorias
async function createProductWithMultipleCategories() {
  try {
    // Obter categorias disponíveis
    const categories = await getAllCategories();
    console.log('Categorias disponíveis:');
    categories.forEach(cat => console.log(`  ${cat.id}: ${cat.name}`));
    
    // Dados do produto com múltiplas categorias
    const productData = {
      name: "Produto Demo Multicategoria",
      price: 149.90,
      quantity: 20,
      description: "Demonstração de produto com múltiplas categorias",
      detailedDescription: "Este produto demonstra a nova funcionalidade de vincular múltiplas categorias a um único produto.",
      categoryIds: [1, 3, 5], // Exemplo: vinculando às categorias 1, 3 e 5
      status: true
    };
    
    console.log('\nCriando produto com categorias:', productData.categoryIds);
    
    // Criar o produto
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJhdXRob3JpdGllcyI6WyJBRE1JTiJdLCJpYXQiOjE2MzQ1NjcyMDAsImV4cCI6MTYzNDU3MDgwMH0.5u3dG2mP5z3dG2mP5z3dG2mP5z3dG2mP5z3dG2mP5z3'
      },
      body: JSON.stringify(productData)
    });
    
    if (response.ok) {
      const createdProduct = await response.json();
      console.log('✓ Produto criado com sucesso!');
      console.log('ID:', createdProduct.id);
      console.log('Nome:', createdProduct.name);
      console.log('Categorias vinculadas:', createdProduct.categoryIds);
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

// Função para filtrar produtos por múltiplas categorias
async function filterProductsByCategories(categoryIds) {
  try {
    const idsParam = categoryIds.join(',');
    console.log(`\nFiltrando produtos pelas categorias: ${idsParam}`);
    
    const response = await fetch(`${API_BASE_URL}/api/products/by-categories?categoryIds=${idsParam}`);
    if (response.ok) {
      const result = await response.json();
      // Verificar se é um objeto PageResponseDTO ou array direto
      const products = Array.isArray(result) ? result : (result.content || []);
      console.log(`✓ Encontrados ${products.length} produtos:`);
      products.forEach(product => {
        console.log(`  - ${product.name} (Categorias: ${product.categoryIds ? product.categoryIds.join(', ') : 'Nenhuma'})`);
      });
      return products;
    } else {
      console.error('✗ Erro ao filtrar produtos:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Erro ao filtrar produtos:', error);
    return [];
  }
}

// Função principal de demonstração
async function demo() {
  console.log('=== Demonstração da Funcionalidade de Múltiplas Categorias ===\n');
  
  // 1. Criar um produto com múltiplas categorias
  console.log('1. Criando produto com múltiplas categorias...');
  const product = await createProductWithMultipleCategories();
  
  if (product) {
    // 2. Filtrar produtos por uma das categorias vinculadas
    console.log('\n2. Filtrando produtos pela categoria 1...');
    await filterProductsByCategories([1]);
    
    // 3. Filtrar produtos por múltiplas categorias
    console.log('\n3. Filtrando produtos pelas categorias 1 e 3...');
    await filterProductsByCategories([1, 3]);
    
    // 4. Filtrar produtos por todas as categorias vinculadas
    console.log('\n4. Filtrando produtos pelas categorias 1, 3 e 5...');
    await filterProductsByCategories([1, 3, 5]);
  }
  
  console.log('\n=== Fim da Demonstração ===');
}

// Executar a demonstração
demo()
  .then(() => console.log('Demonstração concluída!'))
  .catch(error => console.error('Erro na demonstração:', error));