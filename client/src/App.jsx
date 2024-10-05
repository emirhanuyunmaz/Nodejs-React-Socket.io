import axios from 'axios'
import { useEffect, useState } from 'react'
import Cookies from "js-cookie"
import {io} from "socket.io-client"
import { useParams } from 'react-router-dom';

// Socket bağlama işlemi.
const socket = io('http://localhost:3000', { transports: ['websocket'], reconnection: true });

function App() {
  const {id} = useParams()
  const userId = Cookies.get("id")
  const [messageList,setMessageList] = useState([])
  const [message,setMessage] = useState("")
  const [userList,setUserList] = useState([])

  // Tarih bilgisini formatlama için kullanılan fonksiyon.
  function formatDate(date) {
    let d =new Date(date)
    let datePart = [
      d.getMonth() + 1,
      d.getDate(),
      d.getFullYear()
    ].map((n, i) => n.toString().padStart(i === 2 ? 4 : 2, "0")).join("/");
    let timePart = [
      d.getHours(),
      d.getMinutes(),
    ].map((n, i) => n.toString().padStart(2, "0")).join(":");
    return datePart + " " + timePart;
  }

  // Mesaj gönderme işlemi
  async function onSubmit(e) {
    e.preventDefault()
    socket.emit('sendMessage', {text:message,token:Cookies.get("token") ,getUserId:id}); // Sunucuya mesaj gönderme olayı
    setMessage("")
  }

  // Tüm kullnıcıları çekme işlemi
  async function getUserList(){
    const res = await axios.get("http://localhost:3000/userList",{
      headers:{
        token:Cookies.get("token"),
      }
    })
    if(res.status === 201){
      setUserList(res.data.userList)
    }
  
  }


  // Tüm mesajları çekme işlemi
  async function getAllMessage(){
    if(id !== undefined){
      const res = await axios.get("http://localhost:3000/message",{
        headers:{
          token:Cookies.get("token"),
          getUserId:id
        }
      })
      setMessageList(res.data.allMessage)
    }
  }

  useEffect(() => {
    // console.log(id);
    
    getAllMessage()
    getUserList()
    // Gelen mesaj verisini dinleyip sadece gerekli olanları listeye ekleme işlemi.
    socket.on('receiveMessage', (newMessage) => {
      if((newMessage.getUserId == id && newMessage.sendUserId == userId) ||(newMessage.getUserId == userId && newMessage.sendUserId == id ) ){
        setMessageList((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    // Bağlantı kesilmeden önce Socket'i temizle
    return () => {
      socket.disconnect();
    };
  },[id])

  // console.log(messageList);

  return (
    <div className='flex w-[90%] py-10 mx-auto min-h-screen max-h-screen '>

      <div className='w-1/4 pt-5 flex flex-col gap-3 bg-blue-100 '>

          {/* ...User Profile... */}
          {
            userList.map((item) => {
              return (<a key={item._id} href={`/${item._id}`}>
                <div className='bg-green-500 ms-3 me-3 px-3 py-2 rounded-xl text-white hover:opacity-80 duration-300 cursor-pointer'>
                  <p>{item.nameSurname}</p>
                  </div>
              </a>)
            })
          }
      </div>
      
      
        <div className='w-3/4 bg-green-200 '>
        {
        id && <>
          <div className='flex flex-col gap-2 h-[88%] bg-green-200 pt-5 ps-2 overflow-y-auto mb-3' >
            {
              messageList.map((item) => {
                return <>
                  {item.getUserId != id && <div key={item._id} className='  '>
                  <div className='rounded-xl rounded-bl-none bg-blue-200 inline-block px-6 py-2'>
                    <p className=' '>{item.text}</p>
                    <p className='text-xs mt-1'>{formatDate(item.createAt)}</p>
                  </div>
                </div>}

                  {item.getUserId == id && <div key={item._id} className=' flex justify-end px-6'>
                  <div className='rounded-xl rounded-br-none bg-blue-200 inline-block px-6 py-2'>
                    <p className=' '>{item.text}</p>
                    <p className='text-xs mt-1'>{formatDate(item.createAt)}</p>
                  </div>
                </div>}
                </>
              })
            }
            
          </div>
          
          <div className='h-[10%] flex gap-5 mx-3 justify-center items-center'>
            <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Mesaj' className='h-[75%] w-[90%] rounded-xl px-5 outline-none' type="text" />
            <button onClick={onSubmit} className='h-[75%] w-[10%] bg-green-500 rounded-xl text-white hover:opacity-80 duration-300'>Send</button>
          </div>
          </>
        
      }
      </div>
    </div>
  )
}

export default App
