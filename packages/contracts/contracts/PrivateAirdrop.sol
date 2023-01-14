// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CommunityToken.sol";

interface IPlonkVerifier {
    function verifyProof(bytes memory proof, uint256[] memory pubSignals)
        external
        view
        returns (bool);
}

interface IERC20 {
    function transfer(address recipient, uint256 amount)
        external
        returns (bool);
}

/// @title An example airdrop contract utilizing a zk-proof of MerkleTree inclusion.
contract PrivateAirdrop is Ownable {
    CommunityToken public communityToken;
    IPlonkVerifier verifier;

    mapping(uint256 => bytes32) public roots;

    mapping(uint256 => mapping(bytes32 => bool)) public nullifierSpents;

    mapping(uint256 => string) public communities;

    uint256 public totalCommunities;

    uint256 constant SNARK_FIELD =
        21888242871839275222246405745257275088548364400416034343698204186575808495617;

    event NewCommunity(string name, uint256 id, address indexed admin);

    constructor(IPlonkVerifier _verifier) {
        communityToken = new CommunityToken();
        verifier = _verifier;
    }

    /// @notice verifies the proof, collects the airdrop if valid, and prevents this proof from working again.
    function collectAirdrop(
        uint256 id,
        bytes calldata proof,
        bytes32 nullifierHash
    ) public {
        require(communityToken.exists(id), "Invalid Community");
        require(
            uint256(nullifierHash) < SNARK_FIELD,
            "Nullifier is not within the field"
        );
        require(
            !nullifierSpents[id][nullifierHash],
            "Airdrop already redeemed"
        );

        uint256[] memory pubSignals = new uint256[](3);
        pubSignals[0] = uint256(roots[id]);
        pubSignals[1] = uint256(nullifierHash);
        pubSignals[2] = uint256(uint160(msg.sender));
        require(
            verifier.verifyProof(proof, pubSignals),
            "Proof verification failed"
        );

        nullifierSpents[id][nullifierHash] = true;
        communityToken.mint(msg.sender, id, 1);
    }

    /// @notice Allows the owner to update the root of the merkle tree.
    /// @dev Function can be removed to make the merkle tree immutable. If removed, the ownable extension can also be removed for gas savings.
    function updateRoot(uint256 id, bytes32 newRoot) public onlyOwner {
        require(communityToken.exists(id), "Invalid Community");
        roots[id] = newRoot;
    }

    /// @notice Allows anyone to register community.
    /// @dev Function can be used to register community by anyone.
    function registerCommunity(string memory name) public returns (uint256) {
        communities[totalCommunities] = name;
        totalCommunities++;

        communityToken.mint(msg.sender, totalCommunities - 1, 1);

        emit NewCommunity(name, totalCommunities - 1, msg.sender);
    }
}
