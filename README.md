## Bubble Burst 🫧💥

Bubble Burst, a js13kgames 2024 entry. 

## Controls

- Hold finger or mouse down to inflate the bubble
    - The bubble goes up the more pressure it has stored
    - Pressure above 13 will burst the bubble 🫧💥
- Release finger or mouse to release pressure
    - The bubble falls down when pressure is low
- The bubble latches onto objects to move back and forth
    - Attach to the floor to move forward
    - Attach to the ceiling to go backward


## Challenges

js13kgames offers some challenges. Here are the once I embraced. 

### Decentralized


- OP Guild Challenge
    - NPCs which gives the bubble a makeover
- Avalanche Challenge
    - Fetches 3 random Chikinz https://chikn.farm/, which are the NPCs in the game
- Thirdweb Challenge
    - Use the [Thirdweb Typescript SDK](https://portal.thirdweb.com/typescript/v5)
- Arcadia Challenge
    - Upload the same game to [Arcadia](https://arcadia.fun/)

The player has to click the "Web3" button in the game to see the challenges. Clicking "Web3" will embed a version of the same game which includes the Thirdweb TypeScript SDK.
I use the SDK to connect to the Avalanche blockchain, and fetch 3 random chikinz which acts as NPCs in the game. I wanted to make more out of the decentralized challenge, but figuring out how to use the Thirdweb TypeScript SDK in my game was a challenge in itself. I therefore went with a simple approach, changing the color of the bubble depending on the NPC.


### Mobile

The game was made mobile first. Hold finger down to inflate the bubble. Be careful though, if pressure exceeds 13, bubble burst! 🫧💥


## Build

use `npm run build:roadroller` to get the smallest possible file size
use `node inlinejs.cjs` to inline index.js into the html file.