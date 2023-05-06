import React from 'react';
import { Link } from "react-router-dom";

function LatestBlocks(props) {
    const { blocks } = props;

  return (
    <div className='bg-gray-300 font-bold rounded-md'>
        {blocks.map((block, index) => (
            <div className={`cursor-pointer pl-5 text-sky-600 font-bold py-2 text-base ${index !== blocks.length - 1 ? 'border-b mx-5' : 'mx-5'}`} key={block.blockNumber}>
                <Link className="App__link" to={`/block/${block.blockNumber}`}>{block.blockNumber}</Link>
            </div>
        ))}
    </div>
  )
}

export default LatestBlocks;