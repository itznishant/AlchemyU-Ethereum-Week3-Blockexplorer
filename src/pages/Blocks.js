import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export default function Blocks(props) {
  const { blockNumber, blockHashes} = props;

return(
	<div>
		<div>
		<h1> LATEST BLOCKS </h1>
		<h2> BLOCK INFO: {blockNumber} </h2>
		</div>
		<br />
		<div>
			<strong>BLOCK HASH:  </strong>{blockHashes[0]}
			<br />
	    <strong>PARENT HASH:  </strong>{blockHashes[1]}
    </div>
	</div>
 )
}
