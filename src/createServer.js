'use strict';

const http = require('http');

function createServer() {
  return http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/add-expense') {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const expense = JSON.parse(body);

        if (expense.date && expense.title && expense.amount) {
          const fs = require('fs');
          const path = require('path');
          const dataPath = path.resolve(__dirname, '../db/expense.json');

          fs.writeFileSync(dataPath, JSON.stringify(expense));
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(expense));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(['Missing required fields']));
        }
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  });
}

module.exports = {
  createServer,
};
