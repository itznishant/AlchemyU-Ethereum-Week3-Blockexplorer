import React from 'react';
import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import { Utils } from "alchemy-sdk";

const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };
const alchemy = new Alchemy(settings);

export default function Transactions() {
  const {transaction} = useParams();
  // const [balances, setBalances] = useState();
  
  useEffect(() => {
        async function getTxDetails() {
          console.log(transaction);
          // setBalances(addressBalances);
        };
    getTxDetails();
  }, []);

  return(
  	<div className="transaction">
  		<h1> TRANSACTION DETAILS </h1>
  		<h2> TRANSACTION ID: {transaction} </h2>
      <div> {transaction} </div>
    </div>
  )
}
