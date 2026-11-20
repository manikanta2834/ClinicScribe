import React from "react";
import { GlassCard } from "../ui/glass-card";
import { Clock } from "lucide-react";

export const UpcomingList: React.FC = () => {
  const events = [
    {
      title: "Team Clinical Sync",
      time: "10:00 AM - 11:00 AM",
      type: "Meeting",
    },
    {
      title: "Patient Consultation (Tamil)",
      time: "02:30 PM - 03:30 PM",
      type: "Consultation",
    },
    {
      title: "Records Audit Review",
      time: "04:00 PM - 04:30 PM",
      type: "Review",
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-brand-evergreen px-1">Upcoming</h3>
      <div className="space-y-2.5">
        {events.map((event, idx) => (
          <GlassCard
            key={idx}
            className="p-3.5 rounded-2xl hover:border-brand-oceanTeal/40 transition-all flex items-start justify-between cursor-pointer"
          >
            <div>
              <h4 className="text-xs font-bold text-brand-evergreen">
                {event.title}
              </h4>
              <div className="flex items-center gap-1.5 text-[11px] text-brand-slate mt-1">
                <Clock className="w-3 h-3 text-brand-mint" />
                <span>{event.time}</span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-brand-mist text-brand-deepTeal">
              {event.type}
            </span>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

