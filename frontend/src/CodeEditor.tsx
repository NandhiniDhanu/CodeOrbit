import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { io, Socket } from 'socket.io-client';

interface CodeEditorProps {
  roomId: string;
  onCodeChange: (code: string) => void;
  onRunCode: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ roomId, onCodeChange, onRunCode }) => {
  const editorRef = useRef<any>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const ignoreNextUpdate = useRef(false);
  const [initialCode, setInitialCode] = useState('// Start collaborating!\n// Changes will sync in real-time');

  useEffect(() => {
    const saved = localStorage.getItem(`code-${roomId}`);
    if (saved) setInitialCode(saved);
  }, [roomId]);

  useEffect(() => {
    const socketInstance = io('http://18.218.56.59:3000', {
      path: '/socket.io/',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
      socketInstance.emit('joinRoom', roomId);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Connection error:', err.message);
    });

    socketInstance.on('remoteUpdate', (newCode: string) => {
      if (!editorRef.current || ignoreNextUpdate.current) {
        ignoreNextUpdate.current = false;
        return;
      }
      const currentValue = editorRef.current.getValue();
      if (currentValue !== newCode) {
        ignoreNextUpdate.current = true;
        editorRef.current.setValue(newCode);
        onCodeChange(newCode);
        localStorage.setItem(`code-${roomId}`, newCode);
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [roomId]);

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      ignoreNextUpdate.current = true;
      onCodeChange(value);
      localStorage.setItem(`code-${roomId}`, value);
      socket?.emit('codeUpdate', { roomId, newCode: value });
    }
  };

  return (
    <div style={{
      height: '100%',
      position: 'relative',
      border: isConnected ? '2px solid #4CAF50' : '2px solid #FF5722',
      borderRadius: '6px',
      overflow: 'hidden',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    }}>
      {/* Status Badge */}
      <div style={{
        position: 'absolute',
        top: '5px',
        right: '5px',
        zIndex: 1,
        padding: '2px 8px',
        backgroundColor: isConnected ? '#4CAF50' : '#FF5722',
        color: 'white',
        borderRadius: '4px',
        fontSize: '13px',
        fontWeight: 'bold',
      }}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>

      {/* Run Code Button */}
      <div style={{
        position: 'absolute',
        top: '5px',
        left: '5px',
        zIndex: 1
      }}>
        <button
          onClick={onRunCode}
          style={{
            padding: '6px 12px',
            backgroundColor: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          ▶ Run
        </button>
      </div>

      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={initialCode}
        onChange={handleEditorChange}
        onMount={(editor) => {
          editorRef.current = editor;
          editor.focus();
        }}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: 'on',
          renderWhitespace: 'selection',
          wordWrap: 'on',
          automaticLayout: true,
        }}
        theme="vs-dark"
      />
    </div>
  );
};

export default CodeEditor;



