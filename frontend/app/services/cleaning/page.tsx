import ServiceCategoryPage from "@/components/serviceCategoryPage";
import { getServicesByCategory } from "@/lib/services";

export default async function CleaningPage() {
  const services =
    await getServicesByCategory("cleaning");

  return (
    <ServiceCategoryPage
      category="cleaning"
      title="A Cleaner Home Starts Here."
      subtitle="Professional cleaning for homes and businesses."
      description="From everyday home cleaning to deep cleaning and post-construction cleanup, HomeServe helps keep your space fresh, healthy and comfortable."
      services={services}
      heroImage="/images/cleaning-brand.png/image.png"
      brandLogo="/images/cleaning-brand.png/image.png"
      accent="blue"
    />
  );
}