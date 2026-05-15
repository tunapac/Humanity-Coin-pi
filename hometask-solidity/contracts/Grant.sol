// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract Grant {
    struct G { address f; address r; uint256 a; uint256 t; bool c; }
    mapping(uint256 => G) public grants;
    uint256 public nextId;
    IERC20 public token;
    constructor(address _t) { token = IERC20(_t); }
    function createGrant(address _r, uint256 _a, uint256 _t) external {
        require(_t > block.timestamp);
        require(token.transferFrom(msg.sender, address(this), _a));
        grants[nextId++] = G({f:msg.sender, r:_r, a:_a, t:_t, c:false});
    }
    function claim(uint256 _i) external {
        G storage g = grants[_i];
        require(msg.sender == g.r && block.timestamp >= g.t && !g.c);
        g.c = true;
        require(token.transfer(g.r, g.a));
    }
    function revoke(uint256 _i) external {
        G storage g = grants[_i];
        require(msg.sender == g.f && block.timestamp < g.t && !g.c);
        g.c = true;
        require(token.transfer(g.f, g.a));
    }
}
