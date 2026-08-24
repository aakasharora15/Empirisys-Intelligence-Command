import { getKnowledge } from '@/lib/db';
import { AssistantClient } from './AssistantClient';

export const dynamic = 'force-dynamic';

export default async function AssistantPage() {
  const knowledgeBase = await getKnowledge();

  return (
    <AssistantClient 
      initialKnowledge={knowledgeBase}
    />
  );
}
