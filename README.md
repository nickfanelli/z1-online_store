# Z1 Online Store conding assessment

This project implements a simple backend for an online store selling digital products.
[technical interview with Z1 (z1.app)]

## Requirements

- Node.js (>= 16.x)
- npm (>= 8.x)

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:nickfanelli/z1-online_store.git
   cd z1-online-store

2. Install dependencies:
   ```bash
   npm install express sequelize sqlite3
 
3. Install Typescript tools as dev dependencies
   ```bash
   npm install --save-dev typescript @types/node @types/express

4. Compile and run the app
   ```bash
   npx tsc
   ```

   ```bash
   node dist/index.js

   The server starts listening on `http://localhost:3000/`

## Usage

Use a tool such as Postman or cURL to hit the endpoints

### Routes

### Products
| No | Method | Route                  | Description                     | Attributes                          |
|----|--------|------------------------|---------------------------------|-------------------------------------|
| 1  | GET    | /products              | View product inventory          |                                     |
| 2  | POST   | /products              | Add product to inventory        |{body: name, price, stock}           |
| 3  | PATCH  | /products              | Update products' details        |{body: items: [{name, price, stock}]}|

### Cart
| No | Method | Route                  | Description                     | Attributes                 |
|----|--------|------------------------|---------------------------------|----------------------------|
| 1  | GET    | /cart/:clientId        | View client cart                |                            |
| 2  | POST   | /cart/:clientId/add    | Add product to client cart      |{body: productId, quantity} |
| 3  | POST   | /cart/:clientId/remove | Remove product from client cart |{body: productId}           |
| 4  | POST   | /cart/:clientId/clear  | Clear client cart client cart   |                            |

### Order
| No | Method | Route           | Description             | Attributes                                     |
|----|--------|-----------------|-------------------------|------------------------------------------------|
| 1  | POST   | /orders         | Submit purchase order   |{body: clientId, items: [{productId, quantity}]}|