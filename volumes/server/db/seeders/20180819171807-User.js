'use strict';

const faker = require('faker');
const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface) => {
      return getAdminUsers().then(function(adminUsers) {
          return getRandomUsers().then(function(users) {
              return queryInterface.bulkInsert('user', adminUsers.concat(users), {});
          });
      });
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('user', null, {});
  }
};

async function getAdminUsers() {
    let users = [{
        username: 'admin',
        email: 'admin@test.fr',
        password: await bcrypt.hash('password', 10),
        isActive: true,
        roles: JSON.stringify({0: 'ROLE_USER', 1: 'ROLE_ADMIN'}),
        createdAt: faker.date.recent(),
    }];

    for (let i = 0; i < 23; i++) {
        users.push({
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: await bcrypt.hash(faker.random.alphaNumeric(), 10),
            isActive: faker.random.boolean(),
            roles: JSON.stringify({0: 'ROLE_USER', 1: 'ROLE_ADMIN'}),
            createdAt: faker.date.recent(),
        });
    }

    return users;
}

async function getRandomUsers() {
    let users = [{
        username: 'user',
        email: 'user@test.fr',
        password: await bcrypt.hash('password', 10),
        isActive: true,
        roles: JSON.stringify({0: 'ROLE_USER'}),
        createdAt: faker.date.recent(),
    }];

    for (let i = 0; i < 241; i++) {
        users.push({
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: await bcrypt.hash(faker.random.alphaNumeric(), 10),
            isActive: faker.random.boolean(),
            roles: JSON.stringify({0: 'ROLE_USER'}),
            createdAt: faker.date.recent(),
        });
    }

    return users;
}