import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, Typography, TextField, IconButton, List, ListItem, ListItemText } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('http://localhost:4891/v1/chat/memory')
      .then(res => res.json())
      .then(data => setMessages(data.messages || []));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    // AI 응답은 추후 연동
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 1300 }}>
      <Paper elevation={8} sx={{ maxWidth: 600, mx: 'auto', mb: 2, borderRadius: 2, p: 2 }}>
        <Typography variant="h6" align="center" gutterBottom>
          AI 세무 채팅상담
        </Typography>
        <List sx={{ maxHeight: 240, overflowY: 'auto', mb: 1 }}>
          {messages.map((msg, idx) => (
            <ListItem key={idx} sx={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <ListItemText
                primary={msg.content}
                sx={{
                  bgcolor: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  maxWidth: '80%',
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                }}
              />
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="메시지를 입력하세요..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            multiline
            maxRows={4}
          />
          <IconButton color="primary" onClick={handleSend} sx={{ alignSelf: 'flex-end' }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatUI; 