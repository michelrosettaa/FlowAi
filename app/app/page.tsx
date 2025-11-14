"use client";

import CalendarWeekView from "../components/CalendarWeekView";
import ReferralSection from "../components/ReferralSection";

export default function DashboardPage() {
  return (
    <>
      <CalendarWeekView readOnly={true} />
      
      <div className="pb-20">
        <ReferralSection />
      </div>
    </>
  );
}
