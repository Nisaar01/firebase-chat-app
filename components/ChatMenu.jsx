import React from "react";
import ClickAwayListener from "react-click-away-listener";

const ChatMenu = ({ setshowMenu, showMenu }) => {
  const handleClickAway = () => {
    console.log("clicked");
    setshowMenu(false);
  };

  //   return (<div className="">huhuhuh</div>
  //   );
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className="w-[200px] absolute top-[70px] right-5 bg-c0 z-10 rounded-md overflow-hidden">
        <ul className="flex flex-col py-2">
          <li className="flex items-center py-3 px-5 hover:bg-black cursor-pointer">
            Block user
          </li>
          <li className="flex items-center py-3 px-5 hover:bg-black cursor-pointer">
            Delete user
          </li>
        </ul>
      </div>
    </ClickAwayListener>
  );
};

export default ChatMenu;
