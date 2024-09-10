// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.18;

import "@openzeppelin/contracts@5.0.2/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@5.0.2/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@5.0.2/access/Ownable.sol";

contract BubbelBurst is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    uint256 private constant MAX_SUPPLY = 3;


    constructor(address initialOwner)
        ERC721("BubbelBurst", "BB")
        Ownable(initialOwner)
    {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://apricot-tasty-peacock-500.mypinata.cloud/ipfs/QmTLknMdvnCavH1Kfuhfc1bbmcYZkVkP5N4MfwSTqJJ2g6/";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        require(_nextTokenId < MAX_SUPPLY, "Max supply reached");
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
      // Function to get the total supply of tokens
    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }

    // Function to get the next token ID (name according to ERC721 standard)
    function nextTokenIdToMint() public view returns (uint256) {
        return _nextTokenId;
    }
}
