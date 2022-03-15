//SPDX-License-Identifier:MIT
pragma solidity >=0.6.0 <0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


contract RigelPool is ReentrancyGuard, Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    struct Param {
        address _token1;
        address _token2;
        uint256 _amount1;
        uint256 _amount2;
    }

    struct Pair {
        address token1;
        address token2;
    } // This datatype is used to store different token pair

    struct Pool {
        uint256 reserve1;
        uint256 reserve2;
    } // This datatype defines different pools for token pairs

    struct PoolShare {
        uint256 amount1;
        uint256 amount2;
    } //This datatype defines different poolshare for providers

    mapping(bytes32 => Pair) public allPair; // This stores all the available pair
    mapping(bytes32 => Pool) public liquidityPool; // This stores all the available pool for diffent pairs
    mapping(address => mapping(bytes32 => PoolShare)) public providerLiquidity; // This stores all the available liquidity provided by an address to a pool
    event LiquidityProvided(
        address indexed provider,
        address indexed token1,
        address indexed token2,
        uint256 amount1,
        uint256 amount2,
        uint256 time
    );

    constructor(
        address _token1,
        address _token2,
        address _token3,
        address _token4
    ) ReentrancyGuard() Ownable() {
        allPair[_hash(_token1, _token2)] = Pair(_token1, _token2);
        allPair[_hash(_token3, _token4)] = Pair(_token3, _token4);
        allPair[_hash(_token1, _token3)] = Pair(_token1, _token3);
        allPair[_hash(_token1, _token4)] = Pair(_token1, _token4);
        allPair[_hash(_token2, _token3)] = Pair(_token2, _token3);
        allPair[_hash(_token2, _token4)] = Pair(_token2, _token4);
    }

    /*
     * @dev This modifier checks if  the pair exists
     **/
    modifier pairExist(address _token1, address _token2) {
        bytes32 hash1 = _hash(_token1, _token2);
        bytes32 hash2 = _hash(_token2, _token1);
        require(
            allPair[hash1].token1 != address(0) ||
                allPair[hash2].token1 != address(0),
            "Token pair does not exist"
        );
        _;
    }

    /*
     * @dev This modifier checks for no zero value
     **/
    modifier notZero(uint256 _value) {
        require(_value != 0, "Zero value not supported");
        _;
    }

    /*
     * @dev This modifier checks for a valid address
     **/
    modifier validAddress(address _addr) {
        require(_addr != address(0), "Invalid address");
        _;
    }

    /*
     * @dev This function is used to hash token addresses
     **/
    function _hash(address _token1, address _token2)
        private
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(_token1, _token2));
    }

    /*
     * @dev This function is used to get hash of the pair
     **/
    function _getHash(address _token1, address _token2)
        private
        view
        returns (bytes32)
    {
        bytes32 hash1 = _hash(_token1, _token2);
        bytes32 hash2 = _hash(_token2, _token1);
        if (allPair[hash1].token1 != address(0)) {
            return hash1;
        } else {
            return hash2;
        }
    }

    /*
     * @dev This is used to add liquidity to a pool
     **/
    function addLiquidity(Param memory P)
        external
        nonReentrant
        validAddress(P._token1)
        validAddress(P._token2)
        notZero(P._amount1)
        notZero(P._amount2)
        pairExist(P._token1, P._token2)
    {
        bytes32 pairHash = _getHash(P._token1, P._token2);
        IERC20(P._token1).safeApprove(address(this), P._amount1);
        IERC20(P._token2).safeApprove(address(this), P._amount2);
        IERC20(P._token1).safeTransferFrom(
            msg.sender,
            address(this),
            P._amount1
        );
        IERC20(P._token2).safeTransferFrom(
            _msgSender(),
            address(this),
            P._amount2
        );
        liquidityPool[pairHash].reserve1 = liquidityPool[pairHash].reserve1.add(
            P._amount1
        );
        liquidityPool[pairHash].reserve2 = liquidityPool[pairHash].reserve2.add(
            P._amount2
        );
        providerLiquidity[msg.sender][pairHash].amount1 = providerLiquidity[
            msg.sender
        ][pairHash].amount1.add(P._amount1);
        providerLiquidity[msg.sender][pairHash].amount2 = providerLiquidity[
            msg.sender
        ][pairHash].amount2.add(P._amount2);
        emit LiquidityProvided(
            msg.sender,
            P._token1,
            P._token2,
            P._amount1,
            P._amount2,
            block.timestamp
        );
    }

    /*
     * @dev This is used to get the liquidity of a pair
     **/
    function getPairLiquidity(address _token1, address _token2)
        external
        view
        validAddress(_token1)
        validAddress(_token2)
        pairExist(_token1, _token2)
        returns (uint256 amount1, uint256 amount2)
    {
        bytes32 pairHash = _getHash(_token1, _token2);
        return (
            liquidityPool[pairHash].reserve1,
            liquidityPool[pairHash].reserve2
        );
    }

        /*
    * @dev This is used to get the liquidity of a provider
    **/
    function getProviderLiquidity(address _token1 , address _token2) external validAddress(_token1) validAddress(_token2)   pairExist(_token1,_token2) view returns(uint amount1 , uint amount2) {
         bytes32  pairHash = _getHash(_token1,_token2);
         return (providerLiquidity[msg.sender][pairHash].amount1, providerLiquidity[msg.sender][pairHash].amount1);
    }
}
