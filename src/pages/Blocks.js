import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

export default function Blocks() {
  const {blocknumber} = useParams();
  const [blockTxns, setBlockTxns] = useState();
  const [blockHashes, setBlockHashes] = useState([]);
  const [effGas, setEffGas] = useState([]);
  // const blocknumber = 17207814;

  useEffect(() => {
    async function blockTransactions() {
      try{
        const block = await alchemy.core.getBlockWithTransactions(parseInt(blocknumber));
        setBlockTxns(block);

        Promise.resolve(block).then((result) => {
          const hash = result.hash;
          const parentHash = result.parentHash;
          setBlockHashes([hash, parentHash]); 
          })
        } catch (error) {
            console.error(error);
        }
    }

    if (blocknumber) {
      blockTransactions();
    }
  }, [blocknumber]);

   useEffect(() => {
    async function blockReward() {
      try {
          const blockHash = blockTxns.hash;
          const hashObj = {
              blockHash: blockHash
          };
          const txnReceipts = await alchemy.core.getTransactionReceipts(hashObj);
          const receipts = txnReceipts.receipts;

          for (let i = 0; i < 10; i++) {
              const receipt = receipts[i];
              const effectiveGasPrice = parseInt(receipt.effectiveGasPrice);
              effGas.push(effectiveGasPrice);
          }
          setEffGas(effGas);

      	} catch (error) {
          console.error(error);
        }
      }
      
      if(blockTxns) {
          blockReward();
      }  
  	}, [blockTxns]);

  useEffect(() => {
   }, [])

return(
  <div>
    <div className="blocks"><h2>BLOCK NUMBER: {blocknumber}</h2></div>
    <div className="blocks">
      <div><h3><strong>BLOCK HASH: </strong>{blockHashes[0]}</h3></div>
      <div><h3><strong>PARENT HASH: </strong>{blockHashes[1]}</h3></div>
    </div>
    <div className='flex pt-5'>
      <div className='justify-center bg-gray-200 mx-10 rounded-md w-full'>
        {blockTxns ? (
        <div>
          <div className='flex flex-row'>
            <div className='w-1/3'> <div className='flex'><strong>Block Height:</strong> </div> </div>
            <div className='w-2/3'> <div className='flex'> {blocknumber} </div> </div>
          </div>
          
          <div className='flex flex-row'>
            <div className='w-1/3'> <div className='flex'><strong>Transactions:</strong></div> </div>
            <div className='w-2/3'> <div className='flex flex-row'>
            <div className='pr-1 text-sky-600 cursor-pointer'>{blockTxns.transactions.length} transactions in block</div>
            </div>
            </div>
          </div>
        </div>
        ) : (
          "Loading"
        )}
    </div>
  </div>



  </div>
 )
}
