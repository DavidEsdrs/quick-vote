# Quick vote
A web app that enables you to make quick polls in real-time. This is a fullstack project.

## Technologies used
- Backend:
* Prisma
* SQLite
* Express
* Socket.io

- Frontend:
* React
* Socket.io
* Tailwindcss
* Styled-Components

## How to bootstrap
1. Inside a folder, Clone this repository:
```sh
git clone https://github.com/DavidEsdrs/quick-vote.git
```

2. CD to the project folder:
```sh
cd quick-vote/
```

3. Go to the server folder:
```sh
cd server/
```
4. Install the dependencies:
```sh
npm install
OR
yarn
```

5. Run the prisma migrations (setup database):
```sh
npx prisma migrate deploy
```

6. Start the server application:
```sh
npm run dev
OR
yarn dev
```

7. Start another terminal in the root folder again and CD to the client:
```sh
cd client/
```
8. Install the dependencies:
```sh
npm install
OR
yarn
```

9. Start the client application:
```sh
npm start
OR 
yarn start
```

It will open the client at `localhost:3000`

10. Enjoy!