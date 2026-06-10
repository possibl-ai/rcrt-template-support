import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClient } from '../lib/api-client';
import { useStore } from '../lib/store';
import { cn } from '../lib/utils';

const filterOptions = ['all', 'open', 'pending', 'resolved'] as const;

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { ticketFilter, setTicketFilter } = useStore();

  useEffect(() => {
    const tags: string[] = ['type:ticket'];
    if (ticketFilter !== 'all') tags.push(`status:${ticketFilter}`);

    getClient()
      .queryBreadcrumbs(tags, 100)
      .then((data: any) => {
        setTickets(Array.isArray(data) ? data : data?.breadcrumbs || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [ticketFilter]);

  const getStatus = (ticket: any): string => {
    const tag = (ticket.tags || []).find((t: string) => t.startsWith('status:'));
    return tag ? tag.replace('status:', '') : 'open';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Tickets</h2>
        <div className="flex gap-1">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setTicketFilter(f)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                ticketFilter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-2 pb-20 md:pb-4">
        {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {!loading && tickets.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No tickets found.</p>
        )}
        {tickets.map((ticket, i) => (
          <button
            key={ticket.breadcrumb_id || i}
            onClick={() => navigate(`/ticket/${ticket.breadcrumb_id}`)}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors text-left"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {ticket.title || 'Untitled Ticket'}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {ticket.created_at ? timeAgo(ticket.created_at) : ''}
              </p>
            </div>
            <StatusBadge status={getStatus(ticket)} />
          </button>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    open: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    resolved: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`shrink-0 ml-2 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-muted text-muted-foreground'}`}>
      {status}
    </span>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
