const createProduct = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJhdXRob3JpdGllcyI6WyJBRE1JTiJdLCJpYXQiOjE2MzQ1NjcyMDAsImV4cCI6MTYzNDU3MDgwMH0.5u3dG2mP5z3dG2mP5z3dG2mP5z3dG2mP5z3dG2mP5z3'
      },
      body: JSON.stringify({
        name: 'Produto Teste',
        price: 100.0,
        quantity: 10,
        description: 'Descrição do produto teste',
        categoryIds: [1, 2, 3]
      })
    });

    const data = await response.json();
    console.log('Produto criado:', data);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
  }
};

createProduct();