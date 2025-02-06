'use client';
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Send } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type MessageType = {
  type: 'user' | 'bot' | 'error';
  content: string;
};

const DentalChat = () => {
  const [messages, setMessages] = useState<MessageType[]>([{
    type: 'bot',
    content: 'Здравствуйте! 🦷 Я стоматологический ассистент. Задайте мне вопрос о стоматологии, и я постараюсь помочь.'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
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

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Стоматологический Ассистент</h1>
        <p className="text-gray-600">Задайте вопрос о стоматологии</p>
      </div>

      <Alert className="mb-4 bg-blue-50">
        <AlertDescription>
          Ответы бота носят информационный характер и не заменяют консультацию врача.
        </AlertDescription>
      </Alert>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 border rounded-lg p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.type === 'error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              Печатает...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Введите ваш вопрос..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
        >
          <Send className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default DentalChat;