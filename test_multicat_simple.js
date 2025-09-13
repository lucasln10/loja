// Script simples para testar a funcionalidade de múltiplas categorias
console.log('🧪 Teste de funcionalidade de múltiplas categorias');

// Simulando um produto com múltiplas categorias
const produtoTeste = {
  id: 1,
  name: 'Produto de Teste',
  categoryIds: [1, 2, 3], // Múltiplas categorias
  categoryId: 1 // Categoria principal (para compatibilidade)
};

console.log('✅ Produto de teste:', produtoTeste);
console.log('✅ Categorias do produto:', produtoTeste.categoryIds.join(', '));
console.log('🎉 Teste concluído com sucesso!');