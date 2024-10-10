"use client"

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { ChevronDown, ImageIcon, ImagePlayIcon, LaughIcon, Paperclip } from "lucide-react";
import { useEffect, useState } from "react";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;

export default function HomePage() {
  const [time, setTime] = useState(true);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("/phone-numbers").then(({ data }) => {
      setPhoneNumbers(data);
    });
  }, []);

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
      <div>
        <p className="font-bold mb-6">Compose Your Message</p>
        <p className="text-sm text-gray-500 mb-2">Your Message</p>
        <div className="rounded-md w-full border-2 p-0">
          <div></div>
          <textarea className="border-none focus:outline-none w-full px-3 py-1 -mb-2"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-500 text-sm">
            Characters: <span className="font-semibold">128</span>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <span className="font-semibold">1</span> message
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
      <div className="mt-5">
        {/* Emoji */}
        <Popover>
          <PopoverTrigger asChild>
            <Button className="h-4 text-blue-500 px-2" variant="link">
              <LaughIcon size={16} className="mr-1" />
              Emojis
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 border-none">
            <EmojiPicker
              onEmojiClick={(emoji) => {
                setMessage(message => message + emoji.emoji);
              }}
            />
          </PopoverContent>
        </Popover>
        <Button className="h-4 text-blue-500 px-2" variant="link">
          <ImageIcon size={16} className="mr-1" />
          Photo
        </Button>
        <Button className="h-4 text-blue-500 px-2" variant="link">
          <Paperclip size={16} className="mr-1" />
          File
        </Button>
        <Button className="h-4 text-blue-500 px-2" variant="link">
          <ImagePlayIcon size={16} className="mr-1" />
          GIF
        </Button>
      </div>
      <div className="mt-20">
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
                <input className="border-2 rounded-md h-10 w-full pl-3" type="text" />
              </PopoverTrigger>
              <PopoverContent className="w-full p-1">
                <Calendar
                  mode="single"
                  className="rounded-md w-full"
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
    </div>
  );
}
