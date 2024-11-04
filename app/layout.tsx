'use client';

import { GeistSans } from "geist/font/sans";

import "./globals.css";

import RootLayout from "@/components/admin-panel/admin-panel-layout";
import { ThemeProvider } from "@/providers/theme-provider";
import { useEffect, useRef, useState } from "react";
import { Device } from "@twilio/voice-sdk";
import { MyContext } from './myContext'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  const [callingToken, setCallingToken] = useState('');
  const [incoming, setIncoming] = useState(false);
  const [activeConnection, setActiveConnection] = useState<any>(null);
  const device = useRef<Device | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      console.log('get token');
      try {
        const response = await axios.get('/api/token');
        console.log(response.data);
        setCallingToken(response.data.token);

        device.current = new Device(response.data.token);
        device.current.on('registered', () => {
          console.log('Device registered successfully');
        });
        device.current.on('connect', (conn: any) => {
          setActiveConnection(conn);
          console.log('Successfully established call...');
        });
        device.current.on('error', (twilioError: any) => {
          console.error('An error has occurred: ', twilioError);
        });
        device.current.on('incoming', (conn: any) => {
          console.log('Incoming call...');
          setIncoming(true);
          setActiveConnection(conn);
        });

        await device.current.register();
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();

    // Cleanup function
    return () => {
      if (device.current) {
        device.current.destroy();
      }
    };
  }, []);

  const acceptCall = () => {
    if (activeConnection) {
      activeConnection.accept();
      setIncoming(false);
    }
  }

  const rejectCall = () => {
    if (activeConnection) {
      activeConnection.reject();
      setIncoming(false);
      setActiveConnection(null);
    }
  }

  const disconnectCall = () => {
    if (activeConnection) {
      activeConnection.disconnect();
      setActiveConnection(null);
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <MyContext.Provider value={{ device, callingToken, activeConnection, setActiveConnection, incoming, setIncoming }}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <RootLayout>
            {children}
            <Dialog open={incoming || activeConnection} onOpenChange={setIncoming}>
              <DialogContent>
                <DialogTitle>Incoming Call</DialogTitle>
                <div className="flex items-center justify-center gap-10 ">
                {(activeConnection && !incoming) ? (
                  <Button onClick={disconnectCall}>Disconnect</Button>
                ) : (
                  <>
                    <Button onClick={acceptCall}>Accept</Button>
                    <Button onClick={rejectCall}>Reject</Button>
                  </>
                )}
                </div>
              </DialogContent>
            </Dialog>
          </RootLayout>
        </ThemeProvider>
        </MyContext.Provider>
      </body>
    </html>
  );
}
