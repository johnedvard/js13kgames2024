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
    - Created my own ERC721 Smart Contract, and deployed it to Avalanche, https://snowtrace.io/token/0xcA61C32f3912b3882fB488eBF44F8275f41faFf1
    - Fetches the 3 tokens, which acts as NPCs to give the bubble some colors
- Thirdweb Challenge
    - Use the [Thirdweb Typescript SDK](https://portal.thirdweb.com/typescript/v5)
    - Use the SDK to fetch my 3 NFTs from the Avalanche blockchain
    - Use the SDK to fetch bonus levels from Pinata (IPFS)
        - Bonus 1: https://apricot-tasty-peacock-500.mypinata.cloud/ipfs/QmaGn65fZnKw25fqYGNqpzpjsXmnLGUdRPs5cvFEkquNnQ
        - Bonus 2: https://apricot-tasty-peacock-500.mypinata.cloud/ipfs/QmPHsFPjchGU2J66gS9G5uQuPaCPmc8Rx6yzFWTYtyozFB
        - Bonus 3: https://apricot-tasty-peacock-500.mypinata.cloud/ipfs/QmckDTy8fDwUtWxbEHjdMjSmUS7VJV5u9zDF4jQVBfXS9P
        - Bonus 4: https://apricot-tasty-peacock-500.mypinata.cloud/ipfs/QmSmJq4vTHeQvdkWX1qcCQMUJJpxWc5jTTZQRPPimmBAKn
- Arcadia Challenge
    - Upload the same game to [Arcadia](https://arcadia.fun/)

The player has to click the "Web3" button in the game to see the challenges. Clicking "Web3" will dynamically import the Thirdweb TypeScript SDK, and fetch NFTs (My NPCs) from Avalancnhe, and bonus levels from IPFS.
Clicking on any of my NPCs will change the color of the bubble


### Mobile

The game was made mobile first. Hold finger down to inflate the bubble. Be careful though, if pressure exceeds 13, bubble burst! 🫧💥


## Build

use `npm run build:roadroller` to get the smallest possible file size
use `node inlinejs.cjs` to inline index.js into the html file.