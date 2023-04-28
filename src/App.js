import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';

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
  const [blockNumber, setBlockNumber] = useState();
  const [blockHashes, setBlockHashes] = useState([]);
  const [blockGasInfo, setBlockGasInfo] = useState([]);
  const [topTransactions, setTopTransactions] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState();

  const displayBlockchainData = async () => {
      //get block data
      const result = await alchemy.core.getBlock(blockNumber);

      const gasTarget = -1 * (parseInt((parseInt(result.gasLimit)/2) - parseInt(result.gasUsed)) / (parseInt(result.gasLimit)/2)) * 100;
      const gasUsedPct = (parseInt(result.gasUsed) / parseInt(result.gasLimit)) * 100;

      // Transactions List 
      const topTransactions = [];

      for (var i = result.transactions.length-1; i >= result.transactions.length-10; i--) {
        topTransactions.push(result.transactions[i]);
      }

      //set react state values
      setBlockGasInfo([parseInt(result.gasLimit), parseInt(result.gasUsed),parseInt(gasUsedPct),parseInt(gasTarget)]);
      setBlockHashes([result.hash, result.parentHash]);

      setTotalTransactions(result.transactions.length);
      setTopTransactions(topTransactions);

      setBlockNumber(parseInt(result.number));
    }

  useEffect(() => {
    displayBlockchainData()
  }, [])


  return (
    <div className="App">
      <Navbar BLOCKEXPLORER DAPP/>
    <br />
    <br />
    <h3 className="chain__stats">Block Stats</h3>
      <ul className="chain__stats">
        <li>TOTAL BLOCKS: {blockNumber}</li>
        <li>CURRENT BLOCK: {blockNumber}</li>
        <li>TOTAL TRANSACTIONS: {totalTransactions}</li>
        <li>GAS LIMIT: {blockGasInfo[0]}</li>
        <li>GAS USED: {blockGasInfo[1]} ({blockGasInfo[2]}%)</li>
        <li>GAS TARGET: {blockGasInfo[3]}%</li>
      </ul>
    
      <br />
      <br />
      <div><strong>BLOCK DATA:</strong>
        <br />
        <br />
          <div>
            <strong>BLOCK HASH:</strong> {blockHashes[0]}          
            <br />
            <strong>PARENT HASH:</strong> {blockHashes[1]}
            <br />
            <br />
            <br />
            <strong>TOP 10 TRANSACTIONS: </strong>
            <div>
              {topTransactions.map( (txID, index) => <ul>{index+1}. {txID} </ul>)}
            </div>
          </div>
      </div>
    </div>

  );
}

export default App;
