"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { getBotReply, quickQuestions, type BotReply } from "@/lib/chatbot";
import { site } from "@/lib/site";
import { ChatIcon } from "@/components/Icons";

type Message = {
  id: number;
  from: "bot" | "visitor";
  text: string;
  link?: BotReply["link"];
  offerWhatsApp?: boolean;
};

const initialMessages: Message[] = [
  {
    id: 0,
    from: "bot",
    text: "Hi! I am the Build With Innocent assistant. Ask me anything about pricing, timelines, or what we build — or jump straight to WhatsApp for a human.",
  },
];

/**
 * Floating chat widget: instant scripted answers for common questions,
 * with a one-tap handoff to WhatsApp for everything else.
 */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const nextId = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  function send(text: string) {
    const visitorMessage: Message = { id: nextId.current++, from: "visitor", text };
    setMessages((current) => [...current, visitorMessage]);
    setInput("");
    setTyping(true);

    // Small delay so the reply feels conversational rather than jarring.
    setTimeout(() => {
      const reply = getBotReply(text);
      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          from: "bot",
          text: reply.text,
          link: reply.link,
          offerWhatsApp: reply.offerWhatsApp,
        },
      ]);
      setTyping(false);
    }, 650);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (input.trim()) send(input.trim());
  }

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? "Close chat" : "Chat with us"}
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-growth text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:bottom-6 sm:right-6"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <ChatIcon className="h-7 w-7" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          id="chat-panel"
          role="dialog"
          aria-label="Chat with Build With Innocent"
          className="fixed bottom-[5.5rem] right-4 z-[60] flex h-[70vh] max-h-[34rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-card-hover sm:bottom-24 sm:right-6"
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-primary px-5 py-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold font-display text-sm font-bold text-primary-900">
              BI
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Build With Innocent</p>
              <p className="flex items-center gap-1.5 text-xs text-primary-100">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-growth-300" />
                Instant answers, human backup
              </p>
            </div>
            <a
              href={site.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-growth px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-growth-600"
            >
              WhatsApp
            </a>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.from === "visitor" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    message.from === "visitor"
                      ? "rounded-br-md bg-primary text-white"
                      : "rounded-bl-md bg-primary-50 text-ink"
                  }`}
                >
                  <p>{message.text}</p>
                  {message.link && (
                    <Link
                      href={message.link.href}
                      onClick={() => setOpen(false)}
                      className="mt-2 block font-bold text-growth underline-offset-4 hover:underline"
                    >
                      {message.link.label} &rarr;
                    </Link>
                  )}
                  {message.offerWhatsApp && (
                    <a
                      href={site.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block rounded-lg bg-growth px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-growth-600"
                    >
                      Continue on WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-primary-50 px-4 py-3">
                  <span className="inline-flex gap-1" aria-label="Assistant is typing">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-300 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-300 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-300 [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick questions (before the visitor engages) */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => send(question)}
                  className="rounded-full border border-primary-100 px-3.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-growth hover:bg-growth-50"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-primary-50 p-3">
            <label htmlFor="chat-input" className="sr-only">
              Type your question
            </label>
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              autoComplete="off"
              className="flex-1 rounded-full border border-primary-100 px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-600 disabled:opacity-40"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
