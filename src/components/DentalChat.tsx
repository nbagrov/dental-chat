'use client';
import React, { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Message {
  type: 'user' | 'bot' | 'error';
  content: string;
}

const DentalChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([{
    type: 'bot',
    content: 'Здравствуйте! 🦷 Я стоматологический ассистент. Задайте мне вопрос о стоматологии, и я постараюсь помочь. Помните, что мои ответы носят информационный характер и не заменяют консультацию врача.'
  }]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          systemPrompt: SYSTEM_PROMPT
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        type: 'bot',
        content: data.content[0].text
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Произошла ошибка при получении ответа. Пожалуйста, попробуйте позже.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Остальной код компонента остается без изменений
  // ...
};

export default DentalChat;