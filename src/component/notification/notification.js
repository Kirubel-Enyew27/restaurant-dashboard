import React from "react";
import { FaBell } from "react-icons/fa";
import "./notification.css";

const Notification = () => {
  const handleClick = () => {
    alert("Sorry, no updates for the time being!");
  };
  return (
    <>
      <FaBell className="notification" onClick={handleClick} />
    </>
  );
};

export default Notification;
