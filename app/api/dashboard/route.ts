import { NextResponse } from 'next/server';
import { getCompetitors, getCompetitorContent, getQueries, getDiscoveryLogs } from '@/lib/db';

export async function GET() {
  try {
    const [competitors, contentList, queries, discoveryLogs] = await Promise.all([
      getCompetitors(),
      getCompetitorContent(),
      getQueries(),
      getDiscoveryLogs(),
    ]);

    return NextResponse.json({
      competitors,
      contentList,
      queries,
      discoveryLogs,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
