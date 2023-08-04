import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {Avatar, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import avatar from './assets/avatar.png';
import { default_questions } from './constants/default_questions';
const API_KEY = process.env.GPT_API_KEY;
const systemMessage = {
  "role": "system", "content": "Explain things like you're talking to a software professional with 5 years of experience."
}

function App() {
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
          <div className='chatContainer'>
            <div className='headerContainer'>
              <p>Default (GPT-3.5)</p>
            </div>
            <div className='messageList'>
              {messages.length === 0 
                ? <DefaultGrid default_questions={default_questions}/> 
                : (messages.map((message, i) => {
                    console.log(message)
                    return (
                      <div 
                        key={i} 
                        model={message}
                        className='messageContainer' 
                        style={{
                          backgroundColor: message.sender === 'ChatGPT' ? '#444654' : 'rgb(52 53 65)', 
                        }}
                      >
                        <Avatar src={message.sender === 'ChatGPT' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/800px-ChatGPT_logo.svg.png' : avatar} />
                        <p>{message.message}</p>
                      </div>
                    )
                  }))
              }
              {isTyping && <TypingIndicator content="Chat Bot is responding"/>}
            </div>
            <div className='inputContainer'>
              <MessageInput 
                attachButton={false} 
                placeholder="Type message here" 
                onSend={handleSend} 
                style={{
                  backgroundColor: 'transparent'
                }}
              />        
            </div>
          </div>
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

const DefaultGrid = ({default_questions}) => {
  return (
    <div>
      <div className='row'>
        {default_questions.map((question) => (
          <Card 
            key={question.id}
            content={question.content}
            title={question.title}
          />
        ))}
      </div>
    </div>
  )
}

const Card = ({title, content}) => {
  return (
    <div className='contentCard'>
      <p className='title'>{title}</p>
      <p className='content'>{content}</p>
    </div>
  )
}