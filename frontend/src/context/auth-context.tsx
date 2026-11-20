"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface UserProfile {
  id: string;
  firebase_uid: string;
  email: string;
  full_name: string;
  role: "DOCTOR" | "CLINIC_ADMIN" | "CLINIC_OWNER" | "STAFF";
  is_active: boolean;
}

export interface ClinicContext {
  id: string;
  name: string;
  slug: string;
  default_language: string;
  subscription_tier: "FREE_TRIAL" | "DOCTOR_PLAN" | "CLINIC_PLAN" | "ENTERPRISE";
}

interface AuthContextType {
  user: UserProfile | null;
  clinic: ClinicContext | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string, role?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [clinic, setClinic] = useState<ClinicContext | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Restore simulated/real session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("clinicscribe_user");
    const storedClinic = localStorage.getItem("clinicscribe_clinic");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        if (storedClinic) {
          setClinic(JSON.parse(storedClinic));
        }
      } catch (e) {
        console.error("Failed to restore session:", e);
      }
    } else {
      // Default active demo doctor
      const demoUser: UserProfile = {
        id: "usr-demo-001",
        firebase_uid: "dev_doctor_uid_sarah",
        email: "dr.sarah@cityhealth.com",
        full_name: "Dr. Sarah",
        role: "DOCTOR",
        is_active: true,
      };
      const demoClinic: ClinicContext = {
        id: "cln-demo-001",
        name: "City Health Clinic",
        slug: "city-health-clinic",
        default_language: "Tamil, English, Hindi",
        subscription_tier: "DOCTOR_PLAN",
      };
      setUser(demoUser);
      setClinic(demoClinic);
      localStorage.setItem("clinicscribe_user", JSON.stringify(demoUser));
      localStorage.setItem("clinicscribe_clinic", JSON.stringify(demoClinic));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    try {
      // Simulate/Authenticate
      const authedUser: UserProfile = {
        id: "usr-" + Math.random().toString(36).substr(2, 6),
        firebase_uid: "fb-" + Math.random().toString(36).substr(2, 9),
        email,
        full_name: email.split("@")[0].replace(".", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        role: "DOCTOR",
        is_active: true,
      };
      setUser(authedUser);
      localStorage.setItem("clinicscribe_user", JSON.stringify(authedUser));
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, pass: string, name: string, role: string = "DOCTOR") => {
    setLoading(true);
    try {
      const newUser: UserProfile = {
        id: "usr-" + Math.random().toString(36).substr(2, 6),
        firebase_uid: "fb-" + Math.random().toString(36).substr(2, 9),
        email,
        full_name: name,
        role: role as any,
        is_active: true,
      };
      setUser(newUser);
      localStorage.setItem("clinicscribe_user", JSON.stringify(newUser));
      // Route new user to Onboarding wizard
      router.push("/onboarding");
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const googleUser: UserProfile = {
        id: "usr-google-001",
        firebase_uid: "google_oauth_uid_demo",
        email: "dr.sarah.gsuite@gmail.com",
        full_name: "Dr. Sarah Sundaram",
        role: "DOCTOR",
        is_active: true,
      };
      setUser(googleUser);
      localStorage.setItem("clinicscribe_user", JSON.stringify(googleUser));
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async (data: any) => {
    setLoading(true);
    try {
      const createdClinic: ClinicContext = {
        id: "cln-" + Math.random().toString(36).substr(2, 6),
        name: data.clinic_name,
        slug: data.clinic_name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        default_language: data.preferred_languages,
        subscription_tier: data.subscription_tier || "FREE_TRIAL",
      };

      if (user) {
        const updatedUser = { ...user, full_name: data.doctor_full_name };
        setUser(updatedUser);
        localStorage.setItem("clinicscribe_user", JSON.stringify(updatedUser));
      }

      setClinic(createdClinic);
      localStorage.setItem("clinicscribe_clinic", JSON.stringify(createdClinic));
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setClinic(null);
    localStorage.removeItem("clinicscribe_user");
    localStorage.removeItem("clinicscribe_clinic");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        clinic,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

