"use client";

import React, { useState } from "react";
import CalendarWeekView from "@/app/components/CalendarWeekView";
import AddEventModal from "@/app/components/AddEventModal";

export default function PlannerPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const handleEventCreated = () => {
    setRefetchTrigger(prev => prev + 1);
    setShowCreateModal(false);
  };

  return (
    <>
      <CalendarWeekView 
        onEventCreate={() => setShowCreateModal(true)} 
        refetchTrigger={refetchTrigger}
      />
      
      <AddEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onEventCreated={handleEventCreated}
      />
    </>
  );
}
