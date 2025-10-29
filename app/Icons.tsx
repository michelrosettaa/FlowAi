"use client";

import {
  Sun,
  Zap,
  Bot,
  Send,
  CheckCircle2,
  CalendarRange,
  MessageSquareText,
  BarChart3,
  PhoneCall,
  Mail,
  Brain,
  Target
} from "lucide-react";

const gradient = "bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent";

export const IcSun = (props: any) => (
  <Sun className={`${gradient} drop-shadow-sm`} strokeWidth={1.6} {...props} />
);

export const IcZap = (props: any) => (
  <Zap className={`${gradient} drop-shadow-sm`} strokeWidth={1.6} {...props} />
);

export const IcMentor = (props: any) => (
  <Bot className={`${gradient} drop-shadow-sm`} strokeWidth={1.6} {...props} />
);

export const IcSend = (props: any) => (
  <Send className={`${gradient} drop-shadow-sm`} strokeWidth={1.6} {...props} />
);

export const IcCheck = (props: any) => (
  <CheckCircle2 className="text-green-500 drop-shadow-sm" strokeWidth={1.6} {...props} />
);

export const IcCalendar = (props: any) => (
  <CalendarRange className={`${gradient} drop-shadow-sm`} strokeWidth={1.6} {...props} />
);

export const IcChat = (props: any) => (
  <MessageSquareText className="text-slate-500" strokeWidth={1.6} {...props} />
);

export const IcChart = (props: any) => (
  <BarChart3 className={`${gradient} drop-shadow-sm`} strokeWidth={1.6} {...props} />
);

export const IcCall = (props: any) => (
  <PhoneCall className={`${gradient} drop-shadow-sm`} strokeWidth={1.6} {...props} />
);

export const IcMail = (props: any) => (
  <Mail className={`${gradient} drop-shadow-sm`} strokeWidth={1.6} {...props} />
);

export const IcBrain = (props: any) => (
  <Brain className={`${gradient} drop-shadow-sm`} strokeWidth={1.6} {...props} />
);

export const IcTarget = (props: any) => (
  <Target className={`${gradient} drop-shadow-sm`} strokeWidth={1.6} {...props} />
);
