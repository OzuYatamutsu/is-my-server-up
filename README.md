# is-my-server-up
**Is my server up?** Now, with the magic of Node.js, you can find out!

### Featuring
 * A dedicated Node.js poller that periodically checks to see if a socket is available and accepting connections
 * Simple history through SQLite to track a socket's reliability in the past **5 minutes, 1 hour, or 1 day**
 * A websocket interface on the poller for easy querying

### Setup
The core of this project is written in TypeScript, and requires the TypeScript compiler (`tsc`).

To install, run `npm install` in the project root, then `tsc MonitoredSocket.ts Sqlite.ts app.ts` to transpile your `js` files. Configure the sockets you want to monitor in the included `config.json`.
