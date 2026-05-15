/**
 * (E)t)h)e)x) Loto Contract
 * This smart-contract is the part of Ethex Lottery fair game.
 * See latest version at https://github.com/ethex-bet/ethex-contacts
 * http://ethex.bet
 */

pragma solidity ^0.5.0;

import "./EthexJackpot.sol";
import "./EthexHouse.sol";
import "./EthexSuperprize.sol";
import "./DeliverFunds.sol";
import "./Ownable.sol";
import "./IERC20.sol";

library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) { return 0; }
        uint256 c = a * b;
        require(c / a == b);
        return c;
    }
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0);
        uint256 c = a / b;
        return c;
    }
}

contract EthexLoto is Ownable {
    using SafeMath for uint256;

    struct Bet {
        uint256 blockNumber;
        uint256 amount;
        bytes16 id;
        bytes6 bet;
        address payable gamer;
    }

    struct Transaction {
        uint256 amount;
        address payable gamer;
    }

    struct Superprize {
        uint256 amount;
        bytes16 id;
    }

    mapping(uint256 => uint256) public blockNumberQueue;
    mapping(uint256 => uint256) public amountQueue;
    mapping(uint256 => bytes16) public idQueue;
    mapping(uint256 => bytes6) public betQueue;
    mapping(uint256 => address payable) public gamerQueue;
    uint256 public first = 2;
    uint256 public last = 1;
    uint256 public holdBalance;

    address payable public jackpotAddress;
    address payable public houseAddress;
    address payable public superprizeAddress;

    event PayoutBet (uint256 amount, bytes16 id, address gamer);
    event RefundBet (uint256 amount, bytes16 id, address gamer);

    uint256 internal constant MIN_BET = 0.01 ether;
    uint256 internal constant PRECISION = 1 ether;
    uint256 internal constant JACKPOT_PERCENT = 10;
    uint256 internal constant HOUSE_EDGE = 10;

    constructor(address payable jackpot, address payable house, address payable superprize) public payable {
        jackpotAddress = jackpot;
        houseAddress = house;
        superprizeAddress = superprize;
    }

    function payIn() external payable { }

    function placeBet(bytes22 params) external payable {
        require(tx.origin == msg.sender);
        require(msg.value >= MIN_BET, "Bet amount should be greater or equal than minimal amount");
        require(bytes16(params) != 0, "Id should not be 0");

        bytes16 id = bytes16(params);
        bytes6 bet = bytes6(params << 128);

        uint256 coefficient;
        uint8 markedCount;
        uint256 holdAmount;
        uint256 jackpotFee = msg.value * JACKPOT_PERCENT * PRECISION / 100 / PRECISION;
        uint256 houseEdgeFee = msg.value * HOUSE_EDGE * PRECISION / 100 / PRECISION;
        uint256 betAmount = msg.value - jackpotFee - houseEdgeFee;

        (coefficient, markedCount, holdAmount) = getHold(betAmount, bet);

        require(msg.value * (100 - JACKPOT_PERCENT - HOUSE_EDGE) * (coefficient * 8 - 15 * markedCount) <= 9000 ether * markedCount);
        require(msg.value * (800 * coefficient - (JACKPOT_PERCENT + HOUSE_EDGE) * (coefficient * 8 + 15 * markedCount)) <= 1500 * markedCount * (address(this).balance - holdBalance));

        holdBalance += holdAmount;
        enqueue(block.number, betAmount, id, bet, msg.sender);

        if (markedCount > 1)
            EthexJackpot(jackpotAddress).registerTicket(id, msg.sender);

        EthexHouse(houseAddress).payIn.value(houseEdgeFee)();
        EthexJackpot(jackpotAddress).payIn.value(jackpotFee)();
    }

    function settleBets() external {
        if (first > last) return;
        uint256 length = getLength();
        length = length > 10 ? 10 : length;
        Transaction[] memory transactions = new Transaction[](length);
        Superprize[] memory superprizes = new Superprize[](length);
        uint256 balance = address(this).balance - holdBalance;

        for(uint256 i = 0; i < length; i++) {
            Bet memory bet = dequeue();
            uint256 holdAmount = getHoldAmount(bet.amount, bet.bet);
            balance += holdAmount;
            
            if (bet.blockNumber < block.number - 256) {
                // --- DYNAMIC REFUND CALCULATION ---
                uint256 markedCount = 0;
                for (uint8 j = 0; j < 6; j++) {
                    if (uint8(bet.bet[j]) <= 52) { markedCount++; }
                }

                uint256 houseEdge;
                if (markedCount == 1) { houseEdge = 12; }
                else if (markedCount <= 3) { houseEdge = 10; }
                else { houseEdge = 8; }

                uint256 refundPercent = 90 - houseEdge;
                uint256 refundAmount = bet.amount.mul(refundPercent).div(100);

                transactions[i] = Transaction(refundAmount, bet.gamer);
                emit RefundBet(refundAmount, bet.id, bet.gamer);
                balance -= refundAmount;
            } else {
                // ... Standard Payout Logic ...
            }
        }
    }

    // [Helper functions and Enqueue/Dequeue logic as per original file]
    function getLength() internal view returns (uint256) { return 1 + last - first; }
    
    function enqueue(uint256 blockNumber, uint256 amount, bytes16 id, bytes6 bet, address payable gamer) internal {
        last += 1;
        blockNumberQueue[last] = blockNumber;
        amountQueue[last] = amount;
        idQueue[last] = id;
        betQueue[last] = bet;
        gamerQueue[last] = gamer;
    }

    function dequeue() internal returns (Bet memory bet) {
        require(last >= first);
        bet = Bet(blockNumberQueue[first], amountQueue[first], idQueue[first], betQueue[first], gamerQueue[first]);
        delete blockNumberQueue[first];
        delete amountQueue[first];
        delete idQueue[first];
        delete betQueue[first];
        delete gamerQueue[first];
        if (first == last) { first = 2; last = 1; }
        else first += 1;
    }

    function getHold(uint256 amount, bytes6 bet) internal pure returns (uint256 coefficient, uint8 markedCount, uint256 holdAmount) {
        for (uint8 i = 0; i < bet.length; i++) {
            if (bet[i] > 0x13) continue;
            markedCount++;
            if (bet[i] < 0x10) { coefficient += 30; continue; }
            if (bet[i] == 0x10) { coefficient += 5; continue; }
            if (bet[i] == 0x11) { coefficient += 3; continue; }
            if (bet[i] == 0x12) { coefficient += 6; continue; }
            if (bet[i] == 0x13) { coefficient += 6; continue; }
        }
        holdAmount = amount * coefficient * 8 / 15 / markedCount;
    }
    
    function getHoldAmount(uint256 amount, bytes6 bet) internal pure returns (uint256) {
        (,,uint256 holdAmount) = getHold(amount, bet);
        return holdAmount;
    }
}
+
