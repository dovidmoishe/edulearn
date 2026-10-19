import SurveyPage from "../../../../components/Survey/SurveyPage";

interface SurveySlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function SurveySlugPage({ params }: SurveySlugPageProps) {
  const { slug } = await params;
  return <SurveyPage slug={slug} />;
}
