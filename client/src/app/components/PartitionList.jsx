import React from 'react';
import Partition from '../components/Partition.jsx';

const PartitionList = props => {
  let partitionsArray = [];
  const numberOfPartitions = props.topicInfo.partition;

  for (let i = 0; i < numberOfPartitions; i++) {
    partitionsArray.push(
      <Partition
        key={i}
        id={i}
        showMessages={props.showMessages}
        topicName={props.topicInfo.topic}
      />
    );
  }

  return (
    <div className="partition-list">
      <h5 className="p-header">Partitions</h5>
      {partitionsArray}
    </div>
  );
};

export default PartitionList;
