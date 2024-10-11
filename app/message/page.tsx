"use client"

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import EmojiPicker from 'emoji-picker-react';
import { ChevronDown, CircleX, ImageIcon, LaughIcon, Paperclip, PaperclipIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;

export default function ComposeMessage() {
  const [time, setTime] = useState(true); // true - now, false - later
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<FileList>();
  const [previewURL, setPreviewURL] = useState<string>();
  const [day, setDay] = useState<Date>();

  useEffect(() => {
    axios.get("/phone-numbers").then(({ data }) => {
      setPhoneNumbers(data);
    });
  }, []);

  useEffect(() => {
    if (files?.length && files[0].type.startsWith("image/")) {
      setPreviewURL(URL.createObjectURL(files[0]));
    } else {
      setPreviewURL(undefined);
    }
  }, [files]);

  const messageCount = useMemo(() => Math.ceil(message.length / 160) + 2 * (files?.length || 0), [message, files]);

  return (
    <div>
      <div className="mb-10">
        <p className="font-bold mb-6">Choose What Number to Send From</p>
        <p className="text-sm text-gray-500 mb-2">Select Phone Number</p>
        <Select>
          <SelectTrigger className="w-full h-10">
            <SelectValue placeholder="Select phone number" />
          </SelectTrigger>
          <SelectContent>
            {phoneNumbers.map(item => (
              <SelectItem value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mb-10">
        <p className="font-bold mb-6">Choose Who to Send To</p>
        <p className="text-sm text-gray-500 mb-2">Contacts</p>
        <Input type="text" defaultValue="+" />
      </div>
      <div className="mb-5">
        <p className="font-bold mb-6">Compose Your Message</p>
        <p className="text-sm text-gray-500 mb-2">Your Message</p>
        <div className="rounded-md w-full border-2 p-0">
          <div className="p-2">
            {files?.length && (
              previewURL ? (
                <div className="relative inline-block p-2">
                  <Image className="h-[60px] w-[100px] object-cover" src={previewURL} width="100" height="60" alt="" />
                  <CircleX className="absolute rounded-full transition right-1 top-1 size-4 text-red-600 bg-white cursor-pointer hover:bg-red-200"
                    onClick={() => setFiles(undefined)}
                  />
                </div>
              ) : (
                <div className="inline-block">
                  <PaperclipIcon className="inline mr-1" size={14} />
                  <span className="text-sm font-semibold mr-1">{files[0]?.name}</span>
                  <CircleX className="inline rounded-full transition right-1 top-1 size-4 text-red-600 bg-white cursor-pointer hover:bg-red-200"
                    onClick={() => setFiles(undefined)}
                  />
                </div>
              )
            )}
          </div>
          <textarea className="border-none focus:outline-none min-h-16 w-full px-3 pb-1 pt-0 -mb-2"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-sm">
            Characters: <span className="font-semibold">{message.length}</span>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <span className="font-semibold">{messageCount}</span> message(s)
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="link" className="p-0 h-4">
                Templates
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Status Bar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mb-20">
        <Popover>
          <PopoverTrigger asChild>
            <Label className="h-4 text-blue-500 px-2 inline-block cursor-pointer">
              <LaughIcon size={16} className="mr-1 inline-block" />
              Emojis
            </Label>
          </PopoverTrigger>
          <PopoverContent className="p-0 border-none">
            <EmojiPicker
              onEmojiClick={(emoji) => {
                setMessage(message => message + emoji.emoji);
              }}
            />
          </PopoverContent>
        </Popover>
        <Label htmlFor="upload-photo" className="h-4 text-blue-500 px-2 inline-block cursor-pointer">
          <input id="upload-photo" className="hidden" type="file" accept="image/*" onChange={(e) => {
            e.target.files && setFiles(e.target.files);
          }} />
          <ImageIcon size={16} className="mr-1 inline-block" />
          Photo
        </Label>
        <Label htmlFor="upload-file" className="h-4 text-blue-500 px-2 inline-block cursor-pointer">
          <input id="upload-file" className="hidden" type="file" onChange={(e) => {
            e.target.files && setFiles(e.target.files);
          }} />
          <Paperclip size={16} className="mr-1 inline-block" />
          File
        </Label>
      </div>
      <div className="mb-20">
        <p className="font-bold mb-10">Choose When to Send</p>
        <div className="flex mb-5 gap-5">
          <div
            className={cn(
              "w-1/2 border-2 rounded-lg py-2 px-4 cursor-pointer transition-all",
              time ? "border-teal-400 bg-teal-100" : ""
            )}
            onClick={() => setTime(true)}
          >
            <input className="accent-teal-700" type="radio" name="when" checked={time} /> Now
          </div>
          <div
            className={cn(
              "w-1/2 border-2 rounded-lg py-2 px-4 cursor-pointer transition-all",
              !time ? "border-teal-400 bg-teal-100" : ""
            )}
            onClick={() => setTime(false)}
          >
            <input className="accent-teal-700" type="radio" name="when" checked={!time} /> Later
          </div>
        </div>
        <div className="flex gap-5 w-full">
          <div className="w-1/2">
            <p className="text-gray-500">Choose date and time</p>
            <Popover>
              <PopoverTrigger className="w-full">
                <input className="border-2 rounded-md h-10 w-full pl-3" type="text" value={day?.toDateString()} />
              </PopoverTrigger>
              <PopoverContent className="w-full p-1">
                <Calendar
                  mode="single"
                  className="rounded-md w-full"
                  onDayClick={(day) => setDay(day)}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="w-1/2">
            <p className="text-gray-500">Time</p>
            <div className="flex gap-2">
              <Select value="09">
                <SelectTrigger className="w-full h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0")).map(item => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value="00">
                <SelectTrigger className="w-full h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map(item => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value="AM">
                <SelectTrigger className="w-full h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border-2 p-5 px-10 flex items-center justify-between bg-gray-100">
        <p className="text-gray-500">
          You will use <span className="text-black font-semibold">{messageCount}</span> messages
        </p>
        <div className="">
          <Button className="rounded-full mr-2" variant={"ghost"}>Cancel</Button>
          <Button className="rounded-full bg-[#6FD0E2]">SEND</Button>
        </div>
      </div>
    </div>
  );
}
