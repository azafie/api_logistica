const { Order, OrderItem, Product, Category } = require('../models');

const orderController = {
  // Listar pedidos com itens
  async list(req, res) {
    try {
      console.log('📦 Buscando pedidos...');
      const orders = await Order.findAll({
        include: [{
          model: OrderItem,
          as: 'itens',
          include: [{
            model: Product,
            as: 'produto',
            attributes: ['id', 'nome', 'codigo', 'preco']
          }]
        }],
        order: [['created_at', 'DESC']]
      });
      
      return res.json({
        orders,
        total: orders.length
      });
    } catch (error) {
      console.error('❌ Erro no orderController.list:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Criar pedido COM ITENS
  async create(req, res) {
    try {
      const { cliente_nome, itens = [] } = req.body;
      
      if (!cliente_nome) {
        return res.status(400).json({ error: 'Nome do cliente é obrigatório' });
      }

      // Calcular valor total dos itens
      let valor_total = 0;
      for (const item of itens) {
        const product = await Product.findByPk(item.product_id);
        if (product) {
          valor_total += product.preco * item.quantidade;
        }
      }

      // Criar pedido
      const order = await Order.create({
        numero_pedido: `PED${Date.now()}`,
        cliente_nome,
        valor_total,
        data_pedido: new Date()
      });

      // Criar itens do pedido
      for (const item of itens) {
        const product = await Product.findByPk(item.product_id);
        if (product) {
          await OrderItem.create({
            order_id: order.id,
            product_id: item.product_id,
            quantidade: item.quantidade,
            preco_unitario: product.preco,
            subtotal: product.preco * item.quantidade
          });
        }
      }

      // Buscar pedido completo com itens
      const orderWithItems = await Order.findByPk(order.id, {
        include: [{
          model: OrderItem,
          as: 'itens',
          include: [{
            model: Product,
            as: 'produto',
            attributes: ['id', 'nome', 'codigo', 'preco', 'estoque']
          }]
        }]
      });

      return res.status(201).json(orderWithItems);
    } catch (error) {
      console.error('❌ Erro no orderController.create:', error);
      return res.status(400).json({ error: error.message });
    }
  },

  // Buscar pedido por ID com itens
  async getById(req, res) {
    try {
      const { id } = req.params;
      
      const order = await Order.findByPk(id, {
        include: [{
          model: OrderItem,
          as: 'itens',
          include: [{
            model: Product,
            as: 'produto',
            attributes: ['id', 'nome', 'codigo', 'preco', 'estoque']
          }]
        }]
      });

      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      return res.json(order);
    } catch (error) {
      console.error('❌ Erro no orderController.getById:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Atualizar status do pedido
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      await order.update({ status });

      return res.json(order);
    } catch (error) {
      console.error('❌ Erro no orderController.updateStatus:', error);
      return res.status(400).json({ error: error.message });
    }
  },

  // ENVIAR PEDIDO - BAIXAR ESTOQUE
  async enviarPedido(req, res) {
    try {
      const { id } = req.params;
      const { forma_envio } = req.body;

      console.log(`🚚 Enviando pedido ${id}...`);

      // Buscar pedido com itens e produtos
      const order = await Order.findByPk(id, {
        include: [{
          model: OrderItem,
          as: 'itens',
          include: [{
            model: Product,
            as: 'produto'
          }]
        }]
      });

      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      // Verificar estoque e baixar
      for (const item of order.itens) {
        const product = item.produto;
        
        if (product.estoque < item.quantidade) {
          return res.status(400).json({ 
            error: `Estoque insuficiente para ${product.nome}. Disponível: ${product.estoque}, Pedido: ${item.quantidade}` 
          });
        }

        // Baixar estoque
        await product.update({
          estoque: product.estoque - item.quantidade
        });

        console.log(`📦 Baixou ${item.quantidade} unidades de ${product.nome}`);
      }

      // Atualizar pedido para enviado
      await order.update({
        status: 'enviado',
        forma_envio: forma_envio || order.forma_envio
      });

      console.log(`✅ Pedido ${id} enviado e estoque baixado!`);

      return res.json({
        message: 'Pedido enviado e estoque baixado com sucesso!',
        order: order
      });
    } catch (error) {
      console.error('❌ Erro ao enviar pedido:', error);
      return res.status(400).json({ error: error.message });
    }
  },

  // Deletar pedido
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      // Deletar itens primeiro
      await OrderItem.destroy({ where: { order_id: id } });
      
      // Deletar pedido
      await order.destroy();

      return res.status(204).send();
    } catch (error) {
      console.error('❌ Erro no orderController.delete:', error);
      return res.status(400).json({ error: error.message });
    }
  }
};

module.exports = orderController;