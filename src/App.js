import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TransactionViewer from './components/TransactionViewer';
import LatestBlocks from './components/LatestBlocks';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// Alchemy SDK is an umbrella library with several different packages.
const alchemy = new Alchemy(settings);

function App() {
  // const [network, setNetwork] = useState("");
  const [blocksData, setBlocksData] = useState([]);
  const [blockNumber, setBlockNumber] = useState();
  const [blockHashes, setBlockHashes] = useState([]);
  const [blockGasInfo, setBlockGasInfo] = useState([]);
  // const [latestBlock, setLatestBlock] = useState();
  const [networkGasPrice, setNetworkGasPrice] = useState("");
  const [topTransactions, setTopTransactions] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState();
  const [trxnHash, setTrxnHash] = useState("");
  // const [transactionDetails, setTransactionDetails] = useState([])

  const displayBlockchainData = async () => {
      // const NETWORK = settings.network.toString().toUpperCase();
      // console.log(NETWORK);
      //get block data
      const result = await alchemy.core.getBlock(blockNumber);
      
      //gas price in gwei
      const gasPrice = await alchemy.core.getGasPrice().then( response => ((parseInt(Utils.parseUnits(response.toString(), 'wei'))) / 10**9) );
      
      const gasTarget = -1 * (parseInt((parseInt(result.gasLimit)/2) - parseInt(result.gasUsed)) / (parseInt(result.gasLimit)/2)) * 100;
      const gasUsedPct = (parseInt(result.gasUsed) / parseInt(result.gasLimit)) * 100;

      // Transactions List 
      for (var i = result.transactions.length-1; i >= result.transactions.length-10; i--) {
        topTransactions.push(result.transactions[i]);
      }

      //Latest blocks
      const blockPromises = [];
      for (i = result.number; i > result.number-5;  i--) {
        blockPromises.push(i);
      }

      const blocks = await Promise.all(blockPromises);
      const blockTimestamps = await Promise.all(blockPromises.map(async (blockNumber) => {
          const block = await alchemy.core.getBlock(blockNumber);
          return block.timestamp;
      }));

      const blocksData = blockTimestamps.map((timestamp, index) => ({
          blockNumber: blocks[index],
          timestamp
      }));

      // transactions in blocks
      // const transactionDetails = await alchemy.core.getBlockWithTransactions(SOME_BLOCK_NUMBER)

      // const txHash = result.transactions === ? "" : "";

      //Call the method
      let response = await alchemy.core.getTransactionReceipt(result.transactions[0])
      const trxnHash = response.transactionHash.toString();


      //set react state values
      // setNetwork(NETWORK);
      setTrxnHash(trxnHash);
      setBlocksData(blocksData);
      setBlockGasInfo([parseInt(result.gasLimit), parseInt(result.gasUsed),parseInt(gasUsedPct),parseInt(gasTarget)]);
      setNetworkGasPrice(gasPrice.toString());
      setBlockHashes([result.hash, result.parentHash]);
      

      setTotalTransactions(result.transactions.length);
      setTopTransactions(topTransactions);

      setBlockNumber(parseInt(result.number));
      // setLatestBlocks(latestBlocks);
    }

  useEffect(() => {
    displayBlockchainData()
  }, [topTransactions])


  return (
    <Router>
    <div className="App">
      <Navbar BLOCKEXPLORER DAPP/>
      <br />
      <br />
      <TransactionViewer txID={trxnHash} />
    <br />
    <div>
        <h2  className="chain__stats_left">Mainnet Stats</h2>      
          <ul className="chain__stats_left">
            <li>ETH PRICE: {blockNumber}</li>
            <li>GAS PRICE: {networkGasPrice.slice(0,5)} Gwei</li>
            <li>TOTAL SUPPLY BLOCK: {blockNumber}</li>
            <li>CIRCULATING SUPPLY: {blockNumber}</li>
            <li>TOTAL ISSUANCE: {} </li>
          </ul>
        <h2 className="chain__stats">Block Stats</h2>
          <ul className="chain__stats">
            <li>TOTAL BLOCKS: {blockNumber}</li>
            <li>CURRENT BLOCK: {blockNumber}</li>
            <li>TOTAL TRANSACTIONS: {totalTransactions}</li>
            <li>GAS LIMIT: {blockGasInfo[0]}</li>
            <li>GAS USED: {blockGasInfo[1]} ({blockGasInfo[2]}%)</li>
            <li>GAS TARGET: {blockGasInfo[3]}%</li>
          </ul>
    </div>
      <br />
      <br />
      <div>
      <h2 className="chain__data">BLOCK DATA</h2>
        <div className="chain__data">
            <strong>BLOCK HASH:</strong> {blockHashes[0]}          
            <br />
            <br />
            <strong>PARENT HASH:</strong> {blockHashes[1]}
            <br />
            <br />
            <strong>TOP 10 TRANSACTIONS: </strong> {topTransactions.map( (txID, index) => <ul>{index+1}. {txID} key={txID} </ul>)}
        </div>

      <div>
      <h2 className="chain__data_right">LATEST BLOCKS</h2>
      <Switch>
        <Route exact path="/">
          <div className='chain__data_right'>
            <LatestBlocks blocks={blocksData}/> 
          </div>
        </Route>
      </Switch>
      </div>
    </div>
    </div>
  </Router>
  );
}

export default App;
