"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { askChatbot } from "@/services/chatService";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
  intent?: string;
}

const SUGGESTIONS = [
  "Van kab aye gi?",
  "Who is my child's driver?",
  "Koi notification aayi hai?",
  "Plan ki price kya hai?",
];

const GREETING =
  "Assalam o Alaikum! I'm the VanGo Plus assistant. Ask me about pickup times, routes, drivers, alerts or your subscription.";

export function ChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "bot", text: GREETING },
  ]);

  const endRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    // The backend takes the parent id in the body because auth is still mocked.
    // Replace this with the session's user id once real auth lands.
    const parentUserId = user?.id;
    if (!parentUserId) {
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, role: "user", text: trimmed },
        {
          id: nextId.current++,
          role: "bot",
          text: "I can't read your account right now. Please sign out and sign in again.",
        },
      ]);
      setInput("");
      return;
    }

    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, role: "user", text: trimmed },
    ]);
    setInput("");
    setSending(true);

    try {
      const reply = await askChatbot(parentUserId, trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId.current++,
          role: "bot",
          text: reply.answer,
          intent: reply.intent,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId.current++,
          role: "bot",
          text: "Sorry, I couldn't reach the server. Please check your connection and try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open chat assistant"
        className="fixed bottom-24 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:scale-105 lg:bottom-8"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-5 z-50 flex h-[32rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl lg:bottom-8">
      <header className="flex items-center justify-between bg-primary px-4 py-3 text-white">
        <div>
          <p className="text-sm font-semibold">VanGo Assistant</p>
          <p className="text-xs opacity-80">Transport help, English or Roman Urdu</p>
        </div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm",
              message.role === "user"
                ? "ml-auto bg-primary text-white"
                : "bg-muted text-foreground"
            )}
          >
            {message.text}
          </div>
        ))}

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => send(suggestion)}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:bg-muted"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {sending && (
          <div className="w-16 rounded-2xl bg-muted px-3 py-2 text-sm text-muted-foreground">
            …
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void send(input);
        }}
        className="flex items-center gap-2 border-t border-border px-3 py-2"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Apna sawal likhein…"
          maxLength={500}
          className="flex-1 rounded-full border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          aria-label="Send message"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
