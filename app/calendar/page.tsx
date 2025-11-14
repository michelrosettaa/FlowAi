"use client";

import { useState } from "react";
import CalendarWeekView from "../components/CalendarWeekView";
import AddEventModal from "../components/AddEventModal";
import ReferralSection from "../components/ReferralSection";

export default function CalendarPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEventCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <CalendarWeekView 
        key={refreshKey}
        onEventCreate={() => setIsModalOpen(true)}
        readOnly={false}
      />

      <div className="pb-20">
        <ReferralSection />
      </div>

      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventCreated={handleEventCreated}
      />
    </>
  );
}
