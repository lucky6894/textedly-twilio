"use client"

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import axios from "axios";
import { upperFirst } from "lodash";
import Link from "next/link";
import { useEffect, useState } from "react";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;

export default function Messages() {
  const [page] = useState(0);
  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    axios.get("/messages", { params: { page } })
      .then(({ data }) => setMessages(data?.instances));
  }, [page]);

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-semibold text-xl">Messages</h1>
        <Button className="rounded-full" variant={"ghost"}>
          <Link href="/composer">New Message +</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages?.map((item: any) => (
            <TableRow>
              <TableCell>{new Date(item.dateSent).toLocaleString()}</TableCell>
              <TableCell>{item.from}</TableCell>
              <TableCell>{item.to}</TableCell>
              <TableCell>{upperFirst(item.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}