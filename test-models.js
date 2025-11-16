// test-crud.js
const { sequelize, Product, Category } = require('./src/models');

async function testCRUD() {
  try {
    console.log('🚀 Testando CRUD...\n');

    // 1. Criar uma categoria
    const categoria = await Category.create({
      nome: 'Eletrônicos',
      descricao: 'Produtos eletrônicos em geral'
    });
    console.log('✅ Categoria criada:', categoria.nome);

    // 2. Criar um produto
    const produto = await Product.create({
      codigo: 'ELET001',
      nome: 'Smartphone Samsung',
      categoria_id: categoria.id,
      estoque: 50,
      preco: 1299.99,
      status: true
    });
    console.log('✅ Produto criado:', produto.nome);

    // 3. Buscar produto com categoria (usando a associação)
    const produtoComCategoria = await Product.findOne({
      where: { codigo: 'ELET001' },
      include: { association: 'categoria' }
    });
    console.log('\n🔍 Produto com categoria:');
    console.log('- Nome:', produtoComCategoria.nome);
    console.log('- Categoria:', produtoComCategoria.categoria.nome);
    console.log('- Preço:', produtoComCategoria.preco);
    console.log('- Estoque:', produtoComCategoria.estoque);

    // 4. Atualizar estoque
    await Product.update(
      { estoque: 45 },
      { where: { codigo: 'ELET001' } }
    );
    console.log('\n📝 Estoque atualizado para 45');

    // 5. Listar todos os produtos
    const todosProdutos = await Product.findAll({
      include: { association: 'categoria' }
    });
    console.log('\n📦 Todos os produtos:', todosProdutos.length);

    console.log('\n🎉 CRUD testado com sucesso!');
    process.exit(0);

  } catch (error) {
    console.log('❌ Erro no CRUD:', error.message);
    process.exit(1);
  }
}

testCRUD();