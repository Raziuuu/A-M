'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Sparkles,
  Building2,
  CheckCircle2,
  Globe,
  Radio,
  Plus
} from 'lucide-react';
import { platformStore } from '@/lib/store';
import { Event, Hub } from '@/lib/types';

export default function EventsHubsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'hubs' | 'past' | 'my'>('upcoming');
  const [events, setEvents] = useState<Event[]>([]);
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);

  const loadData = () => {
    setEvents(platformStore.getEvents(activeTab === 'my' ? 'my' : activeTab === 'past' ? 'past' : 'upcoming'));
    setHubs(platformStore.getHubs());
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleRegister = (eventId: string) => {
    platformStore.registerForEvent(eventId);
    setRegisteredEventIds([...registeredEventIds, eventId]);
    loadData();
  };

  const handleToggleHub = (hubId: string) => {
    platformStore.toggleHubMembership(hubId);
    loadData();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full am-badge-gold text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Global Community
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Events & City Hubs
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-2xl">
          Connect in person and virtually across our flagship summits, workshops, and international city chapters.
        </p>
      </div>

      {/* Top Navigation Tabs - Exactly per specification */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-1 text-xs">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'upcoming'
              ? 'am-gold-gradient text-black font-bold shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" /> Upcoming Events
        </button>

        <button
          onClick={() => setActiveTab('hubs')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'hubs'
              ? 'am-gold-gradient text-black font-bold shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> City Hubs
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'past'
              ? 'am-gold-gradient text-black font-bold shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> Past Events
        </button>

        <button
          onClick={() => setActiveTab('my')}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'my'
              ? 'am-gold-gradient text-black font-bold shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> My Events
        </button>
      </div>

      {/* Tab: Events View (Upcoming, Past, My) */}
      {activeTab !== 'hubs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const isRegistered = event.is_registered || registeredEventIds.includes(event.id);

            return (
              <div
                key={event.id}
                className="am-card overflow-hidden flex flex-col justify-between group am-gold-border"
              >
                {/* Image Banner */}
                {event.image_url && (
                  <div className="relative h-44 w-full overflow-hidden bg-black/40">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full am-badge-gold text-[10px] font-bold uppercase tracking-wider">
                        {event.event_type}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{event.date} • {event.start_time} - {event.end_time}</span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      {event.title}
                    </h3>

                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {event.topics.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-gray-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <p className="text-gray-400 text-[11px] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-500" /> {event.location}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {event.attendees_count} attending • Host: {event.host}
                      </p>
                    </div>

                    {isRegistered ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> RSVP'd
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRegister(event.id)}
                        className="px-4 py-2 rounded-xl am-btn-primary text-xs font-semibold shadow-md hover:scale-105 transition-all"
                      >
                        Attend Event
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: City & Industry Hubs */}
      {activeTab === 'hubs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hubs.map((hub) => (
            <div key={hub.id} className="am-card p-6 am-gold-border flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] text-gray-400 font-semibold uppercase">
                    {hub.type} Hub
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{hub.name}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{hub.description}</p>
                {hub.city && (
                  <p className="text-[11px] text-amber-300/80 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {hub.city}, {hub.country}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-medium">
                  <strong className="text-white">{hub.member_count}</strong> active members
                </span>
                <button
                  onClick={() => handleToggleHub(hub.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    hub.is_member
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'am-btn-primary'
                  }`}
                >
                  {hub.is_member ? 'Joined Hub' : 'Join Chapter'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {events.length === 0 && activeTab !== 'hubs' && (
        <div className="py-16 text-center space-y-3 am-card p-8">
          <Calendar className="w-10 h-10 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No events in this category</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Explore upcoming international events or join our city chapters.
          </p>
          <button
            onClick={() => setActiveTab('upcoming')}
            className="px-4 py-2 rounded-xl am-btn-secondary text-xs font-semibold"
          >
            View Upcoming Events
          </button>
        </div>
      )}
    </div>
  );
}
