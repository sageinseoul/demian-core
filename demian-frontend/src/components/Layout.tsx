import React, { useState, useRef, useEffect } from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, TextField, IconButton, List, ListItem, ListItemText, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface LayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 300;

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4891/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(msg => ({
              role: msg.role === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            { role: 'user', content: userMessage }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      const data = await response.json();
      const aiMessage = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'ai', content: aiMessage }]);
    } catch (error) {
      console.error('채팅 오류:', error);
      setMessages(prev => {
        if (prev.length > 0 && prev[prev.length - 1].role === 'user') {
          return [...prev, { role: 'ai', content: '죄송합니다. 오류가 발생했습니다.' }];
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            데미안 세무
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            p: 0,
          },
        }}
      >
        <Toolbar />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', p: 2, pb: 0 }}>
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {(() => {
              // 메시지를 2개씩(질문-답변) 쌍으로 묶어서 최신순(아래→위)으로 렌더링, 쌍 내부는 user(위)-ai(아래)
              const pairs = [];
              for (let i = 0; i < messages.length; i += 2) {
                const userMsg = messages[i];
                const aiMsg = messages[i + 1];
                pairs.push(
                  <React.Fragment key={i}>
                    {userMsg && userMsg.role === 'user' && (
                      <ListItem sx={{ justifyContent: 'flex-end', p: 0 }}>
                        <ListItemText
                          primary={userMsg.content}
                          sx={{
                            bgcolor: '#e3f2fd',
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                            maxWidth: '90%',
                            textAlign: 'right',
                          }}
                        />
                      </ListItem>
                    )}
                    {aiMsg && aiMsg.role === 'ai' && (
                      <ListItem sx={{ justifyContent: 'flex-start', p: 0 }}>
                        <ListItemText
                          primary={aiMsg.content}
                          sx={{
                            bgcolor: '#f5f5f5',
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                            maxWidth: '90%',
                            textAlign: 'left',
                          }}
                        />
                      </ListItem>
                    )}
                  </React.Fragment>
                );
              }
              return pairs; // 최신 쌍이 아래(입력창 위)에 오도록 역순 제거
            })()}
            <div ref={messagesEndRef} />
          </List>
        </Box>
        <Paper elevation={3} sx={{ p: 1, borderRadius: 0, borderTop: '1px solid #eee' }}>
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
              disabled={isLoading}
            />
            <IconButton 
              color="primary" 
              onClick={handleSend} 
              sx={{ alignSelf: 'flex-end' }}
              disabled={isLoading}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 