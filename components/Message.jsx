import { useAuth } from "@/context/authContext";
import React from "react";
import Avatar from "./Avatar";
import { useChatContext } from "@/context/chatContext";
import Image from "next/image";
import ImageViewer from "react-simple-image-viewer";
import { Timestamp } from "firebase/firestore";
import { formateDate } from "@/utils/helpers";

const Message = ({ message }) => {
  const { currentUser } = useAuth();
  const { users, data, imageViewer, setImageViewer } = useChatContext();
  const self = message.sender === currentUser.uid;
  console.log("self -> ", self);
  if (self) {
    console.log(currentUser);
  } else {
    console.log(users[data.user.uid]);
  }
  const timestamp = new Timestamp(
    message?.date?.seconds,
    message?.date?.nanoseconds
  );
  const date = timestamp.toDate();

  return (
    <div className={`mb-5 max-w-[75%] ${self ? "self-end" : ""}`}>
      <div
        className={`flex items-end gap-3 mb-1 ${
          self ? "justify-start flex-row-reverse" : ""
        }`}
      >
        <Avatar
          size="small"
          user={self ? currentUser : users[data.user.uid]}
          className="mb-4"
        />
        <div
          className={`group flex flex-col gap-4 p-4 rounded-3xl relative break-all ${
            self ? "rounded-br-md bg-c5" : "rounded-bl-md bg-c1"
          }`}
        >
          {message.text && <div className="text-sm">{message.text}</div>}
          {message.img && (
            <>
              <Image
                onClick={() => {
                  setImageViewer({ msgId: message.id, url: message.img });
                }}
                src={message.img}
                width={250}
                height={250}
                alt={message?.text || ""}
                className="rounded-3xl max-w-[250px]"
              />
              {imageViewer && imageViewer.msgId === message.id && (
                <ImageViewer
                  src={[imageViewer.url]}
                  currentIndex={0}
                  disableScroll={false}
                  closeOnClickOutside={true}
                  onClose={() => setImageViewer(null)}
                />
              )}
            </>
          )}
        </div>
      </div>
      <div
        className={`flex items-end ${
          self ? "justify-start flex-row-reverse mr-12" : "ml-12"
        }`}
      >
        <div className="text-xs text-c3">{formateDate(date)}</div>
      </div>
    </div>
  );
};

export default Message;
