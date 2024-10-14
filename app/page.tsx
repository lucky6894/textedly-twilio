"use client"

import axios from "axios";
import { useEffect, useState } from "react";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;

export default function HomePage() {
  const [statistics, setStatistics] = useState<any>();

  useEffect(() => {
    axios.get("/api/statistics").then(({data}) => {
      setStatistics(data);
    });
  }, []);

  return (
    <div>
      <div className="border-2 w-64 rounded-2xl p-4 bg-gray-200">
        <p className="font-semibold mb-2">Balance</p>
        <p className="font-bold text-lg">${statistics?.balance.amount}</p>
      </div>
    </div>
  );
}
