import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { platformStore } from '@/lib/store';

export async function GET() {
  try {
    const isSupabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock.supabase.co');

    if (isSupabaseConfigured) {
      const supabase = createAdminClient();

      // Parallel count queries
      const [
        { count: profilesCount },
        { count: premiumCount },
        { count: skillMembersCount },
        { count: projectsCount },
        { count: requestsCount },
        { count: hubsCount },
        { count: eventsCount },
        { count: invoicesCount },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('membership_status', 'active'),
        supabase.from('skill_network_members').select('*', { count: 'exact', head: true }).eq('is_approved', true).eq('is_active', true),
        supabase.from('projects').select('*', { count: 'exact', head: true }).in('status', ['published', 'interest_open']),
        supabase.from('project_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending_review'),
        supabase.from('hubs').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'upcoming'),
        supabase.from('invoices').select('*', { count: 'exact', head: true }).eq('payment_status', 'paid'),
      ]);

      return NextResponse.json({
        totalUsers: profilesCount || 0,
        premiumMembers: premiumCount || 0,
        skillMembers: skillMembersCount || 0,
        activeProjects: projectsCount || 0,
        pendingRequests: requestsCount || 0,
        totalHubs: hubsCount || 0,
        upcomingEvents: eventsCount || 0,
        totalInvoices: invoicesCount || 0,
        source: 'supabase',
      });
    }

    return NextResponse.json({
      totalUsers: platformStore.getProfiles().length,
      premiumMembers: 0,
      skillMembers: platformStore.getSkillMembers().length,
      activeProjects: platformStore.getProjects().length,
      pendingRequests: platformStore.getProjectRequests().length,
      totalHubs: platformStore.getHubs().length,
      upcomingEvents: platformStore.getEvents('upcoming').length,
      totalInvoices: platformStore.getInvoices().length,
      source: 'local',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch platform stats' }, { status: 500 });
  }
}
