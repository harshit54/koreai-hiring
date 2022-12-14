# koreai-hiring

- This is a Node.js application built using the following components
  - Node.js 18
  - Prisma ORM
  - SQLite db (Lightweight and Sufficient enough for this use case)

- The app was built for the hiring challenge hosted by Kore.ai on Hackerearth

## Hosting
- The app is hosted on https://koreai-hiring.herokuapp.com/
- Currently the Heroku domain does not work completely, because the setup of a reverse proxy using Nginx is pending. So only the Node.js application works but not the Prisma Studio app
- So it is recommended that the app be run on a local machine for complete testing


# How to Use
- Run `yarn install` after cloning the repo to install all the dependencies
- Run `yarn start` which will start the Express Server as well as Prisma Studio (GUI Layer on top of ORM For Direct Access To DB)
- The Swagger Layer is available on `/api-docs` which is used to document all the APIs available.
- Use Prisma Studio(typically hosted on Port 5555) for accessing the Db (This is required as only a few APIs are available for manipulation)

# Models Created
- User
- Stock
- Order

# APIs Created
- `/orders/add`
- `/update/:id`
- `/updateStatus/:id`
- `/delete/:id`
- `/checkCapacity/:date`