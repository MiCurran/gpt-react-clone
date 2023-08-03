import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {Avatar, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import avatar from './assets/avatar.png'
const systemMessage = {
  "role": "system", "content": "Explain things like you're talking to a software professional with 5 years of experience."
}

function App() {
  const API_KEY = process.env.GPT_API_KEY;
  const [messages, setMessages] = useState([
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    
    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });


    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act. 
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,  // The system message DEFINES the logic of our chatGPT
        ...apiMessages // The messages from our chat with ChatGPT
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
      setIsTyping(false);
    });
  }

  return (
    <div className="App">
        <MainContainer>
           <ChatContainer>
           <div style={{backgroundColor: 'rgb(52 53 65)', padding: '1rem', textAlign: 'center', fontSize: '.8rem'}}>
              <p>GPT Model (Goes Here)</p>
           </div>
            <MessageList
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="Chat Bot is typing" /> : null}
            >
              {messages.length === 0 ? <DefaultGrid /> :
              (messages.map((message, i) => {
                console.log(message)
                return (
                  <div 
                    key={i} 
                    model={message} 
                    style={{
                      backgroundColor: message.sender === 'ChatGPT' ? '#444654' : 'rgb(52 53 65)', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      padding: '2rem', 
                      border: '1px solid rgba(32,33,35,.5)'
                      }}
                  >
                    <Avatar 
                      src={message.sender === 'ChatGPT' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/800px-ChatGPT_logo.svg.png' : avatar}
                    />
                    <p style={{margin: '.8rem'}}>{message.message}</p>
                  </div>
                )
              }))}
            </MessageList>
            <div 
              style={{
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center'
              }}
            >
            <MessageInput 
              attachButton={false} 
              placeholder="Type message here" 
              onSend={handleSend} 
              style={{
                backgroundColor: 'transparent'
              }}
            />        
            </div>
          </ChatContainer>
        </MainContainer>
    </div>
  )
}

export default App

const MainContainer = ({children}) => {
  return (
    <div
      className='layoutContainer'
    >
      <div className='sidebar'>
      </div>
      {children}
    </div>
  )
}

const ChatContainer = ({children}) => {
  return (
    <div
      className='chatContainer'
    >
      {children}
    </div>
  )
}

const MessageList = ({children}) => {
  return (
    <div
      className='messageList'
    >
      {children}
    </div>
  )
}

const DefaultGrid = () => {
  return (
    <div
      style={{
        width: '50%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
      }}
    >
      <div style={{
        display:'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
      >
        <p>Examples</p>
        <Card>
          <p>Explain quantum computing in simple terms</p>
        </Card>
        <Card>
          <p>Got any creative ideas for a 10 year old’s birthday?</p>
        </Card>
        <Card>
          <p>How do I make an HTTP request in Javascript?</p>
        </Card>
      </div>
      <div style={{
        display:'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
      >
        <p>Capabilities</p>
        <Card>
          <p>Remembers what user said earlier in the conversation</p>
        </Card>
        <Card>
          <p>Allows user to provide follow-up corrections</p>
        </Card>
        <Card>
          <p>Trained to decline inappropriate requests</p>
        </Card>
      </div>
      <div style={{
        display:'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
      >
        <p>Limitations</p>
        <Card>
          <p>May occasionally generate incorrect information</p>
        </Card>
        <Card>
          <p>May occasionally produce harmful instructions or biased content</p>
        </Card>
        <Card>
          <p>Limited knowledge of world and events after 2021</p>
        </Card>
      </div>
    </div>
  )
}

const Card = ({children}) => {
  return (
    <div
      style={{
        backgroundColor: '#444654',
        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        borderRadius: '10px',
        margin: '.3rem',
        textAlign: 'center',
        padding: '.6rem',
      }}
    >
      {children}
    </div>
  )
}