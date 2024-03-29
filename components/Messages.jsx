import { useChatContext } from "@/context/chatContext";
import { db } from "@/firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useChatContext();
  const ref = useRef();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages);
      }
    });
    return () => unsub();
  }, [data.chatId]);
  return (
    <div ref={ref} className="grow p-5 overflow-auto scrollbar flex flex-col">
      {messages?.map((m) => {
        return <Message key={m.id} message={m} />;
      })}
    </div>
  );
};

export default Messages;
