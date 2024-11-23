import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CallContext } from '@/context/CallContext';
import { Device } from "@twilio/voice-sdk";
import axios from "axios";
import { PropsWithChildren, useEffect, useRef, useState } from "react";

export default function CallProvider({ children }: PropsWithChildren) {
  const [callingToken, setCallingToken] = useState('');
  const [incoming, setIncoming] = useState(false);
  const [activeConnection, setActiveConnection] = useState<any>(null);
  const device = useRef<Device | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      console.log('[get token]');
      try {
        const response = await axios.get('/api/token');
        console.log(response.data);
        setCallingToken(response.data.token);

        device.current = new Device(response.data.token);
        device.current.on('registered', () => {
          console.log('[device registered successfully]');
        });
        device.current.on('connect', (conn: any) => {
          setActiveConnection(conn);
          console.log('[successfully established call]');
        });
        device.current.on('error', (twilioError: any) => {
          console.error('[an error has occurred]', twilioError);
        });
        device.current.on('incoming', (conn: any) => {
          console.log('[incoming call]', conn);
          setIncoming(true);
          setActiveConnection(conn);
        });

        await device.current.register();
      } catch (error) {
        console.error('[error fetching token]', error);
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
    <CallContext.Provider value={{ device, callingToken, activeConnection, setActiveConnection, incoming, setIncoming }}>
      {children}
      <Dialog open={incoming || activeConnection} onOpenChange={setIncoming}>
        <DialogContent>
          <DialogTitle>Incoming Call From {activeConnection?.parameters.From ?? "???"}</DialogTitle>
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
    </CallContext.Provider>
  );
}
