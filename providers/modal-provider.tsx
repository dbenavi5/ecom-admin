"use client";
import { useState, useEffect } from "react";

import { StoreModal } from "@/components/modals/store-modal";

export const ModalProvider = () => {
  const [isMouted, setIsMouted] = useState(false);

  useEffect(() => {
    setIsMouted(true);
  }, [setIsMouted]);

  if (!isMouted) {
    return null;
  }
  return (
    <>
      <StoreModal />
    </>
  );
};
