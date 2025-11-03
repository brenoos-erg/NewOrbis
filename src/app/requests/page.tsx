import type { Metadata } from "next";

import { RequestList } from "@/components/RequestList";
import { RequestSummary } from "@/components/RequestSummary";
import { RequestWizard } from "@/components/RequestWizard";
import { listRequests } from "./actions";

export const metadata: Metadata = {
  title: "Solicitações | NewOrbis"
};

export default async function RequestsPage() {
  const requests = await listRequests();

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <RequestWizard />
        <RequestList requests={requests} />
      </div>
      <RequestSummary requests={requests} />
    </div>
  );
}