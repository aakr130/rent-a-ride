import React, { Suspense } from "react";
import ConfirmInner from "./ConfirmInner";

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<p>Loading confirmation...</p>}>
      <ConfirmInner />
    </Suspense>
  );
}
