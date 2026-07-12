import { useMemo } from 'react'
import { useTheme } from '@/hooks/useTheme'

export const CHART_COLORS = {
  brand: '#1a73f5',
  brandSoft: '#59b4ff',
  emerald: '#059669',
  amber: '#d97706',
  rose: '#e11d48',
  violet: '#7c3aed',
  slate: '#64748b',
  sky: '#0284c8',
} as const

export const STATUS_CHART_COLORS: Record<string, string> = {
  paid: CHART_COLORS.emerald,
  partially_paid: CHART_COLORS.amber,
  sent: CHART_COLORS.sky,
  overdue: CHART_COLORS.rose,
  draft: CHART_COLORS.slate,
  cancelled: '#94a3b8',
  void: CHART_COLORS.amber,
}

export function useChartTheme() {
  const { resolvedTheme } = useTheme()

  return useMemo(() => {
    const isDark = resolvedTheme === 'dark'
    return {
      isDark,
      grid: isDark ? '#1e293b' : '#e2e8f0',
      axis: isDark ? '#94a3b8' : '#64748b',
      tooltipBg: isDark ? '#0f172a' : '#ffffff',
      tooltipBorder: isDark ? '#334155' : '#e2e8f0',
      tooltipText: isDark ? '#f8fafc' : '#0f172a',
      cursor: isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(15, 23, 42, 0.04)',
    }
  }, [resolvedTheme])
}
