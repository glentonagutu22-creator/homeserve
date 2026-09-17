import ServiceCategoryPage from "@/components/serviceCategoryPage";
import { getServicesByCategory } from "@/lib/services";

export default async function ElectricalPage() {
  const services =
    await getServicesByCategory("electrical");

  return (
    <ServiceCategoryPage
      category="electrical"
      title="Powering Your Home Safely."
      subtitle="Professional electrical installation, repair and inspection."
      description="From sockets and lighting to wiring, fault diagnosis and electrical repairs, HomeServe provides reliable electrical solutions for homes and businesses."
      services={services}
      heroImage="/images/electrical-brand.png/image.png"
      brandLogo="/images/electrical-brand.png/image.png"
      accent="amber"
    />
  );
}