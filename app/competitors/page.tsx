import { getCompetitors, getCompetitorContent, getDiscoveryLogs } from '@/lib/db';
import { scrapeHSEAndCompetitorNews } from '@/lib/liveData';
import { CompetitorsClient } from './CompetitorsClient';

export const dynamic = 'force-dynamic';

export default async function CompetitorsPage() {
  const [competitors, content, discoveryLogs, liveData] = await Promise.all([
    getCompetitors(),
    getCompetitorContent(),
    getDiscoveryLogs(),
    scrapeHSEAndCompetitorNews(),
  ]);

  const combinedContent = [...liveData.competitorContent, ...content];

  return (
    <CompetitorsClient
      initialCompetitors={competitors}
      initialContent={combinedContent}
      initialDiscoveryLogs={discoveryLogs}
    />
  );
}
