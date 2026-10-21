'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Search,
  Paperclip,
  CheckCheck,
  Sparkles,
  Lock,
  ArrowRight,
  User
} from 'lucide-react';
import { platformStore } from '@/lib/store';
import { Profile, Message, MessageThread } from '@/lib/types';
import { UpgradeModal } from '@/components/auth/UpgradeModal';

export default function MessagesPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [activeThread, setActiveThread] = useState<MessageThread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const loadData = () => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
          const userThreads = platformStore.getThreads(data.user.id);
          setThreads(userThreads);
          if (userThreads.length > 0 && !activeThread) {
            setActiveThread(userThreads[0]);
            setMessages(platformStore.getThreadMessages(userThreads[0].id));
          } else if (activeThread) {
            setMessages(platformStore.getThreadMessages(activeThread.id));
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeThread) {
      setMessages(platformStore.getThreadMessages(activeThread.id));
    }
  }, [activeThread]);

  const isFree = currentUser?.role === 'free_user' && currentUser.membership_status !== 'active';

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !activeThread) return;

    const recipientId = activeThread.participant_ids.find(id => id !== currentUser.id);
    if (!recipientId) return;

    setLoading(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId,
          content: newMessage.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send message.');
      }

      setNewMessage('');
      loadData();
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isFree) {
    return (
      <div className="py-16 text-center space-y-4 max-w-lg mx-auto am-card p-8 am-gold-border">
        <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-white">Direct Messaging is a Premium Feature</h2>
        <p className="text-xs text-gray-400 leading-relaxed">
          Communicate directly with verified Skill Network specialists, founders, and the Action = Matter project committee. Become a Premium member to unlock instant messaging.
        </p>
        <button
          onClick={() => setUpgradeModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl am-btn-primary text-xs font-bold shadow-lg"
        >
          <Sparkles className="w-4 h-4" /> Join the Skill Network
        </button>

        <UpgradeModal
          isOpen={upgradeModalOpen}
          onClose={() => setUpgradeModalOpen(false)}
          title="Unlock Peer & Project Messaging"
          subtitle="Direct messaging with clients, admins, and verified specialists is enabled exclusively for Skill Network members."
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-10rem)] am-card am-gold-border overflow-hidden flex flex-col md:flex-row">
      {/* Threads Sidebar */}
      <div className="w-full md:w-80 border-r border-white/10 flex flex-col bg-black/40">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400" /> Conversations
          </h2>
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-white/5">
          {threads.map((thread) => {
            const otherUserId = thread.participant_ids.find(id => id !== currentUser?.id);
            const otherUser = platformStore.getProfileById(otherUserId || '');
            const isSelected = activeThread?.id === thread.id;

            return (
              <button
                key={thread.id}
                onClick={() => setActiveThread(thread)}
                className={`w-full p-4 flex items-center gap-3.5 text-left transition-colors ${
                  isSelected ? 'bg-amber-400/10 border-l-2 border-amber-400' : 'hover:bg-white/5'
                }`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 border border-amber-400/20 shrink-0">
                  <img src={otherUser?.avatar_url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white truncate">{otherUser?.full_name}</p>
                    <span className="text-[10px] text-gray-500">Active</span>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">
                    {thread.last_message?.content || 'Started conversation'}
                  </p>
                </div>
              </button>
            );
          })}

          {threads.length === 0 && (
            <div className="p-8 text-center text-xs text-gray-500">
              No active conversations yet. Visit the People directory to start a conversation.
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col justify-between bg-[#080b10]">
        {activeThread ? (
          <>
            {/* Chat Header */}
            {(() => {
              const otherUserId = activeThread.participant_ids.find(id => id !== currentUser?.id);
              const otherUser = platformStore.getProfileById(otherUserId || '');

              return (
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-white/10 border border-amber-400/30">
                      <img src={otherUser?.avatar_url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white">{otherUser?.full_name}</h3>
                      <p className="text-[10px] text-amber-300 font-medium capitalize">{otherUser?.role.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    Realtime Connected
                  </span>
                </div>
              );
            })()}

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isMine = msg.sender_id === currentUser?.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        isMine
                          ? 'am-gold-gradient text-black font-medium rounded-br-xs shadow-md'
                          : 'bg-white/10 text-white rounded-bl-xs border border-white/10'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[9px] text-gray-500 mt-1 px-1">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Input Composer */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-black/40 flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write your message..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/50"
              />
              <button
                type="submit"
                disabled={loading || !newMessage.trim()}
                className="p-2.5 rounded-xl am-btn-primary disabled:opacity-50 transition-all hover:scale-105"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-gray-500">
            Select or start a conversation from the sidebar.
          </div>
        )}
      </div>
    </div>
  );
}
