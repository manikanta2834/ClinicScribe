"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Settings,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Topbar: React.FC = () => {
  const { user, clinic, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // In-app notifications list state
  const [notifications, setNotifications] = useState([
    {
      id: "n-1",
      title: "Consultation Awaiting Review",
      message: "Priya Sundaram (Acute Bronchitis) note has been transcribed by Gemini AI and is awaiting doctor approval.",
      time: "10 mins ago",
      type: "pending",
      is_read: false,
      url: "/consultations/cs-1092",
    },
    {
      id: "n-2",
      title: "Prescription PDF Verified",
      message: "Official prescription signed and archived with tamper-evident digital seal CS-SIG-92841.",
      time: "45 mins ago",
      type: "approved",
      is_read: false,
      url: "/consultations/cs-1092",
    },
    {
      id: "n-3",
      title: "Monthly Quota Update",
      message: "Your clinic has processed 18 of 50 monthly consultations (36% used). All AI models active.",
      time: "2 hours ago",
      type: "quota",
      is_read: true,
      url: "/settings",
    },
    {
      id: "n-4",
      title: "Multilingual AI Update",
      message: "Gemini AI Scribe v1.2.0-clinical-safety is active with Tamil, Hindi, and Tanglish comprehension.",
      time: "1 day ago",
      type: "system",
      is_read: true,
      url: "/settings",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
  };

  const doctorName = user?.full_name || "Dr. Sarah";
  const clinicName = clinic?.name || "City Health Clinic";
  const initials = doctorName
    .replace("Dr. ", "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-20 px-8 flex items-center justify-between relative z-30">
      {/* Title & Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-evergreen">
          Dashboard
        </h1>
        <p className="text-xs text-brand-slate font-medium">
          Welcome, {doctorName} <span className="opacity-60">({clinicName})</span>
        </p>
      </div>

      {/* Center Search Bar */}
      <div className="relative w-80 md:w-96">
        <Search className="w-4 h-4 text-brand-slate absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search patients, consultations, or notes..."
          className="w-full pl-11 pr-4 py-2 text-xs glass-input text-brand-evergreen placeholder:text-brand-slate/60 shadow-sm"
        />
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell with Dropdown Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setDropdownOpen(false);
            }}
            aria-label="Notifications"
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-brand-oceanTeal/20 flex items-center justify-center text-brand-evergreen relative shadow-sm transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-brand-mint absolute top-2 right-2 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 p-3 rounded-2xl bg-white border border-brand-oceanTeal/25 shadow-2xl space-y-2 text-xs z-50">
              <div className="flex items-center justify-between pb-2 border-b border-brand-seafoam/30">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-dark-evergreen">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-brand-mint text-white text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-deep-teal hover:underline font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {notifications.map((notif) => (
                  <Link
                    key={notif.id}
                    href={notif.url}
                    onClick={() => setNotifOpen(false)}
                    className={`block p-2.5 rounded-xl border transition-all ${
                      notif.is_read
                        ? "bg-white/60 border-brand-seafoam/20 opacity-80"
                        : "bg-pale-mist/50 border-ocean-teal/30 shadow-xs"
                    } hover:bg-pale-mist`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="font-semibold text-dark-evergreen text-xs">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-muted-slate whitespace-nowrap">
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-slate leading-relaxed">
                      {notif.message}
                    </p>
                  </Link>
                ))}
              </div>

              <div className="pt-2 border-t border-brand-seafoam/30 text-center">
                <Link
                  href="/settings"
                  onClick={() => setNotifOpen(false)}
                  className="text-[11px] text-deep-teal hover:underline font-medium inline-flex items-center gap-1"
                >
                  <Settings className="w-3 h-3" /> View Notification & Quota Settings
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill with Dropdown */}
        <div className="relative">
          <div
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 pl-2 py-1 pr-3 rounded-full bg-white/80 border border-brand-oceanTeal/20 shadow-sm cursor-pointer hover:bg-white transition-all select-none"
          >
            <div className="w-8 h-8 rounded-full bg-brand-oceanTeal/30 text-brand-evergreen font-bold text-xs flex items-center justify-center border border-brand-oceanTeal/40">
              {initials || "DS"}
            </div>
            <span className="text-xs font-semibold text-brand-evergreen">
              {doctorName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-brand-slate" />
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-white border border-brand-oceanTeal/20 shadow-2xl space-y-1 text-xs z-50">
              <div className="p-2.5 border-b border-brand-seafoam/30">
                <p className="font-bold text-brand-evergreen">{doctorName}</p>
                <p className="text-[11px] text-brand-slate truncate">
                  {user?.email || "dr.sarah@clinicscribe.dev"}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-brand-seafoam text-brand-evergreen text-[10px] font-bold">
                  {user?.role || "DOCTOR"}
                </span>
              </div>

              <div className="p-1 space-y-1">
                <Link
                  href="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-dark-evergreen hover:bg-pale-mist rounded-xl font-medium transition-colors cursor-pointer text-left"
                >
                  <Settings className="w-4 h-4 text-deep-teal" />
                  <span>Clinic & Team Settings</span>
                </Link>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-medium transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
