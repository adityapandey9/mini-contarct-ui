import { addOrUpdateContract, removeContract } from "@/states/contract";
import { useEffect, useRef, useState } from "react";

const WSS_ORIGIN = "wss://mini-contract-api.fly.dev";

export function useWebSocket(url: string = WSS_ORIGIN) {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const jsonData = JSON.parse(event.data);
        if (
          jsonData?.["type"] === "deleted" &&
          jsonData?.["contract"]?.["id"]
        ) {
          removeContract(jsonData?.["contract"]?.["id"]);
          return;
        }
        addOrUpdateContract(jsonData?.["contract"]);
      } catch (e) {}
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("🔌 WebSocket closed");
      setIsConnected(false);
    };

    // 🧹 Clean up on unmount
    return () => {
      ws.close();
    };
  }, [url]);

  return {
    isConnected,
  };
}
