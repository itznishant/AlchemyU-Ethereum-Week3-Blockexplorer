import axios from 'axios';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Search from './components/Search.jsx';
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
  const [supply, setSupply]= useState("");
  const [blocksData, setBlocksData] = useState([]);
  const [blockNumber, setBlockNumber] = useState();
  const [blockHashes, setBlockHashes] = useState([]);
  const [blockGasInfo, setBlockGasInfo] = useState([]);
  // const [latestBlock, setLatestBlock] = useState();
  const [networkGasPrice, setNetworkGasPrice] = useState("");
  const [topTransactions, setTopTransactions] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState();
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

      //ETH Data
      const BASE_URL = "https://api.etherscan.io/api";
      const REQ_PARAM = "ethsupply";
      const requestUrlSupply = `${BASE_URL}?module=stats&action=${REQ_PARAM}`;

      return new Promise((resolve, reject) => {
        axios.get(requestUrlSupply).then((response) => {
          const ethSupply = response.data.result;
          resolve(setSupply(ethSupply));
        });
      });

      //set react state values
      // setNetwork(NETWORK);
      setBlocksData(blocksData);
      setBlockGasInfo([parseInt(result.gasLimit), parseInt(result.gasUsed),parseInt(gasUsedPct),parseInt(gasTarget)]);
      setNetworkGasPrice(gasPrice.toString());
      setBlockHashes([result.hash, result.parentHash]);
      setTotalTransactions(result.transactions.length);
      setTopTransactions(topTransactions);
      setBlockNumber(parseInt(result.number));
    }

  useEffect(() => {
    displayBlockchainData()
  }, [topTransactions])


  return (
    <Router>
    <div className="App">
      <Navbar />
      <br />
      <div className='pt-14 flex justify-center'>
        <Search />
      </div>
      <br />
    <div>
        <h2  className="chain__stats_left">Mainnet Stats</h2>      
          <ul className="chain__stats_left">
            <li>GAS PRICE: {networkGasPrice.slice(0,5)} Gwei</li>
            <li>TOTAL SUPPLY: {supply} ETH</li>
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
            <br /><br />
            <strong>PARENT HASH:</strong> {blockHashes[1]}
            <br /><br />
            <strong>Top TRANSACTIONS: </strong> {topTransactions.map( (txID, index) => <ul key={txID}><Link className="links" to={`/transaction/${txID}`}>{txID}</Link></ul>)}
        </div>

      <div>
      <h2 className="chain__data_right">LATEST BLOCKS</h2>
      <Switch>
        <Route exact path='/'>
          <div className='chain__data_right'>
            <LatestBlocks blocks={blocksData}/> 
          </div>
        </Route>
      </Switch>
      </div>
    </div>
    <Footer />
    </div>
  </Router>
  );
}

export default App;
