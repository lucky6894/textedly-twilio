"use client"

import axios from "axios";
import { useEffect, useState } from "react";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;

export default function HomePage() {
  // const [statistics, setStatistics] = useState<any>();
  const [messages, setMessages] = useState<number>();

  useEffect(() => {
    // axios.get("http://localhost/api/statistics").then(({data}) => {
    //   setStatistics(data);
    // });
    axios.get("http://20.47.120.34:801/api/messages/all").then(({data}) => {
      setMessages(data);
    })
  }, []);

  return (
    <div>
      {/* <div className="border-2 w-64 rounded-2xl p-4 bg-gray-200">
        <p className="font-semibold mb-2">Balance</p>
        <p className="font-bold text-lg">${statistics?.balance.amount}</p>
      </div> */}
      <div className="border-2 w-64 rounded-2xl p-4 bg-[#E0F3E9]">
        <p className="font-semibold mb-2">Messages</p>
        <p className="font-bold text-lg">{messages}</p>
        <p>Total messages sent</p>
      </div>
    </div>
  );
}
