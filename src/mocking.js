const { faker } = require('@faker-js/faker');

function generateMockProducts(count = 100) {
    const products = [];
    for (let i = 0; i < count; i++) {
        products.push({
            _id: faker.string.uuid(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            code: faker.string.uuid(),
            stock: faker.number.int({ min: 1, max: 100 }),
            status: faker.datatype.boolean(),
            category: faker.commerce.department(),
            quantity: faker.number.int({ min: 1, max: 10 })
        });
    }
    return products;
}

module.exports = generateMockProducts;
