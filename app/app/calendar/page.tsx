"use client";

import React, { useState } from "react";
import CalendarWeekView from "@/app/components/CalendarWeekView";
import AddEventModal from "@/app/components/AddEventModal";

export default function CalendarPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const handleEventCreated = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  return (
    <>
      <CalendarWeekView 
        onEventCreate={() => setShowCreateModal(true)} 
        key={refetchTrigger}
      />
      
      <AddEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onEventCreated={handleEventCreated}
      />
    </>
  );
}
