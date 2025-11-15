"use client";

import React, { useState } from "react";
import CalendarWeekView from "@/app/components/CalendarWeekView";
import AddEventModal from "@/app/components/AddEventModal";

export default function CalendarPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [initialDate, setInitialDate] = useState<string>("");
  const [initialTime, setInitialTime] = useState<string>("");

  const handleEventCreated = () => {
    setRefetchTrigger(prev => prev + 1);
    setShowCreateModal(false);
  };

  const handleOpenModal = (date?: string, time?: string) => {
    if (date) setInitialDate(date);
    if (time) setInitialTime(time);
    setShowCreateModal(true);
  };

  return (
    <>
      <CalendarWeekView 
        onEventCreate={handleOpenModal} 
        refetchTrigger={refetchTrigger}
      />
      
      <AddEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onEventCreated={handleEventCreated}
        initialDate={initialDate}
        initialTime={initialTime}
      />
    </>
  );
}
