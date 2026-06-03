import { Suspense } from "react";
import HelpPage from "./HelpPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HelpPage />
    </Suspense>
  );
}
