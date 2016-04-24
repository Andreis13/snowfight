

# Snowfight

This is a project to support my Bachelor Thesis on 'Real-Time Communication and Interaction in Modern Web'. It is the prototype of a multiplayer game of 'snowfight' where all the action is depicted on a single screen and players use their phones as controllers.

The great thing about this is the fact that neither the 'game host' machine nor the players' devices require installation of any software, because all they need is a browser that supports WebRTC technology, as the whole game and the 'controller' code are served as simple web applications that communicate to each other.

## Installation and Usage

1. Clone the repo or download as a .zip archive.
2. Run `npm install` to install all the dependencies.
3. Start the *peerjs* server via `npm start`.
4. Find out the local IP address of your computer and set the appropriate settings in `src/scripts/settings.json`.
5. To serve the project files use the `gulp` command.
6. Navigate to `localhost:3000` on your PC and wait for players to connect before pressing the *START* button.
7. Use a couple of smarphones and go to `ip.address.of.server:3000/controller.html` in a browser.
8. Enter a player name and confirm.
9. When all players are connected hit *START* on the 'game hub' screen and [stay alive](https://www.youtube.com/watch?v=I_izvAbhExY).
