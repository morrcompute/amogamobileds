import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { Text } from './text';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './card';
import { Badge } from './badge';
import { Progress } from './progress';
import { useColorScheme } from '../../hooks/useColorScheme';
import {
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ArrowRight,
  Check,
  Eye,
  AlertTriangle,
  Settings,
  HardDrive,
  Layers,
  Sparkles,
} from 'lucide-react-native';

export interface StatItem {
  name?: string;
  metric?: string;
  value?: string | number;
  stat?: string | number;
  current?: string | number;
  previous?: string | number;
  difference?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | string;
  trend?: 'up' | 'down' | string;
  href?: string;
  goalsAchieved?: number;
  status?: 'within' | 'observe' | 'critical' | string;
  capacity?: number;
  allowed?: number;
  progress?: number;
  budget?: string;
  limit?: string;
  percentage?: number | string;
  percentageChange?: string;
  tickerSymbol?: string;
  chartData?: { date: string; value: number }[];
  details?: { label: string; value: string; color: string }[];
  warningMessage?: string;
  actionLabel?: string;
  color?: string;
  amount?: number;
  label?: string;
}

export interface SegmentItem {
  label: string;
  value: number;
  color: string;
}

export interface PremiumStatsProps {
  variant?: string;
  title?: string;
  description?: string;
  data?: StatItem[];
  buttonLabel?: string;
  upgradeUrl?: string;
  used?: number;
  total?: number;
  usedLabel?: string;
  totalLabel?: string;
  segments?: SegmentItem[];
  change?: string;
  value?: string | number;
  timeframe?: string;
  style?: any;
}

const colorMap: Record<string, string> = {
  emerald: '#10b981',
  green: '#22c55e',
  amber: '#f59e0b',
  yellow: '#eab308',
  rose: '#f43f5e',
  red: '#ef4444',
  blue: '#3b82f6',
  indigo: '#6366f1',
  purple: '#a855f7',
  violet: '#8b5cf6',
  orange: '#f97316',
  gray: '#64748b',
  muted: '#94a3b8',
  'bg-emerald-500': '#10b981',
  'bg-blue-500': '#3b82f6',
  'bg-indigo-500': '#6366f1',
  'bg-violet-500': '#8b5cf6',
  'bg-orange-500': '#f97316',
  'bg-amber-500': '#f59e0b',
  'bg-rose-500': '#f43f5e',
};

function parseColor(c?: string): string {
  if (!c) return '#6366f1';
  if (c.startsWith('#') || c.startsWith('rgb')) return c;
  const clean = c.replace(/^bg-/, '');
  return colorMap[c] || colorMap[clean] || '#6366f1';
}

const getFallbackData = (variant: string): StatItem[] => {
  switch (variant) {
    case '01':
    case '03':
    case '04':
      return [
        { name: 'Profit', value: '$287,654.00', change: '+8.32%', changeType: 'positive' },
        { name: 'Late payments', value: '$9,435.00', change: '-12.64%', changeType: 'negative' },
        { name: 'Pending orders', value: '$173,229.00', change: '+2.87%', changeType: 'positive' },
        { name: 'Operating costs', value: '$52,891.00', change: '-5.73%', changeType: 'negative' },
      ];
    case '02':
      return [
        { metric: 'Active Users', current: '128,456', previous: '115,789', difference: '10.9%', trend: 'up' },
        { metric: 'Conversion Rate', current: '5.32%', previous: '6.18%', difference: '0.86%', trend: 'down' },
        { metric: 'Avg. Session Duration', current: '3m 42s', previous: '3m 15s', difference: '13.8%', trend: 'up' },
      ];
    case '05':
      return [
        { name: 'Monthly recurring revenue', value: '$34.1K', change: '+6.1%', changeType: 'positive', href: '#' },
        { name: 'Users', value: '500.1K', change: '+19.2%', changeType: 'positive', href: '#' },
        { name: 'User growth', value: '11.3%', change: '-1.2%', changeType: 'negative', href: '#' },
      ];
    case '06':
      return [
        { name: 'Europe', stat: '$10,023', goalsAchieved: 3, status: 'observe', href: '#' },
        { name: 'North America', stat: '$14,092', goalsAchieved: 5, status: 'within', href: '#' },
        { name: 'Asia', stat: '$113,232', goalsAchieved: 1, status: 'critical', href: '#' },
      ];
    case '07':
      return [
        { name: 'Workspaces', capacity: 20, current: 1, allowed: 5 },
        { name: 'Dashboards', capacity: 10, current: 2, allowed: 20 },
        { name: 'Chart widgets', capacity: 30, current: 15, allowed: 50 },
        { name: 'Storage', capacity: 50, current: 25, allowed: 100 },
      ];
    case '08':
      return [
        { name: 'HR', progress: 25, budget: '$1,000', current: '$250', href: '#' },
        { name: 'Marketing', progress: 55, budget: '$1,000', current: '$550', href: '#' },
        { name: 'Finance', progress: 85, budget: '$1,000', current: '$850', href: '#' },
        { name: 'Engineering', progress: 70, budget: '$2,000', current: '$1,400', href: '#' },
      ];
    case '09':
      return [
        { name: 'Requests', stat: '996', limit: '10,000', percentage: 9.96 },
        { name: 'Credits', stat: '$672', limit: '$1,000', percentage: 67.2 },
        { name: 'Storage', stat: '1.85', limit: '10GB', percentage: 18.5 },
        { name: 'API Calls', stat: '4,328', limit: '5,000', percentage: 86.56 },
      ];
    case '10':
      return [
        {
          name: 'Alpha Corp',
          tickerSymbol: 'ACP',
          value: '$168.59',
          change: '+15.86',
          percentageChange: '+10.4%',
          changeType: 'positive',
          chartData: [
            { date: 'Nov 24', value: 142.87 },
            { date: 'Nov 25', value: 151.43 },
            { date: 'Nov 26', value: 157.28 },
            { date: 'Nov 27', value: 162.94 },
            { date: 'Nov 28', value: 148.37 },
            { date: 'Nov 29', value: 139.56 },
            { date: 'Nov 30', value: 145.83 },
            { date: 'Dec 01', value: 158.29 },
            { date: 'Dec 02', value: 168.59 },
          ],
        },
        {
          name: 'Beta Solutions',
          tickerSymbol: 'BTS',
          value: '$78.54',
          change: '+4.65',
          percentageChange: '+6.3%',
          changeType: 'positive',
          chartData: [
            { date: 'Nov 24', value: 65.32 },
            { date: 'Nov 25', value: 59.78 },
            { date: 'Nov 26', value: 64.21 },
            { date: 'Nov 27', value: 57.46 },
            { date: 'Nov 28', value: 49.82 },
            { date: 'Nov 29', value: 55.63 },
            { date: 'Nov 30', value: 61.27 },
            { date: 'Dec 01', value: 68.94 },
            { date: 'Dec 02', value: 78.54 },
          ],
        },
      ];
    case '11':
      return [
        {
          name: 'Commands',
          value: '13.8M',
          limit: 'Unlimited',
          percentage: 67,
          details: [
            { label: 'Writes', value: '11,276,493', color: 'emerald' },
            { label: 'Reads', value: '2,548,921', color: 'blue' },
          ],
          actionLabel: 'Upgrade',
        },
        {
          name: 'Bandwidth',
          value: '141 GB',
          limit: '150 GB',
          percentage: 94,
          warningMessage: 'Excessive bandwidth charges may apply.',
          actionLabel: 'Upgrade',
        },
      ];
    case '12':
      return [
        { name: 'ISR Reads', current: '358K', limit: '1M', percentage: 35.8 },
        { name: 'Edge Requests', current: '317K', limit: '1M', percentage: 31.7 },
        { name: 'Fast Origin Transfer', current: '3.07 GB', limit: '10 GB', percentage: 30.7 },
        { name: 'Speed Insights Data Points', current: '791', limit: '10K', percentage: 7.9 },
      ];
    case '14':
      return [
        { label: 'Compute', amount: 450, percentage: 52.3, color: 'emerald' },
        { label: 'Storage', amount: 285, percentage: 33.1, color: 'amber' },
        { label: 'Bandwidth', amount: 125, percentage: 14.6, color: 'rose' },
      ];
    case '15':
      return [
        { label: 'After 1 year', value: '$2,400', percentage: '+8.2%' },
        { label: 'After 5 years', value: '$14,800', percentage: '+24.6%' },
        { label: 'After 10 years', value: '$38,500', percentage: '+52.1%' },
      ];
    default:
      return [
        { name: 'Total Revenue', value: '$48,290.00', change: '+18.4%', changeType: 'positive' },
        { name: 'Active Sessions', value: '14,820', change: '+6.2%', changeType: 'positive' },
      ];
  }
};

// Circular Ring Chart using React Native SVG
function SvgRingProgress({ percentage, size = 64, strokeWidth = 5, color = '#6366f1' }: { percentage: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(148, 163, 184, 0.2)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </Svg>
      <View style={{ position: 'absolute' }}>
        <Text style={{ fontSize: 11, fontWeight: '700' }}>{Math.round(percentage)}%</Text>
      </View>
    </View>
  );
}

// Mini Sparkline Area Chart using SVG
function SvgSparkline({ data = [], isPositive = true, height = 50 }: { data?: { date: string; value: number }[]; isPositive?: boolean; height?: number }) {
  if (!data || data.length < 2) return null;

  const width = 240;
  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d.value - minVal) / range) * (height - 10) - 5;
    return `${x},${y}`;
  });

  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`;
  const strokeColor = isPositive ? '#10b981' : '#ef4444';

  return (
    <View style={{ width: '100%', height, overflow: 'hidden' }}>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <SvgLinearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
            <Stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </SvgLinearGradient>
        </Defs>
        <Path d={areaPath} fill="url(#sparkline-gradient)" />
        <Path d={linePath} fill="transparent" stroke={strokeColor} strokeWidth={2} />
      </Svg>
    </View>
  );
}

export function PremiumStats({
  variant = '01',
  title,
  description,
  data: customData,
  buttonLabel = 'Upgrade',
  upgradeUrl = '#',
  used = 8300,
  total = 15,
  usedLabel = 'MB',
  totalLabel = 'GB',
  segments,
  change = '+12.5%',
  value,
  timeframe,
  style,
}: PremiumStatsProps) {
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const normalizedVariant = variant.padStart(2, '0');
  const data = customData && customData.length > 0 ? customData : getFallbackData(normalizedVariant);

  const cardBg = isDark ? '#141E33' : '#FFFFFF';
  const cardMutedBg = isDark ? '#1E293B' : '#F8FAFC';
  const borderColor = isDark ? '#1E293B' : '#E2E8F0';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const trackBg = isDark ? '#1E293B' : '#F1F5F9';

  // Helper for trend badge
  const renderTrendBadge = (trend?: string, changeVal?: string) => {
    const isUp = trend === 'up' || trend === 'positive' || (changeVal && changeVal.startsWith('+'));
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 3,
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: 9999,
          backgroundColor: isUp ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5') : isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
          borderWidth: 1,
          borderColor: isUp ? (isDark ? 'rgba(16, 185, 129, 0.3)' : '#a7f3d0') : isDark ? 'rgba(239, 68, 68, 0.3)' : '#fecaca',
        }}
      >
        {isUp ? <TrendingUp size={11} color={isDark ? '#34d399' : '#059669'} /> : <TrendingDown size={11} color={isDark ? '#f87171' : '#dc2626'} />}
        <Text style={{ fontSize: 11, fontWeight: '700', color: isUp ? (isDark ? '#34d399' : '#059669') : isDark ? '#f87171' : '#dc2626' }}>
          {changeVal || '+0.0%'}
        </Text>
      </View>
    );
  };

  const renderTrendText = (trend?: string, changeVal?: string) => {
    const isPositive = trend === 'positive' || trend === 'up' || (changeVal && changeVal.startsWith('+'));
    return (
      <Text style={{ fontSize: 12, fontWeight: '700', color: isPositive ? '#10b981' : '#ef4444' }}>
        {changeVal || ''}
      </Text>
    );
  };

  // ---------------------------------------------------------------------------
  // VARIANT 01: Stats with Trending (Grid)
  // ---------------------------------------------------------------------------
  if (normalizedVariant === '01') {
    return (
      <View style={[{ gap: 12, width: '100%' }, style]}>
        {title && <Text style={{ fontSize: 16, fontWeight: '800', color: textPrimary }}>{title}</Text>}
        {description && <Text style={{ fontSize: 13, color: textMuted, marginTop: -4 }}>{description}</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {data.map((stat, idx) => (
            <Card key={idx} style={{ flex: 1, minWidth: 150, backgroundColor: cardBg, borderColor, borderWidth: 1, borderRadius: 16 }}>
              <CardContent style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: textMuted }}>{stat.name}</Text>
                  {renderTrendText(stat.changeType, stat.change)}
                </View>
                <Text style={{ fontSize: 22, fontWeight: '800', color: textPrimary }}>{stat.value}</Text>
              </CardContent>
            </Card>
          ))}
        </View>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT 02: Stats with Borders (Current vs Previous)
  // ---------------------------------------------------------------------------
  if (normalizedVariant === '02') {
    return (
      <View style={[{ gap: 12, width: '100%' }, style]}>
        {title && <Text style={{ fontSize: 16, fontWeight: '800', color: textPrimary }}>{title}</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {data.map((item, idx) => (
            <Card key={idx} style={{ flex: 1, minWidth: 160, backgroundColor: cardBg, borderColor, borderWidth: 1, borderRadius: 16 }}>
              <CardContent style={{ padding: 16 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: textMuted }}>{item.metric || item.name}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 }}>
                  <View>
                    <Text style={{ fontSize: 22, fontWeight: '800', color: textPrimary }}>{item.current || item.value}</Text>
                    {item.previous && <Text style={{ fontSize: 11, color: textMuted, marginTop: 2 }}>from {item.previous}</Text>}
                  </View>
                  {renderTrendBadge(item.trend, item.difference || item.change)}
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT 03: Stats with Card Layout
  // ---------------------------------------------------------------------------
  if (normalizedVariant === '03') {
    return (
      <View style={[{ gap: 12, width: '100%' }, style]}>
        {title && <Text style={{ fontSize: 16, fontWeight: '800', color: textPrimary }}>{title}</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {data.map((item, idx) => (
            <Card key={idx} style={{ flex: 1, minWidth: 150, backgroundColor: cardMutedBg, borderColor, borderWidth: 1, borderRadius: 16 }}>
              <CardContent style={{ padding: 16 }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: textMuted }}>{item.name}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 }}>
                  <Text style={{ fontSize: 24, fontWeight: '800', color: textPrimary }}>{item.stat || item.value}</Text>
                  {renderTrendText(item.changeType, item.change)}
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT 04: Stats with Badges
  // ---------------------------------------------------------------------------
  if (normalizedVariant === '04') {
    return (
      <View style={[{ gap: 12, width: '100%' }, style]}>
        {title && <Text style={{ fontSize: 16, fontWeight: '800', color: textPrimary }}>{title}</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {data.map((item, idx) => (
            <Card key={idx} style={{ flex: 1, minWidth: 150, backgroundColor: cardMutedBg, borderColor, borderWidth: 1, borderRadius: 16 }}>
              <CardContent style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: textMuted }}>{item.name}</Text>
                  {renderTrendBadge(item.changeType || 'up', item.change)}
                </View>
                <Text style={{ fontSize: 24, fontWeight: '800', color: textPrimary, marginTop: 10 }}>{item.stat || item.value}</Text>
              </CardContent>
            </Card>
          ))}
        </View>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT 05: Stats with Links
  // ---------------------------------------------------------------------------
  if (normalizedVariant === '05') {
    return (
      <View style={[{ gap: 12, width: '100%' }, style]}>
        {title && <Text style={{ fontSize: 16, fontWeight: '800', color: textPrimary }}>{title}</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {data.map((item, idx) => (
            <Card key={idx} style={{ flex: 1, minWidth: 160, backgroundColor: cardMutedBg, borderColor, borderWidth: 1, borderRadius: 16, overflow: 'hidden' }}>
              <CardContent style={{ padding: 16, paddingBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: textMuted }}>{item.name}</Text>
                  {renderTrendText(item.changeType, item.change)}
                </View>
                <Text style={{ fontSize: 24, fontWeight: '800', color: textPrimary, marginTop: 8 }}>{item.value || item.stat}</Text>
              </CardContent>
              <CardFooter style={{ paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: borderColor, backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#6366f1' }}>View more</Text>
                <ChevronRight size={12} color="#6366f1" />
              </CardFooter>
            </Card>
          ))}
        </View>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT 06: Stats with Status
  // ---------------------------------------------------------------------------
  if (normalizedVariant === '06') {
    return (
      <View style={[{ gap: 12, width: '100%' }, style]}>
        {title && <Text style={{ fontSize: 16, fontWeight: '800', color: textPrimary }}>{title}</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {data.map((item, idx) => {
            const statusColor = item.status === 'within' ? '#10b981' : item.status === 'observe' ? '#f59e0b' : '#ef4444';
            return (
              <Card key={idx} style={{ flex: 1, minWidth: 180, backgroundColor: cardMutedBg, borderColor, borderWidth: 1, borderRadius: 16 }}>
                <CardContent style={{ padding: 18 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: textMuted }}>{item.name}</Text>
                  <Text style={{ fontSize: 26, fontWeight: '800', color: textPrimary, marginTop: 4 }}>{item.stat || item.value}</Text>
                  <View style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderRadius: 10, backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : '#F1F5F9' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: statusColor, alignItems: 'center', justifyContent: 'center' }}>
                        {item.status === 'within' ? <Check size={16} color="#ffffff" /> : item.status === 'observe' ? <Eye size={16} color="#ffffff" /> : <AlertTriangle size={16} color="#ffffff" />}
                      </View>
                      <View>
                        <Text style={{ fontSize: 11, color: textMuted, fontWeight: '500' }}>{item.goalsAchieved || 0}/5 goals</Text>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: statusColor, textTransform: 'capitalize' }}>{item.status}</Text>
                      </View>
                    </View>
                    <ChevronRight size={14} color={textMuted} />
                  </View>
                </CardContent>
              </Card>
            );
          })}
        </View>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT 07: Stats with Circular Progress
  // ---------------------------------------------------------------------------
  if (normalizedVariant === '07') {
    return (
      <View style={[{ gap: 12, width: '100%' }, style]}>
        {title && <Text style={{ fontSize: 16, fontWeight: '800', color: textPrimary }}>{title}</Text>}
        {description && <Text style={{ fontSize: 13, color: textMuted, marginTop: -4 }}>{description}</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {data.map((item, idx) => {
            const pct = item.capacity || (item.current && item.allowed ? Math.round((Number(item.current) / Number(item.allowed)) * 100) : 40);
            return (
              <Card key={idx} style={{ flex: 1, minWidth: 170, backgroundColor: cardMutedBg, borderColor, borderWidth: 1, borderRadius: 16 }}>
                <CardContent style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <SvgRingProgress percentage={pct} size={54} strokeWidth={5} color="#6366f1" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: textPrimary }}>{item.name}</Text>
                    <Text style={{ fontSize: 11, color: textMuted, marginTop: 2 }}>{item.current} of {item.allowed} used</Text>
                  </View>
                </CardContent>
              </Card>
            );
          })}
        </View>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT 08: Stats with Circular Progress and Links
  // ---------------------------------------------------------------------------
  if (normalizedVariant === '08') {
    return (
      <View style={[{ gap: 12, width: '100%' }, style]}>
        {title && <Text style={{ fontSize: 16, fontWeight: '800', color: textPrimary }}>{title}</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {data.map((item, idx) => {
            const pct = item.progress || 50;
            return (
              <Card key={idx} style={{ flex: 1, minWidth: 170, backgroundColor: cardMutedBg, borderColor, borderWidth: 1, borderRadius: 16, overflow: 'hidden' }}>
                <CardContent style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <SvgRingProgress percentage={pct} size={50} strokeWidth={4} color="#6366f1" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '800', color: textPrimary }}>{item.current} / {item.budget}</Text>
                    <Text style={{ fontSize: 11, color: textMuted, marginTop: 2 }}>{item.name}</Text>
                  </View>
                </CardContent>
                <CardFooter style={{ paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1, borderTopColor: borderColor, backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 4 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#6366f1' }}>View details</Text>
                  <ArrowRight size={11} color="#6366f1" />
                </CardFooter>
              </Card>
            );
          })}
        </View>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT 09: Stats with Progress
  // ---------------------------------------------------------------------------
  if (normalizedVariant === '09') {
    return (
      <View style={[{ gap: 12, width: '100%' }, style]}>
        {title && <Text style={{ fontSize: 16, fontWeight: '800', color: textPrimary }}>{title}</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {data.map((item, idx) => {
            const pct = typeof item.percentage === 'number' ? item.percentage : parseFloat(String(item.percentage)) || 0;
            return (
              <Card key={idx} style={{ flex: 1, minWidth: 170, backgroundColor: cardMutedBg, borderColor, borderWidth: 1, borderRadius: 16 }}>
                <CardContent style={{ padding: 16 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: textMuted }}>{item.name}</Text>
                  <Text style={{ fontSize: 22, fontWeight: '800', color: textPrimary, marginTop: 4 }}>{item.stat || item.value}</Text>
                  <View style={{ height: 6, width: '100%', backgroundColor: trackBg, borderRadius: 9999, overflow: 'hidden', marginTop: 12 }}>
                    <View style={{ height: '100%', width: `${Math.min(100, Math.max(0, pct))}%`, backgroundColor: '#6366f1', borderRadius: 9999 }} />
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#6366f1' }}>{pct}%</Text>
                    <Text style={{ fontSize: 11, color: textMuted }}>of {item.limit}</Text>
                  </View>
                </CardContent>
              </Card>
            );
          })}
        </View>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT 10: Stats with Area Chart / Sparkline
  // ---------------------------------------------------------------------------
  if (normalizedVariant === '10') {
    return (
      <View style={[{ gap: 12, width: '100%' }, style]}>
        {title && <Text style={{ fontSize: 16, fontWeight: '800', color: textPrimary }}>{title}</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {data.map((item, idx) => {
            const isPos = item.changeType === 'positive' || (item.change && item.change.startsWith('+'));
            return (
              <Card key={idx} style={{ flex: 1, minWidth: 220, backgroundColor: cardMutedBg, borderColor, borderWidth: 1, borderRadius: 16, overflow: 'hidden' }}>
                <CardContent style={{ padding: 16, paddingBottom: 0 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: textPrimary }}>{item.name}</Text>
                    {item.tickerSymbol && <Text style={{ fontSize: 11, color: textMuted }}>({item.tickerSymbol})</Text>}
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 6 }}>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: isPos ? '#10b981' : '#ef4444' }}>{item.value}</Text>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: isPos ? '#10b981' : '#ef4444' }}>{item.change} ({item.percentageChange || item.change})</Text>
                  </View>
                  <SvgSparkline data={item.chartData} isPositive={Boolean(isPos)} height={50} />
                </CardContent>
              </Card>
            );
          })}
        </View>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT 11: Stats Dashboard with Progress & Action
  // ---------------------------------------------------------------------------
  if (normalizedVariant === '11') {
    return (
      <View style={[{ gap: 12, width: '100%' }, style]}>
        {title && <Text style={{ fontSize: 16, fontWeight: '800', color: textPrimary }}>{title}</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {data.map((item, idx) => {
            const pct = typeof item.percentage === 'number' ? item.percentage : 60;
            return (
              <Card key={idx} style={{ flex: 1, minWidth: 220, backgroundColor: cardMutedBg, borderColor, borderWidth: 1, borderRadius: 16, overflow: 'hidden' }}>
                <CardContent style={{ padding: 16, paddingBottom: 12 }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: textPrimary }}>{item.value}</Text>
                    <Text style={{ fontSize: 11, color: textMuted }}>/ {item.limit}</Text>
                  </View>
                  <View style={{ height: 6, width: '100%', backgroundColor: trackBg, borderRadius: 9999, overflow: 'hidden', marginTop: 10 }}>
                    <View style={{ height: '100%', width: `${pct}%`, backgroundColor: '#3b82f6', borderRadius: 9999 }} />
                  </View>
                  {item.details && (
                    <View style={{ marginTop: 12, gap: 6 }}>
                      {item.details.map((d, dIdx) => (
                        <View key={dIdx} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: parseColor(d.color) }} />
                            <Text style={{ fontSize: 11, color: textMuted }}>{d.label}</Text>
                          </View>
                          <Text style={{ fontSize: 11, fontWeight: '700', color: textPrimary }}>{d.value}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {item.warningMessage && (
                    <Text style={{ fontSize: 11, color: '#f59e0b', marginTop: 8, fontWeight: '600' }}>{item.warningMessage}</Text>
                  )}
                </CardContent>
                <CardFooter style={{ paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1, borderTopColor: borderColor, backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Settings size={12} color="#3b82f6" />
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#3b82f6' }}>{item.actionLabel || buttonLabel}</Text>
                </CardFooter>
              </Card>
            );
          })}
        </View>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT 12: Stats Usage Dashboard (Donut mini gauges list)
  // ---------------------------------------------------------------------------
  if (normalizedVariant === '12') {
    return (
      <Card style={[{ backgroundColor: cardBg, borderColor, borderWidth: 1, borderRadius: 18, width: '100%', maxWidth: 440 }, style]}>
        <CardHeader style={{ padding: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: borderColor, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <CardTitle style={{ fontSize: 14, fontWeight: '800', color: textPrimary }}>{title || 'Last 30 Days'}</CardTitle>
            {description && <CardDescription style={{ fontSize: 11, color: textMuted }}>{description}</CardDescription>}
          </View>
          <Badge variant="default">{buttonLabel}</Badge>
        </CardHeader>
        <CardContent style={{ padding: 12, gap: 6 }}>
          {data.map((item, idx) => {
            const pct = typeof item.percentage === 'number' ? item.percentage : 35;
            return (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderRadius: 10, backgroundColor: idx % 2 === 1 ? (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)') : 'transparent' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                  <SvgRingProgress percentage={pct} size={28} strokeWidth={3} color="#6366f1" />
                  <Text numberOfLines={1} style={{ fontSize: 12, fontWeight: '600', color: textPrimary, flex: 1 }}>{item.name}</Text>
                </View>
                <Text style={{ fontSize: 11, color: textMuted, fontWeight: '600' }}>
                  {item.current} / <Text style={{ color: textPrimary, fontWeight: '700' }}>{item.limit}</Text>
                </Text>
              </View>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT 13: Stats with Segmented Progress Bar
  // ---------------------------------------------------------------------------
  if (normalizedVariant === '13') {
    const activeSegments = segments || [
      { label: 'Used', value: used, color: 'indigo-500' },
      { label: 'Media', value: 2.4, color: 'blue-500' },
      { label: 'Cache', value: 1.2, color: 'violet-500' },
    ];
    const totalGB = total || 15;
    const usedGB = activeSegments.reduce((sum, s) => sum + s.value, 0);
    const freeGB = Math.max(0, totalGB - usedGB);

    return (
      <Card style={[{ backgroundColor: cardBg, borderColor, borderWidth: 1, borderRadius: 18 }, style]}>
        <CardContent style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <HardDrive size={18} color="#6366f1" />
              <Text style={{ fontSize: 14, fontWeight: '700', color: textPrimary }}>{title || 'Storage'}</Text>
            </View>
            <Text style={{ fontSize: 13, color: textMuted }}>
              <Text style={{ fontWeight: '700', color: textPrimary }}>{usedGB.toFixed(1)} {usedLabel}</Text> of {totalGB} {totalLabel}
            </Text>
          </View>
          <View style={{ height: 10, width: '100%', backgroundColor: trackBg, borderRadius: 9999, overflow: 'hidden', flexDirection: 'row', marginBottom: 16 }}>
            {activeSegments.map((segment, idx) => {
              const widthPct = (segment.value / totalGB) * 100;
              return <View key={idx} style={{ height: '100%', width: `${widthPct}%`, backgroundColor: parseColor(segment.color) }} />;
            })}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
            {activeSegments.map((segment, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: parseColor(segment.color) }} />
                <Text style={{ fontSize: 12, color: textMuted }}>
                  {segment.label}: <Text style={{ fontWeight: '600', color: textPrimary }}>{segment.value} {usedLabel}</Text>
                </Text>
              </View>
            ))}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: textMuted, opacity: 0.4 }} />
              <Text style={{ fontSize: 12, color: textMuted }}>
                Free: <Text style={{ fontWeight: '600', color: textPrimary }}>{freeGB.toFixed(1)} {usedLabel}</Text>
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT 14: Stats with Usage Breakdown
  // ---------------------------------------------------------------------------
  if (normalizedVariant === '14') {
    const totalAmount = data.reduce((sum, item) => sum + (item.amount || 0), 0);
    return (
      <Card style={[{ backgroundColor: cardBg, borderColor, borderWidth: 1, borderRadius: 18, width: '100%', maxWidth: 380 }, style]}>
        <CardContent style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: textPrimary }}>{title || 'Usage'}</Text>
            {change && renderTrendBadge('up', change)}
          </View>
          <Text style={{ fontSize: 28, fontWeight: '800', color: textPrimary, marginTop: 8 }}>
            {title === 'Usage' || !title ? `$${totalAmount}` : totalAmount}
          </Text>
          {description && <Text style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>{description}</Text>}
          <View style={{ marginTop: 16 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: textPrimary }}>Resource breakdown</Text>
            <View style={{ height: 6, width: '100%', flexDirection: 'row', gap: 2, marginTop: 8, borderRadius: 9999, overflow: 'hidden' }}>
              {data.map((item, idx) => (
                <View key={idx} style={{ height: '100%', width: `${Number(item.percentage) || 0}%` as any, backgroundColor: parseColor(item.color) }} />
              ))}
            </View>
          </View>
          <View style={{ marginTop: 16, gap: 10 }}>
            {data.map((item, idx) => (
              <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: parseColor(item.color) }} />
                  <Text style={{ fontSize: 12, color: textMuted }}>{item.label}</Text>
                </View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: textPrimary }}>
                  {(item.amount || 0).toLocaleString()} ({item.percentage}%)
                </Text>
              </View>
            ))}
          </View>
        </CardContent>
      </Card>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT 15: Stats with Value Breakdown
  // ---------------------------------------------------------------------------
  if (normalizedVariant === '15') {
    return (
      <Card style={[{ backgroundColor: cardBg, borderColor, borderWidth: 1, borderRadius: 18, width: '100%', maxWidth: 380 }, style]}>
        <CardContent style={{ padding: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '800', color: textPrimary, marginBottom: 14 }}>{title || 'Value breakdown'}</Text>
          <View style={{ gap: 10 }}>
            {data.map((item, idx) => (
              <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: idx < data.length - 1 ? 1 : 0, borderBottomColor: borderColor }}>
                <Text style={{ fontSize: 13, color: textMuted }}>{item.label}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: textPrimary }}>{item.value}</Text>
                  <View style={{ width: 1, height: 14, backgroundColor: borderColor }} />
                  {renderTrendBadge(item.percentage && String(item.percentage).startsWith('+') ? 'up' : 'down', String(item.percentage))}
                </View>
              </View>
            ))}
          </View>
        </CardContent>
      </Card>
    );
  }

  // ---------------------------------------------------------------------------
  // DEFAULT FALLBACK
  // ---------------------------------------------------------------------------
  return (
    <Card style={[{ backgroundColor: cardBg, borderColor, borderWidth: 1, borderRadius: 16 }, style]}>
      <CardHeader style={{ padding: 18, paddingBottom: 10 }}>
        <CardTitle style={{ fontSize: 15, fontWeight: '700', color: textPrimary }}>{title || 'Stats'}</CardTitle>
        {description && <CardDescription style={{ fontSize: 12, color: textMuted }}>{description}</CardDescription>}
      </CardHeader>
      <CardContent style={{ padding: 18, paddingTop: 0 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {data.map((item, idx) => (
            <View key={idx} style={{ flex: 1, minWidth: 120, padding: 12, borderRadius: 10, backgroundColor: cardMutedBg, borderWidth: 1, borderColor }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: textMuted }}>{item.name || item.metric}</Text>
              <Text style={{ fontSize: 17, fontWeight: '800', color: textPrimary, marginTop: 4 }}>{item.value || item.stat || item.current}</Text>
            </View>
          ))}
        </View>
      </CardContent>
    </Card>
  );
}
