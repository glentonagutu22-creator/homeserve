import ServiceCategoryPage from "@/components/serviceCategoryPage";
import { getServicesByCategory } from "@/lib/services";

export default async function MovingPage() {
  const services =
    await getServicesByCategory("moving");

  return (
    <ServiceCategoryPage
      category="moving"
      title="Move With Confidence."
      subtitle="Safe and reliable moving services for every journey."
      description="Whether you're moving a home, office or a single item, HomeServe helps make your relocation easier, safer and more convenient."
      services={services}
      heroImage="/images/moving-brand.png/image.png"
      brandLogo="/images/moving-brand.png/image.png"
      accent="green"
    />
  );
}