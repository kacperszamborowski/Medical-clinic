# Installation
Clone this repo:
```bash
git clone git@github.com:kacperszamborowski/Medical-clinic.git
```

Install dependencies:
```bash
cd Medical-clinic/backend
npm install
cd ../frontend
npm install
```

# Preparation
## Backend (execute in the _backend_ folder)
Create an ```.env``` file based on  ```.env-example``` and enter a connection string to your database:
```
...
# Database configuration
DATABASE_URL=[connection_string]
...
```

Generate a Prisma client:
```bash
npx prisma generate
```

Run a migration:
```bash
npx prisma migrate dev
```

Seed the database:
```bash
npx prisma db seed
```

(Optional) Run the tests to check if the backend works properly:
```bash
npm test
```

## Frontend (execute in the _frontend_ folder)
Create an ```.env``` file based on  ```.env-example``` and enter the backend address:
```
VITE_API_URL=http://localhost:3000
```

# Running
Run both the backend and the frontend by executing the following command in the corresponding folders:
```bash
npm run dev
```

Open your web browser and type in the following URL: 
```
http://localhost:5173/
```

The password in the seed data is set to **pass123** for every user account. The e-mails are visible in the database in the _Users_ table.

### NOTE: This app has been tested on the Microsoft Edge web browser. Other browsers may or may not work properly. 
