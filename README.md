# Market Sentiment Dapp

Here is the app
https://market-sentiment-dapp-citsuresh.vercel.app/

![image](https://user-images.githubusercontent.com/1070895/171484076-646057aa-f7e7-4785-879a-092d9bb2913c.png)

You need to have metamask installed in your browser and connect to Polygon Mumbai testnet. You also need to have some testnet MATIC tokens for voting.
Refer here for more instuctions here
https://moralis.io/mumbai-testnet-faucet-how-to-get-free-testnet-matic-tokens/

or 

[How to connect Polygon Mumbai Testnet to MetaMask](https://medium.com/stakingbits/how-to-connect-polygon-mumbai-testnet-to-metamask-fc3487a3871f)

[Get Test MATIC Tokens](https://faucet.polygon.technology/)


This project is based on a video tutorial by [Moralis](https://www.youtube.com/watch?v=MI_Se26Sfmo)

Contract for this app can be viewed [here](https://mumbai.polygonscan.com/address/0x8222c13bFfD16762fbee9d96b79b920A40256FA2)


## Tech Stack
- React.js
- Solidity
- Hardhat
- Moralis

## Notes from video tutorial

### Setup
1. Fork and clone [repo](https://github.com/IAmJaysWay/FirstDapp-Starter) 
2. `cd` into `smartcontracts` folder and `npm i -D hardhat` (install hardhat)
3. Initialize a hardhat project with `npx hardhat`
4. Install dependencies: `npm i -D dotenv`, `npm i -D @nomiclabs/hardhat-etherscan`

### Solidity Setup
1. Change `Greeter.sol` to `MarketSentiment.sol` and delete greeter code
2. Add the following code:

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract MarketSentiment {

    address public owner;
    // tickers are the cryptocurrencies we'll be voting on
    string[] public tickersArray;

    constructor() {
        owner = msg.sender;
    }

    struct ticker {
        bool exists;
        uint256 up;
        uint256 down;
        // the Voters mapping tells us if an address has voted or not
        mapping(address => bool) Voters;
    }

    event tickerupdated (
        uint256 up,
        uint256 down,
        address voter,
        string ticker
    );

    // The string in this case would be something like 'BTC'...
    // So Tickers is a mapping of strings to the ticker struct
    mapping(string => ticker) private Tickers;

    function addTicker(string memory _ticker) public {
        require(msg.sender == owner, "Only the owner can create tickers");
        ticker storage newTicker = Tickers[_ticker];
        newTicker.exists = true;
        tickersArray.push(_ticker);
    }

    function vote(string memory _ticker, bool _vote) public {
        require(Tickers[_ticker].exists, "Can't vote on this coin");
        require(!Tickers[_ticker].Voters[msg.sender], "You have already voted for this coin");

        ticker storage t = Tickers[_ticker];
        t.Voters[msg.sender] = true;

        if(_vote){
            t.up++;
        } else {
            t.down++;
        }

        emit tickerupdated(t.up, t.down, msg.sender, _ticker);
    }

    function getVotes(string memory _ticker) public view returns (
        uint256 up,
        uint256 down
    ){
        require(Tickers[_ticker].exists, "No such ticker defined");
        ticker storage t = Tickers[_ticker];
        return(t.up, t.down);
    }


}
```

### Compile and Deploy Smart Contract
1. Open `/scripts` folder, rename `greeter.js` to `deployMarketSentiment.js`
2. Remove comments from file, replace `Greeter` with `MarketSentiment` and replace `greeter` with `marketsentiment`.
3. In `hardhat.config.js` add the following lines to the top of the file:
```
require("@nomiclabs/hardhat-etherscan");
const dotenv = require("dotenv");

dotenv.config();
```
4. Create `.env` file and add:
```
API_KEY = '{polygonscan account api key}'
POLYGON_MUMBAI = '{polygon-mumbai node url}' (from Moralis Speedy Nodes)
PRIVATE_KEY = '{mm private key}'
```
5. In `hardhat.config.js` add a `networks` and `etherscan` object:
```
module.exports = {
  solidity: "0.8.7",
  networks: {
    mumbai: {
      url: process.env.POLYGON_MUMBAI,
      accounts: [process.env.PRIVATE_KEY]
    },
  },
  etherscan: {
    apiKey: process.env.API_KEY
  }
};
```
6. Run the following commands:
`npx hardhat clean`
`npx hardhat compile`
`npx hardhat run scripts/deployMarketSentiment.js --network mumbai`
Contract is now deployed to mumbai testnet.

### Verify and Interact with Smart Contract
1. In console enter `npx hardhat verify {contract address} --network mumbai`
2. Now you can go to the URL provided and interact with your smart contract.
(Aside: I learned at this point that the `public` modifier in Solidity makes a function or data visible on the blockchain. `public` allows me to access this app's functions/data on polygonscan. The `private` modifier is for funtions data that are used internally in the contract but not relevant or appropriate for public viewing. I also learned that the reason why we have to use `require(msg.sender == owner)` for certain functions is to prevent other people who interact with the contract through polygonscan from using them. I didn't understand this initially because I wasn't aware that the contract could be accessed through the blockchain itself.)
3. Through [polygonscan mumbai](https://mumbai.polygonscan.com/) I created Tickers for BTC, ETH, and BNB and voted `true` for BTC and BNB and `false` for ETH.

### Initialize React App
1. From terminal, in root folder of app: `yarn` to initialize and `yarn start` to open app in browser.

### Create Header
1. Added logo, connect button, and Coin component to App.js. 
2. Coin component has `color` `useState()`, `useEffect` updates token's color if below 50 to red.

### Create Vote Buttons
1. Import `Buttons` from `web3uikit`
2. Add the following code to `votes` div in Coin.js:
```js
<Button 
    onClick={() => {setPerc(perc + 1)}}
    text='Up'
    theme='primary'
    type='button'
/>

<Button
    color='red'
    onClick={() => {setPerc(perc - 1)}}
    text='Down'
    theme='colored'
    type='button'
/>
```
3. Create Moralis server, add `serverUrl` and `appId` to `index.js`. Up and Down buttons now adjust the percentage on the front-end. It appears Moralis' `web3uikit` only works if you connect your app to a Moralis server.

### Create Info Modal
1. Import `Modal` from `web3uikit`. Add `<Modal />` to `App.js`. This gives us an information screen which we can make visible by creating a button called 'INFO' on the `Coin.js` component.
2. Here is the code for the `<Modal />` from `App.js`:
```js
<Modal
    isVisible={visible}
    onCloseButtonPressed={() => setVisible(false)}
    hasFooter={false}
    title={modalToken}
>
    <div>
        <span style={{ color: 'black' }}>{`About`}</span>
    </div>
    <div>
        {modalToken &&
        abouts[abouts.findIndex((x) => x.token === modalToken)].about}
    </div>
</Modal>
```
3. Here is the code for the button which activates `<Modal />` from  the `Coin.js` component:
```js
<Button
    onClick={() => {
        setModalToken(token)
        setVisible(true);
    }}
    text='INFO'
    theme='translucent'
    type='button'
/>
```
4. Clicking the 'info' button for a given coin sets the Modal's `title` to `modalToken` which is set by the `token` that coin component has inherited from `App.js`. The Modal's visible status is set to true. The 'About' section in the modal is set when the `modalToken` is truthy. When this condition is met we use the `findIndex()` array method to retrieve the corresponding `about` section from our `abouts` array is `about.js`.

### Moralis Web3Api Token Price
1. To fetch the token price of a crypto currency, we use Moralis' Web3 API. This gives the `getTokenPrice()` function which requires the contract address of a given token. Here is the code from `App.js`:
```js
useEffect(() => {

    async function fetchTokenPrice() {
      const options = {
        address:
          abouts[abouts.findIndex((x) => x.token === modalToken)].address,
      };
      const price = await Web3Api.token.getTokenPrice(options);
      setModalPrice(price.usdPrice.toFixed(2));
    }

    if(modalToken) {
      fetchTokenPrice()
    }

}, [modalToken]);
```
2. We update our Modal in `App.js` to include this div:
```js
 <div>
    <span style={{ color: 'black' }}>{`Price: `}</span>
    {modalPrice}$
</div>
```
Now the price of a given token is displayed in the Modal.

### Connect Smart Contract and App
1. Create sync event in Moralis server for `tickerupdated` event in `MarketSentiment.sol`. Now our Moralis server is tracking new votes which occur on the [Mumbai Polygon](https://mumbai.polygonscan.com/) testnet.
2. import regular Moralis functions:
```js
import { useMoralisWeb3Api, useMoralis } from "react-moralis";
```
3. Desconstruct `useMoralis()` within the app:
```js
const {Moralis, isInitialized} = useMoralis();
```
4. Create a function in `App.js` to set the vote percentage based on data in Moralis server:
```js
async function getRatio(tick, setPerc) {

    const Votes = Moralis.Object.extend("Votes");
    const query = new Moralis.Query(Votes);
    query.equalTo("ticker", tick);
    query.descending('createdAt');
    const results = await query.first();

    let up = Number(results.attributes.up);
    let down = Number(results.attributes.down);
    let ratio = Math.round(up/(up+down)*100);
    setPerc(ratio);
  };
```
5. Create a `useEffect()` hook that updates the vote percentages in our app every time our Moralis server `isInitialized`.:
```js
useEffect(() => {
    if(isInitialized) {
      getRatio('BTC', setBtc);
      getRatio('ETH', setEth);
      getRatio('BNB', setBNB);
    }
  }, [isInitialized])
```
6. Add the following code to the above `useEffect()` so the app live updates when new votes occur:
```js
useEffect(() => {
    if(isInitialized) {
      getRatio('BTC', setBtc);
      getRatio('ETH', setEth);
      getRatio('BNB', setBNB);

      async function createLiveQuery() {
        let query = new Moralis.Query('Votes');
        let subscription = await query.subscribe();
        subscription.on('update', (object) => {

          if(object.attributes.ticker === 'BNB'){
            getRatio('BNB', setBNB);
          }else if(object.attributes.ticker === "ETH"){
            getRatio('ETH', setEth);
          }else if(object.attributes.ticker === 'BTC'){
            getRatio('BTC', setBtc);
          }
        })
      }
      createLiveQuery();
    }
  }, [isInitialized])
  ```
