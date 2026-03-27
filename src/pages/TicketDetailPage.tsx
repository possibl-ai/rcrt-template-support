import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import { getClient } from '../lib/api-client';
import { cn } from '../lib/utils';

export default function TicketDetailPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      getClient().getBreadcrumb(id),
      getClient().queryBreadcrumbs({ tags: [`ticket:${id}`, 'type:message'], limit: 100 }),
    ])
      .then(([ticketData, msgData]: [any, any]) => {
        setTicket(ticketData);
        const msgs = Array.isArray(msgData) ? msgData : msgData?.breadcrumbs || [];
        setMessages(msgs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendReply = async () => {
    const text = reply.trim();
    if (!text || sending || !id) return;
    setSending(true);
    setReply('');

    try {
      const created = await getClient().createBreadcrumb({
        title: text,
        type: 'message',
        tags: [`ticket:${id}`, 'type:message'],
        content: { message: text },
      });
      setMessages((prev) => [...prev, created]);
    } catch {}
    setSending(false);
  };

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-4">
        <p className="text-sm text-muted-foreground">Ticket not found.</p>
      </div>
    );
  }

  const status = ((ticket.tags || []).find((t: string) => t.startsWith('status:')) || 'status:open').replace('status:', '');

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{ticket.title || 'Ticket'}</h2>
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium',
              status === 'open' && 'bg-emerald-100 text-emerald-700',
              status === 'pending' && 'bg-amber-100 text-amber-700',
              status === 'resolved' && 'bg-blue-100 text-blue-700'
            )}
          >
            {status}
          </span>
        </div>
        {ticket.content?.description && (
          <p className="text-sm text-muted-foreground mt-1">{ticket.content.description}</p>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3 pb-20 md:pb-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No messages yet.</p>
        )}
        {messages.map((msg, i) => {
          const isAgent = msg.created_by?.type !== 'user';
          return (
            <div key={msg.breadcrumb_id || i} className={cn('flex', isAgent ? 'justify-start' : 'justify-end')}>
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-3 text-sm',
                  isAgent ? 'bg-muted text-foreground' : 'bg-primary text-primary-foreground'
                )}
              >
                <p>{msg.content?.message || msg.title || ''}</p>
                <p className="text-[10px] opacity-60 mt-1">
                  {msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : ''}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border p-4 bg-background">
        <div className="flex gap-2">
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendReply()}
            placeholder="Type a reply..."
            disabled={sending}
            className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          />
          <button
            onClick={sendReply}
            disabled={sending || !reply.trim()}
            className="bg-primary text-primary-foreground rounded-xl px-4 py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
