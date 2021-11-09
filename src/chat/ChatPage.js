import React, {useEffect, useState} from 'react';
import s from './Chat.module.scss'
import Avatar from '@mui/material/Avatar';
import photo from '../common/assets/img/square_320_431787d41442021a815067689754243d.jpg'
import { FaTelegramPlane } from 'react-icons/fa';
import {Alert} from "@mui/material";

function ChatPage() {

    const [wsChannel, setWsChannel] = useState(null)
    const [readyStatus, setReadyStatus] = useState('pending')
    const [messages, setMessages] = useState([])

    const closeHandler = () => {
        console.log('close ws')
        setReadyStatus('close')
    }
    const openHandler = () => {
        console.log('open ws')
        setReadyStatus('ready')
    }
    const errorHandler = (e) => {
            console.log("Error: ", e)
    }
    const receiveMessage = (e) => {

         let newMessage = {
             message: e.data,
             time: new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}),
             local:false
         }

        setMessages((prevMessages) => [...prevMessages, newMessage])

    }

    useEffect(() => {
        messages.length > 0 && localStorage.setItem('messages', JSON.stringify(messages));
        const chatRef = document.getElementById('chat')
        if (chatRef) chatRef.scrollTop = chatRef.scrollHeight;
    },[messages])


    const sendMessage = (message) => {
        if(wsChannel) wsChannel.send(message)
    }

    useEffect(() => {
        let messages = localStorage.getItem('messages')

        if (messages) {
            setMessages(JSON.parse(messages))
        }
        let ws = new WebSocket('wss://ws.qexsystems.ru')

        ws.addEventListener("open",openHandler)
        ws.addEventListener("message", receiveMessage)
        ws.addEventListener('close', closeHandler)
        ws.addEventListener("error", errorHandler)

        setWsChannel(ws)

        return () => {
            if(wsChannel) {
                wsChannel.removeEventListener('close', closeHandler)
                wsChannel.addEventListener("open",openHandler)
                wsChannel.addEventListener("message", receiveMessage)
                wsChannel.addEventListener("error", errorHandler)
            }
        }

    }, [])


    return (

        <div className={s.chatWrap}>
            <div className={s.header}>
                <Avatar
                    sx={{ width: 40, height: 40, position:'absolute', left: 22, top: 12 }}
                    src={photo}/>
                <span className={s.name} style={{flex: '1'}}> {'First name + Last name'}</span>

            </div>
            <Messages  messages={messages}/>
            <AddMessageForm readyStatus={readyStatus} setMessages={setMessages} sendMessage={sendMessage}/>
        </div>
    )
}
export default  ChatPage

function Messages({messages}) {

    return (
        <div id ={'chat'} className={s.messages}>
            {messages.map((m, index) =>
                <Message local={m.local} time={m.time} message={m.message} key={index}/>)}
        </div>
     )
 }




function Message({message,time,local}) {

    let messageClass = local ? s.messageWrap + ' ' + s.localMessageWrap : s.messageWrap
     return (
         <div className={messageClass}>
             {!local &&
             <div className={s.avatar}>
                 <Avatar sx={{ width: 54, height: 54 }} src={photo}/>
             </div>}
             <div className={s.messageInfo}>
                 <div className={s.nameWrap} >
                     {!local && <span className={s.name} style={{flex: '1'}}> {'First name + Last name'}</span>}
                     <span className={s.message}> {message}</span>
                 </div>
                 <div  className={s.time} > {time}</div>
             </div>

         </div>
     );
 }

function AddMessageForm({setMessages, sendMessage,readyStatus }) {
    const [message, setMessage] = useState('')

    let connection = navigator.onLine
    const localMessage = (message) => {

        let newMessage = {
            message: message,
            time: new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'}),
            local:true
        }

        setMessages((prevMessages) => [...prevMessages, newMessage])
    }

    const sendMessageHandler = () => {
        if (!message) return;
        sendMessage(message)
        localMessage(message)
         setMessage('')
    }

   const onChangeHandler = (e) => {
        setMessage(e.currentTarget.value)
    }

    let iconClass = !!message ? s.icon + ' ' + s.activeIcon : s.icon

    return <div className={s.formGroup}>
        { !connection &&  <Alert className={s.alert} severity="warning">App working in offline mod, check the internet connection</Alert>}
        <textarea
                  disabled={ readyStatus !== 'ready' || !connection}
                  placeholder={'Enter text message...'}
                  className={s.textarea}
                  value={message}
                  onChange={onChangeHandler}
        />
        <FaTelegramPlane
            className={iconClass}
            onClick={sendMessageHandler}
        />
    </div>;
}



