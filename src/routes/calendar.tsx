import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Calendar } from '../components/Calendar/Calendar';
import '../components/Calendar/Calendar.css';
import type { EventInput } from '@fullcalendar/core';
import { api } from '../lib/api';

export const Route = createFileRoute('/calendar')({
  component: CalendarPage,
});

function CalendarPage() {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // API expects 1-12
        const stored = localStorage.getItem('currentUser');
        const user = stored ? JSON.parse(stored) as { userId: number } : null;
        const data = await api.getMonthlySchedule({ year, month, userId: user?.userId });

        const mapped: EventInput[] = data.map((item) => {
          const type = item.workMode === 0 ? 'remote' : item.workMode === 1 ? 'office' : 'off';
          const title = type === 'remote' ? 'Home Office' : type === 'office' ? 'Presencial' : 'Folga';
          return {
            title,
            start: item.date.split('T')[0],
            extendedProps: { type, userId: item.userId, username: item.username },
          };
        });
        setEvents(mapped);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Erro ao carregar agenda';
        setError(message);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_30%_20%,#1f2330_0%,#12151d_70%)] text-slate-100 antialiased p-6">
      <div className="h-full w-full max-w-[1400px] mx-auto rounded-lg bg-white/5 border border-white/10 shadow-sm backdrop-blur-sm px-6 py-6">
        {error && (
          <div className="mb-4 rounded-md bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-300">{error}</div>
        )}
        {loading ? (
          <div className="text-sm text-slate-300">Carregando agenda...</div>
        ) : (
          <Calendar
            events={events}
            onDateSelect={(date) => {
              console.log('Selected date:', date);
            }}
            onEventClick={(event) => {
              console.log('Clicked event:', event);
            }}
          />
        )}
      </div>
    </div>
  );
}