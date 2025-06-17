import { Suspense } from "react";
import MockEsewaClient from "./MockEsewaClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading eSewa page...</div>}>
      <MockEsewaClient />
    </Suspense>
  );
}
