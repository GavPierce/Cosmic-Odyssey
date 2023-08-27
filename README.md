# Cosmic Odyssey

CO is a slow-burn browser game heavily inspired by [Solaris](https://solaris.games), [Neptune's Pride](https://np.ironhelmet.com) and [Subterfuge](http://subterfuge-game.com/).

![](client/src/assets/screenshots/game1.png)

    • Develop economic, scientific, and industrial frameworks to strengthen your dominion.
    • Construct vessels to explore new celestial bodies or combat adversaries.
    • Delve into innovative technologies for a competitive advantage.
    • Engage experts who provide unique abilities to stars and vessels, enhancing weaponry and hyperspace range.
    • Initiate trade relationships with allies for a strategic edge.
    • Engage in multiplayer sessions with up to 32 participants.
    • Collaborate in group discussions with teammates to plan tactics.
    • Challenge rival players and seize star system points for victory.
    • Matches typically span 2-3 weeks, requiring minimal time investment!
    • Accessible on any device equipped with a web browser.
    A• bsolutely no cost involved!

Visit [Cosmic-Odyssey.io](https://cosmic-odyssey.io/) to play now!

### Server

The server uses the following tech:

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
  - [Mongoose](https://mongoosejs.com/)

### Client

The client uses the following tech:

- [Vue.js](https://vuejs.org/)
- [PixiJS](https://www.pixijs.com/)

## Development Environment Setup

1. Install the prerequisites.
   - [Node.js](https://nodejs.org/en/) v14
   - [MongoDB](https://www.mongodb.com/) v4.4
2. Clone the repository.
3. Checkout `master`.
4. `npm install` in both `client/` and `server/` directories.
5. Create a `.env` file in `server/` (See `.env.example`).
6. Create a `.env` file in `client/` (See `.env.example`).
7. `npm run start-jobs:dev` in `server/` to start the automated jobs and setup new games.
8. `npm run start-api:dev` in `server/` to start the API.
9. `npm run serve` in `client/` to start the client application.
10. Browse to the site locally (default [http://localhost:8080](http://localhost:8080)).

_Note: Development work is to be based on the `main` branch, for a new feature or bug fix, create a branch from `main`._

### Database Migrations

To keep up to date with the latest changes, you must run the database migations to ensure that your database is compatible.

1. `npm run start-db-migrate:dev` in `server/` to update your local database to the latest schema.

_Note: This script assumes that you have a `Cosmic Odyssey` database on your system. If not, perform the **Development Environment Setup** above first._

### Development Environment Automation (Optional)

To automate the development environment, it is recommended to use [PM2](https://pm2.keymetrics.io/).

1. Install `pm2`.
2. `pm2 start pm2.config.js` to register `pm2` apps.

The above script will create the server jobs, API and client applications, watch for changes and restart those applications when necessary.

You can make use of debugger attach for VS Code defined in the `.vscode/launch.json` configuration file to easily attach the debugger to running apps.

Once configured, you can browse to the site locally (default [http://localhost:8080](http://localhost:8080)) as using the normal way detailed in the section above and any changes you make will automatically restart the applications.

## Contributing

See [here](CONTRIBUTING.md).

## License

See [here](LICENSE).
