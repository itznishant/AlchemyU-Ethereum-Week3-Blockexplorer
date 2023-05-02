import { useState } from "react";

function TransactionViewer(txID) {
  const [txHash, setTxHash] = useState("");
  const setValue = (setter) => (evt) => setter(evt.target.value);
  
  async function getTXDetails(evt) {
    evt.preventDefault();

    try {
      console.log("TX HASH: ", txHash);
    } catch(err) {
      console.log(err);
    }
  }

return (
  <form className="container transaction__detail" onSubmit={getTXDetails}>
    <h1>Get Transaction Details</h1>

    <label>
      <strong>Enter Transaction ID: </strong> 
      <input
        placeholder="Type transaction ID"
        value={txHash}
        onChange={setValue(setTxHash)}
      ></input>
    </label>

    <input type="submit" className="button" value="GET DETAILS" />
  </form>
  );
}

export default TransactionViewer;
