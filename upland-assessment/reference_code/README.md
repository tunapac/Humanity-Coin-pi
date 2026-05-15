<<<<<<< HEAD
# Ethex Lottery Contracts
```javascript
/**
 * (E)t)h)e)x) Loto Contract 
 *  This smart-contracts are the parts of Ethex Lottery fair game.
 *  See latest version at https://github.com/ethex-bet/ethex-contacts 
 *  http://ethex.bet
 */
```
You can find deploy history here: [VERSIONING.md](https://github.com/ethex-bet/ethex-contracts/blob/master/VERSIONING.md)

## Game Rules

Ethex is an Ethereum [smart-contract](https://en.wikipedia.org/wiki/Ethereum#Smart_contracts) lottery game with huge prizes and big chances to win. The rules of the game are very simple and, with a wide range of prize combinations and full transparency through the use of smart-contracts, Ethex is an incredibly exciting game.

Ethex is [provably fair](https://en.wikipedia.org/wiki/Provably_fair) and cryptographically secure. Players are required to guess the hash from the block using their bet transaction. The nature of the Ethereum blockchain makes it impossible to cheat.

## How to play?

The player needs to guess the last hexadecimal numbers of Ethereum block hash, using numbers from 1 to 6. The more symbols the player has matched, the greater their prize.

In each cell, the player can choose from the list one of the following values:

* A specific symbol (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F);
* Any letter group (A, B, C, D, E, F);
* Any number group (0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
* Any even number group (0, 2, 4, 6, 8);
* Any odd number group (1, 3, 5, 7, 9);
* Or leave the cell blank.

After you have selected symbols, you should set your bet amount. The minimum amount is 0.01 ETH for each selected symbol. While you select symbols, the amount is automatically adjusting to the lower bound. You can set greater amount, but not less than 0.01 ETH x \[number of selected symbols\].

Once everything is ready, you should click the "Place a bet" button and confirm your Ethereum transaction which contain your bet. Wait until miners calculate the block containing your transaction and smart-contract. Grab your prize.

Good luck!

## How much can I win?

You win if you guess one or more symbols from the selected symbols group. Note that any symbols group has a higher chance of winning but a smaller prize. On the other hand, a specific symbol has a higher risk of losing but a greater potential prize. If you select only one symbol, your chances of winning and prize rate is as shown in the table below:

Selected symbols group | Win chance | Prize rate
-----------------------|:----------:|:---------:
Any number group (0, 1, 2, 3, 4, 5, 6, 7, 8, 9) | 10 : 16 | x1.6
Any letter group (A, B, C, D, E, F) | 6 : 16 | x2.6
Any even number group (0, 2, 4, 6, 8) | 5 : 16 | x3.2
Any odd number group (1, 3, 5, 7, 9) | 5 : 16 | x3.2
The specific symbol (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F) | 1 : 16 | x16

If you select more symbols but guess less of them your prize rate will be lower than if you guess the exact number of cells, but you get the chance to win the Jackpot.

_Note: prize rates are applied after deducting jackpot fee and house edge. The actual prize amount is limited to the current prize pool and is payed on the "first come first served" basis for all winners within the same block. Also note, that If the bet was not played, it can happen due to the network overload when the draw method call wasn’t mined within 256 blocks after the bet transaction due to Ethereum EVM limitation smart-contract has access only to the last 256 hashes, in this case, smart-contract returns the funds minus jackpot fee and house edge, but your bet still plays for the jackpots._

## Jackpots and Superprize

There are 4 types of guaranteed time-based jackpots in Ethex: Daily Jackpot, Weekly Jackpot, Monthly Jackpot and Season Jackpot plus one chance-based Superprize! When you select more than one cell, your bet is played 4 times for all types of jackpots, even if you didn't guess any symbols from the hash.

Jackpot Type | Amount | Draw Time
-------------|:------:|:--------:
Daily Jackpot | 1/7 of Weekly Jackpot amount | Every 5000 block (roughly once a day)
Weekly Jackpot | 1/4 of Monthly Jackpot amount | Every 35000 block (roughly once a week)
Monthly Jackpot | 1/3 of Season Jackpot amount | Every 150000 block (roughly once a month)
Season Jackpot | 1/4 of total Jackpot amount | Every 450000 block (roughly once every three months)
Superprize | The full Jackpot amount | Immediately after the block with your bet is mined

If you guess all of the last 6 symbols of the hash, you immideately vanish the amounts stored on both Ethex Lotto and Jackpot smart-contracts. You also get the general superprize amount stored on Ethex Superprize smart-contract. It is to be locked and paid out to the winner by 6 portions, every 150,000 blocks (approximately within 6 months). Each payment is about 10% bigger than the previous one. This helps to protect winners’ lifestyle and purchasing power in periods of inflation.

You can see the payouts calculation for the superprize winner based on the current state of the smart-contracts on [this page](https://ethex.bet/rules#jackpots).

## How is the winner of jackpot decided?

When you select more than one cell and submit your bet, the smart-contract registers it for the jackpot draw. Its registration number is displayed on result screen as an index number of your bet within all bets registered to play for the jackpot. The process of deciding the winner of jackpot is very simple and straightforward.

When the block of jackpot of a specific type is mined (i.e. next 35000-th block for the Weekly Jackpot), smart-contract uses its hexadecimal hash to convert it into the number and starts to count every bet registered for the jackpot. If there are less bets than the hash number, it continues to count from the first bet again and again, and so on until the hash number ends. The last bet before the count ends is the winner of the jackpot.

> If the count stops on one of your bets, congratulation – you win the jackpot!

To win the Superprize, you need to select the specific symbol for all 6 cells. If you guess all of the last 6 symbols of the next Ethereum block, you immediately win the whole prize pool and the full jackpot amount!

> If you manage to guess all 6 symbol of the hash – you win the Superprize!

_Note: if there is more than one person who guesses all 6 cells, the whole jackpot amount is divided proportionally between all winners, according to their bet amounts._
=======
# hometask-solidity



## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

* [Create](https://docs.gitlab.com/user/project/repository/web_editor/#create-a-file) or [upload](https://docs.gitlab.com/user/project/repository/web_editor/#upload-a-file) files
* [Add files using the command line](https://docs.gitlab.com/topics/git/add_files/#add-files-to-a-git-repository) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.com/zuckerup/hometask-solidity.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

* [Set up project integrations](https://gitlab.com/zuckerup/hometask-solidity/-/settings/integrations)

## Collaborate with your team

* [Invite team members and collaborators](https://docs.gitlab.com/user/project/members/)
* [Create a new merge request](https://docs.gitlab.com/user/project/merge_requests/creating_merge_requests/)
* [Automatically close issues from merge requests](https://docs.gitlab.com/user/project/issues/managing_issues/#closing-issues-automatically)
* [Enable merge request approvals](https://docs.gitlab.com/user/project/merge_requests/approvals/)
* [Set auto-merge](https://docs.gitlab.com/user/project/merge_requests/auto_merge/)

## Test and Deploy

Use the built-in continuous integration in GitLab.

* [Get started with GitLab CI/CD](https://docs.gitlab.com/ci/quick_start/)
* [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/user/application_security/sast/)
* [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/topics/autodevops/requirements/)
* [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/user/clusters/agent/)
* [Set up protected environments](https://docs.gitlab.com/ci/environments/protected_environments/)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
>>>>>>> fc3c72c75cec08cc34bdf96ef3cb3d3afb774365
