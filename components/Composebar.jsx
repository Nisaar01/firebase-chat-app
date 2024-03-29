import { useAuth } from "@/context/authContext";
import { useChatContext } from "@/context/chatContext";
import { db, storage } from "@/firebase/firebase";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React from "react";
import { TbSend } from "react-icons/tb";
import { v4 as uuid } from "uuid";

const Composebar = () => {
  const {
    inputText,
    setInputText,
    data,
    attachment,
    setAttachment,
    setAttachmentPreview,
  } = useChatContext();
  const { currentUser } = useAuth();
  const handleTyping = (e) => {
    setInputText(e.target.value);
  };
  const onkeyup = (e) => {
    if (e.key === "Enter" && (inputText || attachment)) {
      handleSend();
    }
  };

  const handleSend = async () => {
    if (attachment) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, attachment);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("upload is " + progress + "% done.");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("upload is running");
              break;
          }
        },
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: inputText,
                sender: currentUser.uid,
                date: Timestamp.now(),
                read: false,
                img: downloadUrl,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: inputText,
          sender: currentUser.uid,
          date: Timestamp.now(),
          read: false,
        }),
      });
    }

    let msg = {text: inputText};
    if(attachment){
      msg.img = true
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: msg,
      [data.chatId + ".data"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: msg,
      [data.chatId + ".data"]: serverTimestamp(),
    });
    setInputText("");
    setAttachment(null);
    setAttachmentPreview(null);
  };
  return (
    <div className="flex items-center gap-2 grow">
      <input
        type="text"
        className="grow w-full outline-0 px-2 py-2 text-white bg-transparent placeholder:text-c3 outline-none text-base"
        placeholder="Type a message"
        onKeyUp={onkeyup}
        value={inputText}
        onChange={handleTyping}
      />
      <button
        className={`h-10 w-10 rounded-xl shrink-0 flex justify-center items-center ${
          inputText.trim().length > 0 ? "bg-c4" : ""
        }`}
      >
        <TbSend onClick={handleSend} size={20} className="text-white " />
      </button>
    </div>
  );
};

export default Composebar;
