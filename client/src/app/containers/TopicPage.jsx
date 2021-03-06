import React from 'react';
import Topic from '../components/Topic.jsx';
import PartitionList from '../components/PartitionList.jsx';
import MessageList from '../components/MessageList.jsx';
import circularBuffer from 'circular-buffer';

import { ipcRenderer } from 'electron';
import '../css/TopicPage.scss';
import '../css/PartitionList.scss';

class TopicPage extends React.Component {
  constructor(props) {
    super(props);
    this.buffer = new circularBuffer(100);
    this.messagesToDisplay = new circularBuffer(100);
    this.state = {
      topics: [],
      topicInfo: {},
      showPartitions: false,
      buttonId: -1,
      messages: [],
      hover: false,
      partitionId: '',
      lastElement: '',
      lastParentDiv: ''
    };

    this.showPartitions = this.showPartitions.bind(this);
    this.showMessages = this.showMessages.bind(this);
  }
  // Lifecycle methods

  componentDidMount() {
    //code here
    ipcRenderer.on('partition:getMessages', (e, message) => {
      console.log('logging messages: ', message);

      // Create a copy of the message list from state and unshift the new message to the
      // front of the array.
      // SOMETHING TO TEST: IS CONCAT 
      let newMessage = this.state.messages.slice();
      newMessage.unshift(message);
      this.setState({
        messages: newMessage
      });
      console.log('logging state messages: ', this.state.messages);
    });
  }
  // Methods
  showPartitions(event) {
    const topicInfo = this.props.topicList;
    const i = parseInt(event.target.id);

    //WORKING ON LOGIC HERE
    // this is how you get parent div of the button clicked
    let parentDiv = event.target.parentElement;
    let lastParentDiv = this.state.lastParentDiv;

    if (this.state.showPartitions && this.state.buttonId === i) {
      return this.setState({
        showPartitions: false
      });
    }
    let newState = this.state;
    newState.showPartitions = true;
    newState.buttonId = i;
    newState.topicInfo = topicInfo[i];

    return this.setState(newState);
  }

  showMessages(event) {
    const topicName = event.target.getAttribute('topicname');
    const partitionNumber = parseInt(event.target.id);
    const partitionId = topicName + partitionNumber;

    let element = event.target;
    let lastElement = this.state.lastElement;

    if (lastElement !== element) {
      if (lastElement !== '') {
        lastElement.classList.remove('highlight-this');
      }
      this.setState({
        lastElement: element
      });
      element.classList.add('highlight-this');
    }

    let uri = this.props.uri;

    if (uri === 'a') {
      uri = '157.230.166.35:9092';
    }

    if (partitionId !== this.state.partitionId) {
      this.setState({
        messages: [],
        partitionId: partitionId
      });
      ipcRenderer.send('partition:getMessages', {
        host: uri,
        topic: topicName,
        partition: partitionNumber
      });
    }
  }

  render() {
    const Topics = this.props.topicList.map((element, i) => {
      return <Topic key={i} id={i} topicInfo={element} showPartitions={this.showPartitions} />;
    });

    let loadingMessages = (
      <div class="spinner">
        <div class="bounce1" />
        <div class="bounce2" />
        <div class="bounce3" />
      </div>
    );

    return (
      <div className="topic-page-container">
        <div className="topic-list container">{Topics}</div>
        <div className="incoming-messages-indicator">
          {this.state.messages.length > 0 ? loadingMessages : ''}
        </div>
        <div className="bottom-container">
          <div>
            {this.state.showPartitions === true ? (
              <PartitionList showMessages={this.showMessages} topicInfo={this.state.topicInfo} />
            ) : (
              ''
            )}
          </div>
          <div>
            {this.state.messages.length > 0 ? (
              <MessageList messageArray={this.state.messages} />
            ) : (
              ''
            )}
          </div>
          <div />
        </div>
      </div>
    );
  }
}

export default TopicPage;
