
export default function Transactions(props) {
  const { transactionID } = props;

return(
	<div>
		<h1> TRANSACTION DETAILS </h1>
		<h2> TRANSACTION INFO: {transactionID} </h2>
    <div> {transactionID} </div>
  </div>
 )
}
