import { useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import './fullcalendar.css';
import type { EventInput } from '@fullcalendar/core';
import type { EventClickArg } from '@fullcalendar/core';

export interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: EventInput) => void;
  events?: EventInput[];
}

export function Calendar({ onDateSelect, onEventClick, events = [] }: CalendarProps) {
  const [mounted, setMounted] = useState(false);
  // local copy of events so we can simulate admin changes immediately
  const [localEvents, setLocalEvents] = useState<EventInput[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [showTypePicker, setShowTypePicker] = useState(false);
  // calendar height state: we'll adjust when changing between month/week views
  const [calendarHeight, setCalendarHeight] = useState<number | 'auto'>(720);

  // (icons are rendered via SVG components below)

  // when modal closes, reset type picker state
  useEffect(() => {
    if (!modalOpen) setShowTypePicker(false);
  }, [modalOpen]);
  // sample events to display when no events prop is provided (development/demo only)
  const sampleEvents: EventInput[] = useMemo(() => {
    const today = new Date();
    const iso = (d: Date) => d.toISOString().split('T')[0];
    const next = (n: number) => {
      const d = new Date(today);
      d.setDate(d.getDate() + n);
      return iso(d);
    };

    return [
      { title: 'Home Office', start: iso(today), extendedProps: { type: 'remote' } },
      { title: 'Presencial', start: next(2), extendedProps: { type: 'office' } },
      { title: 'Folga', start: next(4), extendedProps: { type: 'off' } },
    ];
  }, []);

  // initialize local events (ensure every event has an id)
  useEffect(() => {
    const source = (events && events.length > 0) ? events : sampleEvents;
    const withIds = source.map((ev, idx) => {
      const id = (ev as any).id ?? `${ev.start ?? ev.title}-${idx}`;
      const origTitle = ev.title as string | undefined;
      const extended = { ...(ev as any).extendedProps, _origTitle: origTitle };
      return { ...ev, id: String(id), extendedProps: extended } as EventInput;
    });
    setLocalEvents(withIds);
  }, [events, sampleEvents]);

  // derive events used by FullCalendar from localEvents so updates re-render
  const eventsWithIcons = useMemo(() => {
    return localEvents.map((ev) => ev);
  }, [localEvents]);

  // SVG icons (black & white) — simple mono icons
  const HomeIcon = ({ size = 34 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
  <path d="M3 11.5L12 4l9 7.5" stroke="#ffffff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
  <path d="M9 21V12h6v9" stroke="#ffffff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const OfficeIcon = ({ size = 34 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
  <rect x="3" y="4" width="18" height="16" rx="1" stroke="#ffffff" strokeWidth="3.6" fill="none" />
  <path d="M7 8h3M7 12h3M14 8h3M14 12h3" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const OffIcon = ({ size = 34 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
  <path d="M4 12h16" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  // render only the icon for events; we use extendedProps.type to choose which icon
  const renderEventContent = (arg: any) => {
    const t = arg.event.extendedProps?.type as string | undefined;
    const viewType = arg.view?.type as string | undefined;
    const isWeekView = viewType === 'dayGridWeek' || viewType === 'timeGridWeek' || viewType === 'timeGrid';
    const size = isWeekView ? 28 : 34;

    // unified wrapper: center content both vertically and horizontally
    const wrapperStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' };
    const title = (arg.event.extendedProps && (arg.event.extendedProps as any)._origTitle) || arg.event.title || '';

    if (t === 'remote') return <div className="fc-icon-wrapper" style={wrapperStyle} title={title}><HomeIcon size={size} /></div>;
    if (t === 'office') return <div className="fc-icon-wrapper" style={wrapperStyle} title={title}><OfficeIcon size={size} /></div>;
    if (t === 'off') return <div className="fc-icon-wrapper" style={wrapperStyle} title={title}><OffIcon size={size} /></div>;

    // fallback: small white dot
    return <div style={wrapperStyle}><svg width={12} height={12}><circle cx={6} cy={6} r={3} fill="#ffffff" /></svg></div>;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
    <div className="calendar-container h-full w-full p-4">
      <div className="mb-4 flex gap-4 items-center">
        <div className="flex items-center gap-2" title="Home Office">
          <HomeIcon size={24} />
        </div>
        <div className="flex items-center gap-2" title="Presencial">
          <OfficeIcon size={24} />
        </div>
        <div className="flex items-center gap-2" title="Folga">
          <OffIcon size={24} />
        </div>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        locale={ptBrLocale}
        initialView="dayGridMonth"
        selectable={true}
        selectMirror={true}
  // increase visible events per day in month view so single events don't collapse into "+n more"
  dayMaxEvents={5}
  dayMaxEventRows={3}
        weekends={true}
          events={eventsWithIcons}
          eventContent={renderEventContent}
        datesSet={(arg) => {
          // adjust height based on active view to avoid the week view stretching too tall
          const viewType = arg.view.type;
          if (viewType === 'dayGridMonth') {
            setCalendarHeight(720); // month: mantém altura atual
          } else if (viewType === 'dayGridWeek' || viewType === 'timeGridWeek') {
            setCalendarHeight(260); // week: diminuir altura, mantendo month igual
          } else {
            setCalendarHeight('auto');
          }
        }}
        select={(arg) => {
          onDateSelect?.(arg.start);
        }}
        eventClick={(arg) => {
          // open mini modal for the clicked event
          const id = arg.event.id ?? `${arg.event.startStr}-${arg.event.title}`;
          setActiveEventId(String(id));
          setModalOpen(true);

          // forward original event data (without icon prefix) to consumer
          const originalTitle = (arg.event.extendedProps && (arg.event.extendedProps as any)._origTitle) || arg.event.title;
          onEventClick?.({
            title: originalTitle as string | undefined,
            start: arg.event.start || undefined,
            end: arg.event.end || undefined,
            allDay: arg.event.allDay,
            extendedProps: arg.event.extendedProps as any,
          });
        }}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
        height={calendarHeight}
      />
  </div>
  {modalOpen && activeEventId && (
      <div className="fc-modal-backdrop" role="dialog" aria-modal="true">
        <div className="fc-modal">
          <h3 className="fc-modal-title">Alterar escala</h3>
          <p className="fc-modal-body">Deseja solicitar alteração de escala para este dia, ou trocar agora (admin)?</p>
          <div className="fc-modal-controls">
            {!showTypePicker ? (
              <>
                <button
                  className="fc-modal-btn fc-modal-request"
                  onClick={() => {
                    const ev = localEvents.find((e) => String(e.id) === String(activeEventId));
                    console.log('Solicitação de alteração enviada para:', ev);
                    // in a real app this would call an API; here we just close
                    setModalOpen(false);
                    setActiveEventId(null);
                  }}
                >Solicitar alteração</button>

                <button
                  className="fc-modal-btn fc-modal-admin"
                  onClick={() => {
                    // show the type picker inline
                    setShowTypePicker(true);
                  }}
                >Trocar agora (admin)</button>

                <button className="fc-modal-btn" onClick={() => { setModalOpen(false); setActiveEventId(null); }}>Cancelar</button>
              </>
            ) : (
              <>
                {/* Type picker: choose exact type */}
                <button
                  className="fc-modal-btn fc-type-btn fc-type-remote"
                  onClick={() => {
                    setLocalEvents((prev) => prev.map((e) => {
                      if (String(e.id) !== String(activeEventId)) return e;
                      const newExtended = { ...(e as any).extendedProps, type: 'remote' };
                      return { ...e, extendedProps: newExtended } as EventInput;
                    }));
                    setModalOpen(false);
                    setActiveEventId(null);
                    setShowTypePicker(false);
                  }}
                >Remoto</button>
                <button
                  className="fc-modal-btn fc-type-btn fc-type-office"
                  onClick={() => {
                    setLocalEvents((prev) => prev.map((e) => {
                      if (String(e.id) !== String(activeEventId)) return e;
                      const newExtended = { ...(e as any).extendedProps, type: 'office' };
                      return { ...e, extendedProps: newExtended } as EventInput;
                    }));
                    setModalOpen(false);
                    setActiveEventId(null);
                    setShowTypePicker(false);
                  }}
                >Presencial</button>
                <button
                  className="fc-modal-btn fc-type-btn fc-type-off"
                  onClick={() => {
                    setLocalEvents((prev) => prev.map((e) => {
                      if (String(e.id) !== String(activeEventId)) return e;
                      const newExtended = { ...(e as any).extendedProps, type: 'off' };
                      return { ...e, extendedProps: newExtended } as EventInput;
                    }));
                    setModalOpen(false);
                    setActiveEventId(null);
                    setShowTypePicker(false);
                  }}
                >Folga</button>

                <button className="fc-modal-btn" onClick={() => { setShowTypePicker(false); }}>Voltar</button>
              </>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}