import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { db, firestore } from "../../fb/fb";

export const addMinute = (docId, sort, curSec, addSec) => {
  console.log(sort);
  let d1 = new Date();
  let d2 = new Date(d1);
  if (curSec * 1000 > d2.getTime()) {
    d2.setTime((curSec + addSec) * 1000);
  } else {
    d2.setTime(d2.getTime() + addSec * 1000);
  }
  db.collection("Groups")
    .doc(docId)
    .update({ [sort]: firestore.Timestamp.fromDate(d2) });
};

const Timer = ({ timeData }) => {
  const [now, setNow] = useState(Date.now());
  const endTime = timeData.seconds * 1000;
  const remainSeconds = Math.round((endTime - now) / 1000);
  const remainMin = Math.floor(remainSeconds / 60);
  const remainSec = Math.floor(remainSeconds % 60);
  const n = (number) => {
    return number >= 10 ? number : "0" + String(number);
  };
  const remainTime =
    remainSeconds < 0 ? "00:00" : `${n(remainMin)}:${n(remainSec)}`;

  useEffect(() => {
    const int = setInterval(() => {
      setNow(Date.now());
    }, 500);
    return () => clearInterval(int);
  }, []);
  return <Box>{remainTime}</Box>;
};

export default Timer;
