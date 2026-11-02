import { Suspense } from "react";
import { getServicesByCategory } from "@/lib/services";
import ServicesBookingExperience from "@/components/ServicesBookingExperience";

export default async function ServicesPage() {
  const [cleaningServices, movingServices, electricalServices] =
    await Promise.all([
      getServicesByCategory("cleaning"),
      getServicesByCategory("moving"),
      getServicesByCategory("electrical"),
    ]);

  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#061F35]">
          <p className="text-sm font-medium text-white">
            Loading HomeServe services...
          </p>
        </main>
      }
    >
      <ServicesBookingExperience
        cleaningServices={cleaningServices}
        movingServices={movingServices}
        electricalServices={electricalServices}
      />
    </Suspense>
  );
}