const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Marketplace API',
    description: 'API RESTful para uma aplicação de marketplace',
    version: '1.0.0'
  },
  host: 'localhost:5000',
  basePath: '/',
  schemes: ['http'],
  tags: [
    { name: 'Users', description: 'Endpoints para gerenciamento de usuários' },
    { name: 'Ads', description: 'Endpoints para gerenciamento de anúncios' },
    { name: 'Categories', description: 'Endpoints para gerenciamento de categorias' },
    { name: 'Comments', description: 'Endpoints para gerenciamento de comentários' },
    { name: 'Chats', description: 'Endpoints para gerenciamento de chats' }
  ],
  definitions: {
    User: {
      user_id: 1,
      username: 'Pedro240',
      address: 'Funchal',
      email: 'test@gmail.com',
      password: 'password',
      phone: '912945654',
      role: 'user',
      created: '2023-01-01T00:00:00.000Z'
    },
    Ad: {
      ad_id: 1,
      user_id: 1,
      category_id: 1,
      title: 'iPhone 13 Pro - Like New',
      product_name: 'iPhone 13 Pro',
      address: 'Funchal',
      price: 799.99,
      product_condition: 'Excellent',
      description: 'iPhone 13 Pro 256GB in perfect condition with original box and accessories.',
      active_promotion: true,
      keywords: 'apple,iphone,smartphone'
    },
    Category: {
      category_id: 1,
      category_name: 'Electronics',
      sub_category_name: 'Smartphones'
    },
    Comment: {
      comment_id: 1,
      user_id: 1,
      ad_id: 1,
      comment: 'Is this still available?',
      created_at: '2023-01-01T00:00:00.000Z'
    },
    Chat: {
      chat_id: 1,
      ad_id: 1,
      buyer_id: 1,
      seller_id: 2,
      created_at: '2023-01-01T00:00:00.000Z'
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);