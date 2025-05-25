import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";

export default function WebTerminal() {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const term = useRef<Terminal | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && terminalRef.current) {
      term.current = new Terminal();
      term.current.open(terminalRef.current);
      term.current.write("Welcome to CodeOrbit Terminal!\r\n");

      return () => {
        term.current?.dispose();
      };
    }
  }, [mounted]);

  return (
    <div
      ref={terminalRef}
      style={{
        height: "200px",
        width: "100%",
        backgroundColor: "black",
        marginTop: "20px",
      }}
    />
  );
}
