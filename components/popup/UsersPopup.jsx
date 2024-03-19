import React from "react";
import PopupWrapper from "./PopupWrapper";
import Avatar from "../Avatar";
import { useAuth } from "@/context/authContext";
import { useChatContext } from "@/context/chatContext";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import Search from "../Search";

const UsersPopup = (props) => {
  const { currentUser } = useAuth();
  const { users, dispatch } = useChatContext();

  const handleSelect = async (user) => {
    console.log("handle select called", user, currentUser);
    try {
      const combinedId =
        currentUser.uid > user.uid
          ? currentUser.uid + user.uid
          : user.uid + currentUser.uid;
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        // chat doc doesn't exists
        await setDoc(doc(db, "chats", combinedId), {
          messages: [],
        });

        const currentUserChatRef = await getDoc(
          doc(db, "userChats", currentUser.uid)
        );
        const userChatRef = await getDoc(doc(db, "userChats", user.uid));

        // only for error handling
        if (!currentUserChatRef.exists()) {
          await setDoc(doc(db, "userChats", currentUser.uid), {});
        }
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoUrl: user.photoUrl || null,
            color: user.color,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        if (!userChatRef.exists()) {
          await setDoc(doc(db, "userChats", currentUser.uid), {});
        }
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoUrl: currentUser.photoUrl || null,
            color: currentUser.color,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      } else {
        // chat doc exists
      }
      dispatch({ type: "CHANGE_USER", payload: user });
      props.onHide();
    } catch (error) {
      console.log("error");
      console.error(error);
    }
  };

  return (
    <PopupWrapper {...props}>
      <Search />
      <div className="mt-5 flex flex-col gap-2 grow relative overflow-auto scrollbar">
        <div className="absolute w-full">
          {users &&
            Object.values(users).map((user) => (
              <div
              key={user.id}
                className="flex items-center gap-4 rounded-xl hover:bg-c5 py-2 px-4 cursor-pointer"
                onClick={() => handleSelect(user)}
              >
                <Avatar size="large" user={user} />
                <div className="flex flex-col gap-1 grow">
                  <span className="text-base text-white flex text-center justify-between">
                    <div className="font-medium">{user.displayName}</div>
                  </span>
                  <p className="text-sm text-c3">{user.email}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </PopupWrapper>
  );
};

export default UsersPopup;
