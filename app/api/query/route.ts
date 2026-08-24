import { NextResponse } from 'next/server';
import { addQuery } from '@/lib/db';
import { z } from 'zod';

const QuerySchema = z.object({
  question: z.string().min(1).max(5000),
  module_type: z.string().min(1).max(100),
  results_json: z.record(z.string(), z.unknown()).optional().default({})
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = QuerySchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    
    const { question, module_type, results_json } = result.data;
    await addQuery(question, module_type, results_json);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging query:', error);
    return NextResponse.json({ error: 'Failed to log query' }, { status: 500 });
  }
}
