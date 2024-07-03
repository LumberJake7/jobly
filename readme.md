# Jobly

Jobly is a web application that helps users manage job applications. This README provides instructions on how to set up and run the project locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- PostgreSQL

## Getting Started

Follow these steps to set up and run the project:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/jobly.git
cd jobly


# create a .env file that  is structured like this
SECRET_KEY=your-secret-key
PORT=3001
DB_USER=your-database-username
DB_PASS=your-database-password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jobly
DATABASE_URL=your-database-url
NODE_ENV=development

in psql
createdb jobly
createdb jobly_test

import data
psql jobly < data.sql
psql jobly_test < data.sql





If any tests are not passing the general jest -i please try running the tests that failed only.
```
