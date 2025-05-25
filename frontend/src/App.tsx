import React, { useState } from 'react';
import CodeEditor from './CodeEditor';

function App() {
  const [output, setOutput] = useState('');
  const [activeRoom, setActiveRoom] = useState('default-room');
  const [code, setCode] = useState('');

  // Properly implemented run handler
  const handleRunCode = () => {
    try {
      // Capture console output
      const originalConsoleLog = console.log;
      let capturedOutput = '';
      
      console.log = (...args) => {
        capturedOutput += args.join(' ') + '\n';
        originalConsoleLog(...args);
      };

      // Execute code safely
      try {
        new Function(code)();
        setOutput(capturedOutput || 'Code executed (no output)');
      } catch (e) {
        setOutput(`Error: ${e instanceof Error ? e.message : String(e)}`);
      }

      // Restore original console
      console.log = originalConsoleLog;
    } catch (error) {
      setOutput(`System Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      padding: '20px',
      backgroundColor: '#1e1e1e',
      color: '#d4d4d4',
      fontFamily: 'Consolas, monospace'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: 0 }}>CodeOrbit IDE</h1>
        <div>
          <span style={{ marginRight: '10px' }}>Room: {activeRoom}</span>
          <button 
            onClick={() => {
              const newRoom = prompt('Enter room name') || 'default-room';
              setActiveRoom(newRoom);
            }}
            style={{
              padding: '5px 10px',
              backgroundColor: '#007acc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Change Room
          </button>
        </div>
      </div>

      {/* Editor */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <CodeEditor 
          key={activeRoom}
          roomId={activeRoom}
          onCodeChange={setCode}
          onRunCode={handleRunCode} 
        />
      </div>

      {/* Output Console */}
      <div style={{
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#252526',
        borderRadius: '4px',
        maxHeight: '200px',
        overflow: 'auto'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '5px'
        }}>
          <strong>Output:</strong>
          <button 
            onClick={() => setOutput('')}
            style={{
              padding: '2px 5px',
              backgroundColor: 'transparent',
              color: '#d4d4d4',
              border: '1px solid #d4d4d4',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        </div>
        <pre style={{ 
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          {output || '// Execution output will appear here'}
        </pre>
      </div>
    </div>
  );
}

export default App;


