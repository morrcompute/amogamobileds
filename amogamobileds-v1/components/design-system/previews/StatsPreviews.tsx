import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  ExternalLink,
  AlertTriangle,
  Check,
  ChevronRight,
  Box,
  Edit,
} from 'lucide-react-native';
import Svg, { Circle, Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../../../providers/theme-provider';
import type { GalleryEntry } from '../../types';

// =========================================================================
// 1. STATS 01: STATS WITH TRENDING
// =========================================================================

export function Stats01TrendingPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const data = [
    { name: 'Profit', value: '$287,654.00', change: '+8.32%', changeType: 'positive' },
    { name: 'Late payments', value: '$9,435.00', change: '-12.64%', changeType: 'negative' },
    { name: 'Pending orders', value: '$173,229.00', change: '+2.87%', changeType: 'positive' },
    { name: 'Operating costs', value: '$52,891.00', change: '-5.73%', changeType: 'negative' },
  ];

  return (
    <View style={styles.cardWrapper}>
      <View style={[styles.statsCardContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.grid4Cols}>
          {data.map((stat, index) => (
            <View
              key={stat.name}
              style={[
                styles.gridCell,
                { borderColor: colors.border },
                index < data.length - 1 ? styles.borderRightCell : null,
              ]}
            >
              <View style={styles.cellHeaderRow}>
                <Text style={[styles.cellLabel, { color: colors.mutedForeground }]}>
                  {stat.name}
                </Text>
                <View
                  style={[
                    styles.smallTrendPill,
                    {
                      backgroundColor:
                        stat.changeType === 'positive'
                          ? isDark ? 'rgba(16, 185, 129, 0.15)' : '#dcfce7'
                          : isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.smallTrendText,
                      { color: stat.changeType === 'positive' ? '#10b981' : '#ef4444' },
                    ]}
                  >
                    {stat.change}
                  </Text>
                </View>
              </View>

              <Text style={[styles.largeValueText, { color: colors.foreground }]}>
                {stat.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// =========================================================================
// 2. STATS 02: STATS WITH BORDERS
// =========================================================================

export function Stats02BordersPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const stats = [
    { metric: 'Active Users', current: '128,456', previous: '115,789', difference: '10.9%', trend: 'up' },
    { metric: 'Conversion Rate', current: '5.32%', previous: '6.18%', difference: '0.86%', trend: 'down' },
    { metric: 'Avg. Session Duration', current: '3m 42s', previous: '3m 15s', difference: '13.8%', trend: 'up' },
  ];

  return (
    <View style={styles.cardWrapper}>
      <View style={[styles.statsCardContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.grid3Cols}>
          {stats.map((item, index) => (
            <View
              key={item.metric}
              style={[
                styles.gridCell,
                { borderColor: colors.border },
                index < stats.length - 1 ? styles.borderRightCell : null,
              ]}
            >
              <Text style={[styles.cellLabel, { color: colors.mutedForeground }]}>
                {item.metric}
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                <Text style={[styles.mediumValueText, { color: colors.foreground }]}>
                  {item.current}
                </Text>
                <Text style={{ fontSize: 11, color: colors.mutedForeground }}>
                  from {item.previous}
                </Text>
              </View>

              <View style={{ marginTop: 8 }}>
                <View
                  style={[
                    styles.badgeRow,
                    {
                      backgroundColor:
                        item.trend === 'up'
                          ? isDark ? 'rgba(16, 185, 129, 0.15)' : '#dcfce7'
                          : isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
                      alignSelf: 'flex-start',
                    },
                  ]}
                >
                  {item.trend === 'up' ? (
                    <TrendingUp size={12} color="#10b981" />
                  ) : (
                    <TrendingDown size={12} color="#ef4444" />
                  )}
                  <Text
                    style={[
                      styles.badgeText,
                      { color: item.trend === 'up' ? '#10b981' : '#ef4444' },
                    ]}
                  >
                    {item.difference}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// =========================================================================
// 3. STATS 03: STATS WITH CARD LAYOUT
// =========================================================================

export function Stats03CardsPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors } = useTheme();

  const data = [
    { name: 'Unique visitors', stat: '10,450', change: '-12.5%', changeType: 'negative' },
    { name: 'Bounce rate', stat: '56.1%', change: '+1.8%', changeType: 'positive' },
    { name: 'Visit duration', stat: '5.2min', change: '+19.7%', changeType: 'positive' },
    { name: 'Conversion rate', stat: '3.2%', change: '-2.4%', changeType: 'negative' },
  ];

  return (
    <View style={styles.cardWrapper}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {data.map((item) => (
          <View
            key={item.name}
            style={[
              styles.individualCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.cellLabel, { color: colors.mutedForeground }]}>
              {item.name}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
              <Text style={[styles.largeValueText, { color: colors.foreground }]}>
                {item.stat}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: item.changeType === 'positive' ? '#10b981' : '#ef4444',
                }}
              >
                {item.change}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// =========================================================================
// 4. STATS 04: STATS WITH BADGES
// =========================================================================

export function Stats04BadgesPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const data = [
    { name: 'Daily active users', stat: '3,450', change: '+12.1%', changeType: 'positive' },
    { name: 'Weekly sessions', stat: '1,342', change: '-9.8%', changeType: 'negative' },
    { name: 'Duration', stat: '5.2min', change: '+7.7%', changeType: 'positive' },
  ];

  return (
    <View style={styles.cardWrapper}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {data.map((item) => (
          <View
            key={item.name}
            style={[
              styles.individualCard,
              { flex: 1, minWidth: 160, backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[styles.cellLabel, { color: colors.mutedForeground }]}>
                {item.name}
              </Text>
              <View
                style={[
                  styles.badgeRow,
                  {
                    backgroundColor:
                      item.changeType === 'positive'
                        ? isDark ? 'rgba(16, 185, 129, 0.15)' : '#dcfce7'
                        : isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
                  },
                ]}
              >
                {item.changeType === 'positive' ? (
                  <TrendingUp size={11} color="#10b981" />
                ) : (
                  <TrendingDown size={11} color="#ef4444" />
                )}
                <Text
                  style={[
                    styles.badgeText,
                    { color: item.changeType === 'positive' ? '#10b981' : '#ef4444' },
                  ]}
                >
                  {item.change}
                </Text>
              </View>
            </View>
            <Text style={[styles.largeValueText, { color: colors.foreground, marginTop: 8 }]}>
              {item.stat}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// =========================================================================
// 5. STATS 05: STATS WITH LINKS
// =========================================================================

export function Stats05LinksPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors } = useTheme();

  const data = [
    { name: 'Monthly recurring revenue', value: '$34.1K', change: '+6.1%', changeType: 'positive' },
    { name: 'Users', value: '500.1K', change: '+19.2%', changeType: 'positive' },
    { name: 'User growth', value: '11.3%', change: '-1.2%', changeType: 'negative' },
  ];

  return (
    <View style={styles.cardWrapper}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {data.map((item) => (
          <View
            key={item.name}
            style={[
              styles.individualCard,
              { flex: 1, minWidth: 170, backgroundColor: colors.card, borderColor: colors.border, padding: 0, overflow: 'hidden' },
            ]}
          >
            <View style={{ padding: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[styles.cellLabel, { color: colors.mutedForeground, flex: 1 }]}>
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontSize: 11.5,
                    fontWeight: '700',
                    color: item.changeType === 'positive' ? '#10b981' : '#ef4444',
                  }}
                >
                  {item.change}
                </Text>
              </View>
              <Text style={[styles.largeValueText, { color: colors.foreground, marginTop: 4 }]}>
                {item.value}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => alert(`View details for ${item.name}`)}
              style={[styles.cardFooterLink, { borderTopColor: colors.border }]}
            >
              <Text style={{ fontSize: 11.5, fontWeight: '700', color: '#3b82f6', textAlign: 'right' }}>
                View more →
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

// =========================================================================
// 6. STATS 06: STATS WITH STATUS
// =========================================================================

export function Stats06StatusPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const data = [
    { name: 'Europe', stat: '$10,023', goalsAchieved: 3, status: 'observe' },
    { name: 'North America', stat: '$14,092', goalsAchieved: 5, status: 'within' },
    { name: 'Asia', stat: '$113,232', goalsAchieved: 1, status: 'critical' },
  ];

  return (
    <View style={styles.cardWrapper}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {data.map((item) => {
          const statusBg =
            item.status === 'within' ? '#10b981' : item.status === 'observe' ? '#f59e0b' : '#ef4444';
          const statusTextColor =
            item.status === 'within' ? '#10b981' : item.status === 'observe' ? '#f59e0b' : '#ef4444';

          return (
            <View
              key={item.name}
              style={[
                styles.individualCard,
                { flex: 1, minWidth: 170, backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.cellLabel, { color: colors.mutedForeground }]}>
                {item.name}
              </Text>
              <Text style={[styles.largeValueText, { color: colors.foreground, marginTop: 4 }]}>
                {item.stat}
              </Text>

              <TouchableOpacity
                onPress={() => alert(`${item.name} status: ${item.status}`)}
                style={[
                  styles.statusBoxRow,
                  { backgroundColor: isDark ? '#182235' : '#f1f5f9' },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                  <View style={[styles.statusIconBox, { backgroundColor: statusBg }]}>
                    {item.status === 'within' ? (
                      <Check size={12} color="#ffffff" />
                    ) : item.status === 'observe' ? (
                      <Eye size={12} color="#ffffff" />
                    ) : (
                      <AlertTriangle size={12} color="#ffffff" />
                    )}
                  </View>
                  <View>
                    <Text style={{ fontSize: 10.5, color: colors.mutedForeground }}>
                      {item.goalsAchieved}/5 goals
                    </Text>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: statusTextColor, textTransform: 'capitalize' }}>
                      {item.status}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={14} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// =========================================================================
// 7. STATS 07: STATS WITH CIRCULAR PROGRESS
// =========================================================================

export function Stats07RadialProgressPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const data = [
    { name: 'Workspaces', capacity: 20, current: 1, allowed: 5, color: '#3b82f6' },
    { name: 'Dashboards', capacity: 10, current: 2, allowed: 20, color: '#10b981' },
    { name: 'Chart widgets', capacity: 30, current: 15, allowed: 50, color: '#f59e0b' },
    { name: 'Storage', capacity: 50, current: 25, allowed: 100, color: '#8b5cf6' },
  ];

  return (
    <View style={styles.cardWrapper}>
      <View style={[styles.statsCardContainer, { backgroundColor: colors.card, borderColor: colors.border, padding: 16 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.foreground }}>
              Plan overview
            </Text>
            <Text style={{ fontSize: 11.5, color: colors.mutedForeground }}>
              You are currently on the <Text style={{ fontWeight: '700', color: colors.foreground }}>starter plan</Text>.
            </Text>
          </View>
          <TouchableOpacity onPress={() => alert('View other plans')} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 11.5, color: '#3b82f6', fontWeight: '700' }}>View plans</Text>
            <ExternalLink size={12} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {data.map((item) => {
            const radius = 22;
            const strokeWidth = 4.5;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (item.capacity / 100) * circumference;

            return (
              <View
                key={item.name}
                style={[
                  styles.radialItemCard,
                  { backgroundColor: isDark ? '#141e33' : '#f8fafc', borderColor: colors.border },
                ]}
              >
                <View style={{ width: 56, height: 56, alignItems: 'center', justifyContent: 'center' }}>
                  <Svg width={56} height={56}>
                    <Circle
                      cx={28}
                      cy={28}
                      r={radius}
                      stroke={isDark ? '#334155' : '#e2e8f0'}
                      strokeWidth={strokeWidth}
                      fill="none"
                    />
                    <Circle
                      cx={28}
                      cy={28}
                      r={radius}
                      stroke={item.color}
                      strokeWidth={strokeWidth}
                      fill="none"
                      strokeDasharray={`${circumference}`}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      transform="rotate(-90 28 28)"
                    />
                  </Svg>
                  <Text style={{ position: 'absolute', fontSize: 11, fontWeight: '800', color: colors.foreground }}>
                    {item.capacity}%
                  </Text>
                </View>

                <View style={{ gap: 2 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: colors.foreground }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 10.5, color: colors.mutedForeground }}>
                    {item.current} of {item.allowed} used
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

// =========================================================================
// 8. STATS 08: STATS WITH CIRCULAR PROGRESS AND LINKS
// =========================================================================

export function Stats08RadialLinksPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const data = [
    { name: 'HR', progress: 25, budget: '$1,000', current: '$250', color: '#3b82f6' },
    { name: 'Marketing', progress: 55, budget: '$1,000', current: '$550', color: '#10b981' },
    { name: 'Finance', progress: 85, budget: '$1,000', current: '$850', color: '#f59e0b' },
    { name: 'Engineering', progress: 70, budget: '$2,000', current: '$1,400', color: '#8b5cf6' },
  ];

  return (
    <View style={styles.cardWrapper}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {data.map((item) => {
          const radius = 20;
          const strokeWidth = 4;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (item.progress / 100) * circumference;

          return (
            <View
              key={item.name}
              style={[
                styles.individualCard,
                { flex: 1, minWidth: 150, backgroundColor: colors.card, borderColor: colors.border, padding: 0, overflow: 'hidden' },
              ]}
            >
              <View style={{ padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                  <Svg width={50} height={50}>
                    <Circle
                      cx={25}
                      cy={25}
                      r={radius}
                      stroke={isDark ? '#334155' : '#e2e8f0'}
                      strokeWidth={strokeWidth}
                      fill="none"
                    />
                    <Circle
                      cx={25}
                      cy={25}
                      r={radius}
                      stroke={item.color}
                      strokeWidth={strokeWidth}
                      fill="none"
                      strokeDasharray={`${circumference}`}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      transform="rotate(-90 25 25)"
                    />
                  </Svg>
                  <Text style={{ position: 'absolute', fontSize: 10, fontWeight: '800', color: colors.foreground }}>
                    {item.progress}%
                  </Text>
                </View>

                <View style={{ gap: 2 }}>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: colors.foreground }}>
                    {item.current} / {item.budget}
                  </Text>
                  <Text style={{ fontSize: 10.5, color: colors.mutedForeground }}>
                    Budget {item.name}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => alert(`View ${item.name} budget breakdown`)}
                style={[styles.cardFooterLink, { borderTopColor: colors.border }]}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#3b82f6', textAlign: 'right' }}>
                  View more →
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// =========================================================================
// 9. STATS 09: STATS WITH PROGRESS
// =========================================================================

export function Stats09LinearProgressPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const data = [
    { name: 'Requests', stat: '996', limit: '10,000', percentage: 9.96, color: '#3b82f6' },
    { name: 'Credits', stat: '$672', limit: '$1,000', percentage: 67.2, color: '#10b981' },
    { name: 'Storage', stat: '1.85 GB', limit: '10GB', percentage: 18.5, color: '#f59e0b' },
    { name: 'API Calls', stat: '4,328', limit: '5,000', percentage: 86.56, color: '#8b5cf6' },
  ];

  return (
    <View style={styles.cardWrapper}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {data.map((item) => (
          <View
            key={item.name}
            style={[
              styles.individualCard,
              { flex: 1, minWidth: 150, backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.cellLabel, { color: colors.mutedForeground }]}>
              {item.name}
            </Text>
            <Text style={[styles.mediumValueText, { color: colors.foreground, marginTop: 4 }]}>
              {item.stat}
            </Text>

            {/* Horizontal Progress Bar */}
            <View
              style={{
                height: 6,
                borderRadius: 3,
                backgroundColor: isDark ? '#334155' : '#e2e8f0',
                marginTop: 12,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: `${Math.min(item.percentage, 100)}%`,
                  backgroundColor: item.color,
                  borderRadius: 3,
                }}
              />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
              <Text style={{ fontSize: 10.5, fontWeight: '700', color: item.color }}>
                {item.percentage}%
              </Text>
              <Text style={{ fontSize: 10.5, color: colors.mutedForeground }}>
                {item.stat} of {item.limit}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// =========================================================================
// 10. STATS 10: STATS WITH AREA SPARKLINE CHART
// =========================================================================

export function Stats10AreaSparklinePreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors } = useTheme();

  const summary = [
    {
      name: 'Alpha Corp',
      tickerSymbol: 'ACP',
      value: '$168.59',
      change: '+15.86',
      percentageChange: '+10.4%',
      changeType: 'positive',
      sparkPath: 'M0,35 Q20,15 40,25 T80,10 T120,5 T160,2',
    },
    {
      name: 'Beta Solutions',
      tickerSymbol: 'BTS',
      value: '$78.54',
      change: '+4.65',
      percentageChange: '+6.3%',
      changeType: 'positive',
      sparkPath: 'M0,30 Q30,40 60,20 T110,15 T160,5',
    },
    {
      name: 'Gamma Industries',
      tickerSymbol: 'GMI',
      value: '$75.68',
      change: '-5.74',
      percentageChange: '-7.1%',
      changeType: 'negative',
      sparkPath: 'M0,5 Q40,10 70,25 T120,30 T160,36',
    },
  ];

  return (
    <View style={styles.cardWrapper}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {summary.map((item) => {
          const color = item.changeType === 'positive' ? '#10b981' : '#ef4444';

          return (
            <View
              key={item.name}
              style={[
                styles.individualCard,
                { flex: 1, minWidth: 180, backgroundColor: colors.card, borderColor: colors.border, padding: 14, overflow: 'hidden' },
              ]}
            >
              <Text style={{ fontSize: 12.5, fontWeight: '700', color: colors.foreground }}>
                {item.name}{' '}
                <Text style={{ fontSize: 11, fontWeight: '400', color: colors.mutedForeground }}>
                  ({item.tickerSymbol})
                </Text>
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
                <Text style={[styles.mediumValueText, { color }]}>
                  {item.value}
                </Text>
                <Text style={{ fontSize: 11, fontWeight: '700', color }}>
                  {item.change} ({item.percentageChange})
                </Text>
              </View>

              {/* Sparkline Graphic */}
              <View style={{ height: 42, width: '100%', marginTop: 8 }}>
                <Svg width="100%" height="42" viewBox="0 0 160 40">
                  <Defs>
                    <SvgLinearGradient id={`grad-${item.tickerSymbol}`} x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
                      <Stop offset="100%" stopColor={color} stopOpacity="0.0" />
                    </SvgLinearGradient>
                  </Defs>
                  <Path
                    d={`${item.sparkPath} L160,40 L0,40 Z`}
                    fill={`url(#grad-${item.tickerSymbol})`}
                  />
                  <Path
                    d={item.sparkPath}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                  />
                </Svg>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// =========================================================================
// 11. STATS 11: STATS DASHBOARD WITH PROGRESS BARS & ACTIONS
// =========================================================================

export function Stats11ResourceDashboardPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  return (
    <View style={styles.cardWrapper}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {/* Commands Card (Reads + Writes) */}
        <View style={[styles.individualCard, { flex: 1, minWidth: 170, backgroundColor: colors.card, borderColor: colors.border, padding: 0, overflow: 'hidden' }]}>
          <View style={{ padding: 14 }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: colors.mutedForeground, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              COMMANDS
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
              <Text style={[styles.mediumValueText, { color: colors.foreground }]}>13.8M</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground }}>/ Unlimited</Text>
            </View>

            {/* Split Bar */}
            <View style={{ height: 4, borderRadius: 2, backgroundColor: isDark ? '#334155' : '#e2e8f0', marginTop: 10, flexDirection: 'row', overflow: 'hidden' }}>
              <View style={{ width: '70%', height: '100%', backgroundColor: '#10b981' }} />
              <View style={{ width: '30%', height: '100%', backgroundColor: '#3b82f6' }} />
            </View>

            <View style={{ marginTop: 10, gap: 4 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' }} />
                  <Text style={{ fontSize: 10.5, color: colors.mutedForeground }}>Writes</Text>
                </View>
                <Text style={{ fontSize: 10.5, fontWeight: '600', color: colors.foreground }}>11,276,493</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#3b82f6' }} />
                  <Text style={{ fontSize: 10.5, color: colors.mutedForeground }}>Reads</Text>
                </View>
                <Text style={{ fontSize: 10.5, fontWeight: '600', color: colors.foreground }}>2,548,921</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={() => alert('Upgrading Commands...')} style={[styles.bottomGhostAction, { backgroundColor: isDark ? '#182235' : '#f8fafc', borderTopColor: colors.border }]}>
            <Box size={13} color="#3b82f6" />
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#3b82f6' }}>Upgrade</Text>
          </TouchableOpacity>
        </View>

        {/* Bandwidth Card */}
        <View style={[styles.individualCard, { flex: 1, minWidth: 170, backgroundColor: colors.card, borderColor: colors.border, padding: 0, overflow: 'hidden' }]}>
          <View style={{ padding: 14 }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: colors.mutedForeground, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              BANDWIDTH
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
              <Text style={[styles.mediumValueText, { color: colors.foreground }]}>141 GB</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground }}>/ 150 GB</Text>
            </View>

            <View style={{ height: 4, borderRadius: 2, backgroundColor: isDark ? '#334155' : '#e2e8f0', marginTop: 10, overflow: 'hidden' }}>
              <View style={{ width: '94%', height: '100%', backgroundColor: '#f97316' }} />
            </View>

            <Text style={{ fontSize: 10, color: '#f59e0b', marginTop: 8, lineHeight: 14 }}>
              Warning: Approaching monthly limit.
            </Text>
          </View>

          <TouchableOpacity onPress={() => alert('Upgrading Bandwidth...')} style={[styles.bottomGhostAction, { backgroundColor: isDark ? '#182235' : '#f8fafc', borderTopColor: colors.border }]}>
            <Box size={13} color="#3b82f6" />
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#3b82f6' }}>Upgrade</Text>
          </TouchableOpacity>
        </View>

        {/* Cost Budget Card */}
        <View style={[styles.individualCard, { flex: 1, minWidth: 170, backgroundColor: colors.card, borderColor: colors.border, padding: 0, overflow: 'hidden' }]}>
          <View style={{ padding: 14 }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: colors.mutedForeground, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              COST
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
              <Text style={[styles.mediumValueText, { color: colors.foreground }]}>$73.42</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground }}>/ $150 Budget</Text>
            </View>

            <View style={{ height: 4, borderRadius: 2, backgroundColor: isDark ? '#334155' : '#e2e8f0', marginTop: 10, overflow: 'hidden' }}>
              <View style={{ width: '48.95%', height: '100%', backgroundColor: '#10b981' }} />
            </View>

            <Text style={{ fontSize: 10, color: '#10b981', marginTop: 8, fontWeight: '600' }}>
              It&apos;s all right.
            </Text>
          </View>

          <TouchableOpacity onPress={() => alert('Opening Budget settings modal...')} style={[styles.bottomGhostAction, { backgroundColor: isDark ? '#182235' : '#f8fafc', borderTopColor: colors.border }]}>
            <Edit size={13} color="#3b82f6" />
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#3b82f6' }}>Change Budget</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// =========================================================================
// 12. STATS 12: STATS USAGE DASHBOARD (DONUT METERS)
// =========================================================================

export function Stats12UsageMetersPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const usageData = [
    { name: 'ISR Reads', current: '358K', limit: '1M', percentage: 35.8 },
    { name: 'Edge Requests', current: '317K', limit: '1M', percentage: 31.7 },
    { name: 'Fast Origin Transfer', current: '3.07 GB', limit: '10 GB', percentage: 30.7 },
    { name: 'Speed Insights Points', current: '791', limit: '10K', percentage: 7.9 },
    { name: 'Fast Data Transfer', current: '4.98 GB', limit: '100 GB', percentage: 5.0 },
    { name: 'Function Duration', current: '3.1 GB-Hrs', limit: '100 GB-Hrs', percentage: 3.1 },
    { name: 'Web Analytics Events', current: '1.3K', limit: '50K', percentage: 2.6 },
  ];

  return (
    <View style={styles.cardWrapper}>
      <View style={[styles.statsCardContainer, { backgroundColor: colors.card, borderColor: colors.border, padding: 14 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <View>
            <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.foreground }}>
              Last 30 days
            </Text>
            <Text style={{ fontSize: 10.5, color: colors.mutedForeground }}>
              Updated just now
            </Text>
          </View>
          <TouchableOpacity onPress={() => alert('Upgrade usage limits')} style={{ backgroundColor: '#3b82f6', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 }}>
            <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: '700' }}>Upgrade</Text>
          </TouchableOpacity>
        </View>

        <View style={{ gap: 4 }}>
          {usageData.map((item, index) => {
            const radius = 9;
            const strokeWidth = 2.5;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (item.percentage / 100) * circumference;

            return (
              <View
                key={item.name}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingVertical: 6,
                  paddingHorizontal: 8,
                  borderRadius: 6,
                  backgroundColor: index % 2 === 1 ? (isDark ? '#141e33' : '#f8fafc') : 'transparent',
                }}
              >
                <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
                  <Svg width={22} height={22}>
                    <Circle
                      cx={11}
                      cy={11}
                      r={radius}
                      stroke={isDark ? '#334155' : '#e2e8f0'}
                      strokeWidth={strokeWidth}
                      fill="none"
                    />
                    <Circle
                      cx={11}
                      cy={11}
                      r={radius}
                      stroke="#3b82f6"
                      strokeWidth={strokeWidth}
                      fill="none"
                      strokeDasharray={`${circumference}`}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      transform="rotate(-90 11 11)"
                    />
                  </Svg>
                </View>

                <Text style={{ fontSize: 12, color: colors.foreground, flex: 1 }}>
                  {item.name}
                </Text>

                <Text style={{ fontSize: 11, color: colors.mutedForeground }}>
                  {item.current} / <Text style={{ fontWeight: '700', color: colors.foreground }}>{item.limit}</Text>
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

// =========================================================================
// 13. STATS 13: STATS WITH SEGMENTED PROGRESS
// =========================================================================

export function Stats13SegmentedProgressPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const used = 8300;
  const total = 15;
  const totalValue = total * 1000;
  const freeValue = totalValue - used;

  const segments = [
    { label: 'Documents', value: 2400, color: '#3b82f6' },
    { label: 'Photos', value: 1800, color: '#10b981' },
    { label: 'Videos', value: 3200, color: '#f59e0b' },
    { label: 'Music', value: 900, color: '#8b5cf6' },
  ];

  return (
    <View style={styles.cardWrapper}>
      <View style={[styles.statsCardContainer, { backgroundColor: colors.card, borderColor: colors.border, padding: 16 }]}>
        <Text style={{ fontSize: 13.5, color: colors.mutedForeground, marginBottom: 12 }}>
          Using Storage{' '}
          <Text style={{ fontWeight: '800', color: colors.foreground }}>
            {used.toLocaleString()} MB
          </Text>{' '}
          of {total} GB
        </Text>

        {/* Multi-Segment Bar */}
        <View style={{ height: 10, borderRadius: 5, backgroundColor: isDark ? '#334155' : '#e2e8f0', flexDirection: 'row', overflow: 'hidden', marginBottom: 14 }}>
          {segments.map((segment) => (
            <View
              key={segment.label}
              style={{
                height: '100%',
                width: `${(segment.value / totalValue) * 100}%`,
                backgroundColor: segment.color,
              }}
            />
          ))}
        </View>

        {/* Legend */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
          {segments.map((segment) => (
            <View key={segment.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: segment.color }} />
              <Text style={{ fontSize: 11.5, color: colors.mutedForeground }}>
                {segment.label} <Text style={{ fontWeight: '700', color: colors.foreground }}>{segment.value} MB</Text>
              </Text>
            </View>
          ))}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: isDark ? '#475569' : '#cbd5e1' }} />
            <Text style={{ fontSize: 11.5, color: colors.mutedForeground }}>
              Free <Text style={{ fontWeight: '700', color: colors.foreground }}>{freeValue} MB</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// =========================================================================
// 14. STATS 14: STATS WITH USAGE BREAKDOWN
// =========================================================================

export function Stats14ResourceBreakdownPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const data = [
    { label: 'Compute', amount: 450, percentage: 52.3, color: '#10b981' },
    { label: 'Storage', amount: 285, percentage: 33.1, color: '#f59e0b' },
    { label: 'Bandwidth', amount: 125, percentage: 14.6, color: '#f43f5e' },
  ];

  return (
    <View style={styles.cardWrapper}>
      <View style={[styles.statsCardContainer, { backgroundColor: colors.card, borderColor: colors.border, padding: 16 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.foreground }}>
            Usage
          </Text>
          <View style={[styles.smallTrendPill, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fef3c7' }]}>
            <Text style={[styles.smallTrendText, { color: '#f59e0b' }]}>+12.5%</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
          <Text style={[styles.largeValueText, { color: colors.foreground }]}>$860</Text>
          <Text style={{ fontSize: 11.5, color: colors.mutedForeground }}>this month</Text>
        </View>

        <Text style={{ fontSize: 11.5, fontWeight: '600', color: colors.foreground, marginTop: 12 }}>
          Resource breakdown
        </Text>

        <View style={{ height: 6, borderRadius: 3, backgroundColor: isDark ? '#334155' : '#e2e8f0', flexDirection: 'row', gap: 2, marginTop: 6, overflow: 'hidden' }}>
          {data.map((item) => (
            <View
              key={item.label}
              style={{
                height: '100%',
                width: `${item.percentage}%`,
                backgroundColor: item.color,
                borderRadius: 2,
              }}
            />
          ))}
        </View>

        <View style={{ marginTop: 12, gap: 6 }}>
          {data.map((item) => (
            <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: item.color }} />
              <Text style={{ fontSize: 11.5, color: colors.foreground }}>{item.label}</Text>
              <Text style={{ fontSize: 11, color: colors.mutedForeground }}>
                (${item.amount} / {item.percentage}%)
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={() => alert('Navigate to Resource Settings')} style={{ marginTop: 14 }}>
          <Text style={{ fontSize: 11, color: '#10b981', fontWeight: '700' }}>
            Configure limits in resource settings →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// =========================================================================
// 15. STATS 15: STATS WITH VALUE BREAKDOWN
// =========================================================================

export function Stats15GrowthProjectionPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors, resolvedMode } = useTheme();
  const isDark = resolvedMode === 'dark';

  const data = [
    { label: 'After 1 year', value: '$2,400', percentage: '+8.2%' },
    { label: 'After 5 years', value: '$14,800', percentage: '+24.6%' },
    { label: 'After 10 years', value: '$38,500', percentage: '+52.1%' },
  ];

  return (
    <View style={styles.cardWrapper}>
      <View style={[styles.statsCardContainer, { backgroundColor: colors.card, borderColor: colors.border, padding: 16 }]}>
        <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.foreground, marginBottom: 10 }}>
          Investment growth projection
        </Text>

        <View style={{ gap: 0 }}>
          {data.map((item, index) => (
            <View
              key={item.label}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 10,
                borderTopWidth: index > 0 ? 1 : 0,
                borderTopColor: colors.border,
              }}
            >
              <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                {item.label}
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.foreground }}>
                  {item.value}
                </Text>
                <View style={{ width: 1, height: 14, backgroundColor: colors.border }} />
                <View
                  style={[
                    styles.smallTrendPill,
                    {
                      backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#dcfce7',
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 10.5, fontWeight: '800', color: '#10b981' }}>
                    {item.percentage}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// =========================================================================
// 16. COMPLETE STATS BLOCKS COLLECTION (ALL 15 BLOCKS SHOWCASE)
// =========================================================================

export function StatsBlocksCollectionPreview({ stateIndex = 0 }: { stateIndex?: number }) {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ width: '100%', maxWidth: 680, gap: 20 }}>
        {/* Section 01 */}
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.foreground }}>
            01. Stats with Trending
          </Text>
          <Stats01TrendingPreview />
        </View>

        {/* Section 02 */}
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.foreground }}>
            02. Stats with Borders
          </Text>
          <Stats02BordersPreview />
        </View>

        {/* Section 03 */}
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.foreground }}>
            03. Stats with Card Layout
          </Text>
          <Stats03CardsPreview />
        </View>

        {/* Section 04 */}
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.foreground }}>
            04. Stats with Badges
          </Text>
          <Stats04BadgesPreview />
        </View>

        {/* Section 05 */}
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.foreground }}>
            05. Stats with Links
          </Text>
          <Stats05LinksPreview />
        </View>

        {/* Section 06 */}
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.foreground }}>
            06. Stats with Status
          </Text>
          <Stats06StatusPreview />
        </View>

        {/* Section 07 */}
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.foreground }}>
            07. Stats with Circular Progress
          </Text>
          <Stats07RadialProgressPreview />
        </View>

        {/* Section 08 */}
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.foreground }}>
            08. Stats with Circular Progress & Links
          </Text>
          <Stats08RadialLinksPreview />
        </View>

        {/* Section 09 */}
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.foreground }}>
            09. Stats with Progress
          </Text>
          <Stats09LinearProgressPreview />
        </View>

        {/* Section 10 */}
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.foreground }}>
            10. Stats with Area Sparklines
          </Text>
          <Stats10AreaSparklinePreview />
        </View>

        {/* Section 11 */}
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.foreground }}>
            11. Stats Dashboard with Progress & Actions
          </Text>
          <Stats11ResourceDashboardPreview />
        </View>

        {/* Section 12 */}
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.foreground }}>
            12. Stats Usage Dashboard
          </Text>
          <Stats12UsageMetersPreview />
        </View>

        {/* Section 13 */}
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.foreground }}>
            13. Stats with Segmented Progress
          </Text>
          <Stats13SegmentedProgressPreview />
        </View>

        {/* Section 14 */}
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.foreground }}>
            14. Stats with Usage Breakdown
          </Text>
          <Stats14ResourceBreakdownPreview />
        </View>

        {/* Section 15 */}
        <View style={{ gap: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.foreground }}>
            15. Stats with Value Breakdown
          </Text>
          <Stats15GrowthProjectionPreview />
        </View>
      </View>
    </ScrollView>
  );
}

// Backward compatibility exports
export const StatsTrendingCardPreview = Stats01TrendingPreview;
export const StatsProgressRingPreview = Stats07RadialProgressPreview;

export function StatsPreviews({ entry }: { entry?: GalleryEntry }) {
  return <StatsBlocksCollectionPreview />;
}

// =========================================================================
// STYLES
// =========================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    padding: 16,
    alignItems: 'center',
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  statsCardContainer: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  grid4Cols: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  grid3Cols: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridCell: {
    flex: 1,
    minWidth: 140,
    padding: 14,
    gap: 4,
  },
  borderRightCell: {
    borderRightWidth: 1,
  },
  cellHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  cellLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    fontFamily: 'Open Sans',
  },
  largeValueText: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Open Sans',
    letterSpacing: -0.3,
  },
  mediumValueText: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Open Sans',
  },
  smallTrendPill: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  smallTrendText: {
    fontSize: 9.5,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Open Sans',
  },
  individualCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },
  cardFooterLink: {
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'flex-end',
  },
  statusBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  statusIconBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radialItemCard: {
    flex: 1,
    minWidth: 130,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  bottomGhostAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderTopWidth: 1,
  },
});
