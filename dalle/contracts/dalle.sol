// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract DalleDressV1 is ERC721, ERC721URIStorage, ERC721Pausable, Ownable, ReentrancyGuard {
    uint256 public mintCost = 0.005 ether;
    uint256 public tokenId = 0;
    uint256 public constant MAX_SUPPLY = 10000; // Example max supply

    event Minted(address indexed to, uint256 indexed tokenId, string uri);
    event MintCostUpdated(uint256 newCost);

    constructor(address initialOwner)
        ERC721("DalleDressV1", "DD")
        Ownable(initialOwner)
    {}

    function _baseURI() internal pure override returns (string memory) {
        // Consider IPFS: "ipfs://<base-hash>/"
        return "http://192.34.63.136:8080/dalle/empty/";
    }

    function pause() public onlyOwner {
        _pause();
        emit Paused(msg.sender);
    }

    function unpause() public onlyOwner {
        _unpause();
        emit Unpaused(msg.sender);
    }

    function setMintCost(uint256 newCost) public onlyOwner {
        mintCost = newCost;
        emit MintCostUpdated(newCost);
    }

    function safeMint(address to, string memory uri)
        public
        payable
        nonReentrant
    {
        require(msg.value >= mintCost, "Incorrect ETH amount");
        require(tokenId < MAX_SUPPLY, "Max supply reached");
        require(bytes(uri).length > 0, "Empty URI");

        tokenId++;
        (bool sent, ) = payable(owner()).call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit Minted(to, tokenId, uri);
    }

    // The following functions are overrides required by Solidity due to multiple inheritence
    function _update(address to, uint256 tkId, address auth)
        internal
        override(ERC721, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tkId, auth);
    }

    function tokenURI(uint256 tkId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tkId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}