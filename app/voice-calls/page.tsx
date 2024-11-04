"use client"

import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
// import Link from "next/link";
// import { Device } from "@twilio/voice-sdk";
import { toast } from "sonner";
import { MyContext } from "../myContext";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;

export default function Messages() {
  const [page] = useState(0);
  const [calls, setCalls] = useState<any>([]);
  const [isCallOpen, setIsCallOpen] = useState<boolean>(false);
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [callInstance, setCallInstance] = useState<any>(null);
  const [activeMessage, setActiveMessage] = useState<any>();
  const [open, setOpen] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  
  const { device, callingToken, setActiveConnection } = useContext(MyContext);

  useEffect(() => {
    axios.get("/api/calls/list", { params: { page } })
      .then(({ data }) => setCalls(data?.instances));
  }, [page]);

  const handleCall = async () => {
    // const response = await axios.get('http://localhost:80/api/test-voice');
    // console.log(response);
    if (!device.current || callingToken === '') {
      console.log('Device not initialized or invalid token');
      return;
    }

    try {
      const params = { To: phoneNumber };
      const call = await device.current.connect({ params });

      setCallInstance(call)

      call.on('accept', () => {
        toast.success("Call accpeted...");
        console.log("Call accpeted...");
        setIsCalling(true)
      });
      call.on('cancel', () => {
        toast.info("Call canceled...")
        console.log('Call canceled');
      });
      call.on('disconnect', () => {
        console.log({ call });
        toast.info("Call disconnected...");
        console.log('Call disconnected');
        setActiveConnection(null);
        setIsCalling(false);  // Reset calling status
        setCallInstance(null); // Clear the call instance
        setIsCallOpen(false);
      });
    } catch (error) {
      toast.error(`Error connecting call: ${error}`);
      console.error('Error connecting call:', error);
    }
  };

  const handleDisconnect = () => {
    if (callInstance) {
      callInstance.disconnect(); // Disconnect the call
      setIsCalling(false);       // Update the calling state
      setCallInstance(null);     // Clear the call instance
    }
  };

  // const acceptCall = () => {
  //   if (activeConnection) {
  //     activeConnection.accept();
  //     setIncoming(false);
  //   }
  // }

  // const rejectCall = () => {
  //   if (activeConnection) {
  //     activeConnection.reject();
  //     setIncoming(false);
  //     setActiveConnection(null);
  //   }
  // }

  // const disconnectCall = () => {
  //   if (activeConnection) {
  //     activeConnection.disconnect();
  //     setActiveConnection(null);
  //   }
  // }

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-semibold text-xl">Voice Calls</h1>
        <Button className="rounded-full" variant={"ghost"} onClick={() => setIsCallOpen(true)}>
          New Call +
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Direction</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls?.map((item: any, index: number) => (
            <TableRow key={index} onClick={() => {
              setActiveMessage(item);
              setOpen(true);
            }}>
              <TableCell>{new Date(item.startTime).toLocaleString()}</TableCell>
              <TableCell>{item.from}</TableCell>
              <TableCell>{item.to}</TableCell>
              <TableCell>{upperFirst(item.status)}</TableCell>
              <TableCell>{item.direction}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Call Detail</DialogTitle>
          <Label>From: {activeMessage?.from}</Label>
          <Label>To: {activeMessage?.to}</Label>
          <Label>Status: {activeMessage?.status}</Label>
        </DialogContent>
      </Dialog>
      <Dialog open={isCallOpen} onOpenChange={setIsCallOpen}>
        <DialogContent>
          <DialogTitle>Make a call</DialogTitle>
          <div className="flex items-center justify-center gap-5">
          <Label>To:</Label> <Input value={phoneNumber} onChange={(v) => setPhoneNumber(v.target.value)}></Input>
          </div>
          <div className="flex items-center justify-center gap-10 px-10">
          { isCalling ? <Button onClick={handleDisconnect}>Disconnect</Button> : <Button onClick={handleCall}>Call</Button> }
          {/* {activeConnection && !incoming && <Button onClick={disconnectCall}>Disconnect</Button>} */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}