"use client"

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { format } from "date-fns";
import EmojiPicker from 'emoji-picker-react';
import { CalendarIcon, ChevronDown, CircleX, ImageIcon, LaughIcon, Paperclip, PaperclipIcon, PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
  .object({
    from: z.string({
      required_error: "Phone number is required"
    }),
    to: z.array(
      z.string({
        required_error: "Please input valid phone number"
      }).min(5)
    ).min(1),
    message: z.string().min(1, "Write message"),
    image: z.instanceof(File).optional(),
    file: z.instanceof(File).optional(),
    when: z.enum(["now", "later"]),
    date: z.date({
      required_error: "Select date"
    }).optional(),
    hour: z.string().optional(),
    minute: z.string().optional(),
    noon: z.string().optional()
  })
  .refine((data) => !(data.when == "later" && data.date === undefined), {
    path: ["date"],
    message: "Select date"
  });

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;

export default function ComposeMessage() {
  const [time, setTime] = useState<"now" | "later">("now");
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<FileList>();
  const [sending, setSending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      to: ["+"],
      when: "now",
      hour: "09",
      minute: "00",
      noon: "AM"
    }
  });

  const { fields, append } = useFieldArray({
    //@ts-ignore
    name: "to",
    control: form.control,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSending(true);

    const formData = new FormData();
    formData.append("from", values.from);
    formData.append("to", values.to);
    formData.append("message", values.message);
    formData.append("when", values.when);

    if (values.when == "later") {
      const date = values.date!;
      date.setHours(+values.hour! + ((values.noon! == "PM") ? 12 : 0));
      date.setMinutes(+values.minute!);
      formData.set("time", date.getTime().toString());
    }

    const file = files?.[0];
    if (file) {
      formData.append("file", file);
    }

    axios.post("/api/send-message", formData)
      .then(() => toast.success("Success"))
      .catch((err) => toast.error(err.response?.data || err.message || "Failed"))
      .finally(() => setSending(false));
  }

  useEffect(() => {
    axios.get("/api/phone-numbers").then(({ data }) => {
      setPhoneNumbers(data);
    });
  }, []);

  const messageCount = useMemo(() => Math.ceil(message.length / 160) + 2 * (files?.length || 0), [message, files]);
  const previewURL = useMemo(() => {
    if (files?.length && files[0].type.startsWith("image/")) {
      return URL.createObjectURL(files[0]);
    }
  }, [files]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-10">
          <p className="font-bold mb-6">Choose What Number to Send From</p>
          <p className="text-sm text-gray-500 mb-2">Select Phone Number</p>
          <FormField
            control={form.control}
            name="from"
            render={({ field }) => (
              <FormItem>
                <Select defaultValue={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {phoneNumbers.map(item => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mb-10">
          <p className="font-bold mb-6">Choose Who to Send To</p>
          <p className="text-sm text-gray-500 mb-2">Contacts</p>
          {fields.map((_, index) => (
            <FormField
              control={form.control}
              name={`to.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="mt-3" type="tel" defaultValue={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button className="mt-4" onClick={() => append("+")} variant={'ghost'}>
            <PlusCircleIcon height={20} />
            Append
          </Button>
        </div>
        <div className="relative mb-5">
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
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea className="resize-y !border-none !outline-none !shadow-none min-h-16 w-full px-3 pb-1 pt-0"
                      {...field}
                      onChange={(event) => {
                        setMessage(event.target.value);
                        field.onChange(event);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="absolute -bottom-5" />
                </FormItem>
              )}
            />
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
                  form.setValue("message", (form.getValues().message ?? "") + emoji.emoji);
                  form.clearErrors("message");
                }}
              />
            </PopoverContent>
          </Popover>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="h-4 text-blue-500 px-2 inline-block">
                <FormLabel className="cursor-pointer">
                  <ImageIcon size={16} className="mr-1 inline-block" />
                  Photo
                </FormLabel>
                <FormControl>
                  <Input type="file"
                    className="hidden"
                    onChange={(event) => {
                      field.onChange(event.target.files?.[0] ?? undefined);
                      setFiles(event.target.files ?? undefined);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem className="h-4 text-blue-500 px-2 inline-block">
                <FormLabel className="cursor-pointer">
                  <Paperclip size={16} className="mr-1 inline-block" />
                  File
                </FormLabel>
                <FormControl>
                  <Input type="file"
                    className="hidden"
                    onChange={(event) => {
                      field.onChange(event.target.files?.[0] ?? undefined);
                      setFiles(event.target.files ?? undefined);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="mb-20">
          <p className="font-bold mb-10">Choose When to Send</p>
          <FormField
            control={form.control}
            name="when"
            render={({ field }) => (
              <FormItem className="mb-5">
                <FormControl>
                  <RadioGroup
                    className="flex w-full"
                    onValueChange={(value) => {
                      field.onChange(value);
                      //@ts-ignore
                      setTime(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormItem className="w-full">
                      <FormLabel className={cn(
                        "flex items-center space-x-3 space-y-0 font-normal border-2 rounded-lg py-2 px-4 cursor-pointer transition-all",
                        field.value == "now" ? "border-teal-400 bg-teal-100" : ""
                      )}>
                        <FormControl className="mr-2">
                          <RadioGroupItem value="now" />
                        </FormControl>
                        Now
                      </FormLabel>
                    </FormItem>
                    <FormItem className="w-full">
                      <FormLabel className={cn(
                        "flex items-center space-x-3 space-y-0 font-normal border-2 rounded-lg py-2 px-4 cursor-pointer transition-all",
                        field.value == "later" ? "border-teal-400 bg-teal-100" : ""
                      )}>
                        <FormControl className="mr-2">
                          <RadioGroupItem value="later" />
                        </FormControl>
                        Later
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {time == "later" && (
            <div className="flex gap-5 w-full">
              <div className="w-1/2">
                <p className="text-gray-500">Choose date and time</p>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "h-10 pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-1/2">
                <p className="text-gray-500">Time</p>
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="hour"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-full h-10">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0")).map(item => (
                              <SelectItem key={item} value={item}>{item}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minute"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-full h-10">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map(item => (
                              <SelectItem key={item} value={item}>{item}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="noon"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="w-full h-10">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="PM">PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="rounded-2xl border-2 p-5 px-10 flex items-center justify-between bg-gray-100">
          <p className="text-gray-500">
            You will use <span className="text-black font-semibold">{messageCount}</span> messages
          </p>
          <div className="">
            <Button className="rounded-full mr-2" variant={"ghost"}>
              <Link href={"/messages"}>Cancel</Link>
            </Button>
            <Button type="submit" className="rounded-full bg-[#6FD0E2]" disabled={sending}>
              {sending && <LoadingSpinner className="w-4 h-4 mr-1" />}
              SEND
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
