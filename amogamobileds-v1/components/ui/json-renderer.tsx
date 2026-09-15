import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from './text';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './card';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { Switch } from './switch';
import { Checkbox } from './checkbox';
import { Progress } from './progress';
import { Separator } from './separator';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Table, TableColumn } from './table';
import { Stack } from './stack';
import { PremiumStats } from './premium-stats';
import { PricingCard, FeatureList } from './pricing-card';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Check, Star, Sparkles, HelpCircle } from 'lucide-react-native';

export interface JsonSchemaElement {
  type: string;
  props?: Record<string, any>;
  children?: (string | JsonSchemaElement)[];
}

export interface JsonSchemaTree {
  root?: string;
  elements?: Record<string, JsonSchemaElement>;
  type?: string;
  props?: Record<string, any>;
  children?: any[];
}

export interface JsonRendererProps {
  schema: any;
  onAction?: (action: string, params?: any) => void;
  style?: any;
}

export function JsonRenderer({ schema, onAction, style }: JsonRendererProps) {
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const cardBg = isDark ? '#141E33' : '#FFFFFF';
  const borderColor = isDark ? '#1E293B' : '#E2E8F0';

  if (!schema) {
    return (
      <View style={{ padding: 24, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: textMuted, fontSize: 13 }}>No UI schema provided</Text>
      </View>
    );
  }

  // Helper to render an element by ID or object
  const renderElement = (elementOrId: string | JsonSchemaElement, elementsMap?: Record<string, JsonSchemaElement>): React.ReactNode => {
    let el: JsonSchemaElement | undefined;

    if (typeof elementOrId === 'string') {
      if (elementsMap && elementsMap[elementOrId]) {
        el = elementsMap[elementOrId];
      } else {
        return <Text key={elementOrId} style={{ color: textPrimary }}>{elementOrId}</Text>;
      }
    } else if (typeof elementOrId === 'object') {
      el = elementOrId;
    }

    if (!el) return null;

    const { type, props = {}, children = [] } = el;
    const key = Math.random().toString(36).substring(7);

    const renderedChildren = Array.isArray(children)
      ? children.map((c) => renderElement(c, elementsMap))
      : null;

    switch (type) {
      case 'Stack':
        return (
          <Stack
            key={key}
            direction={props.direction || 'vertical'}
            gap={props.gap || 'md'}
            align={props.align || 'stretch'}
          >
            {renderedChildren}
          </Stack>
        );

      case 'Card':
        return (
          <Card
            key={key}
            style={{
              backgroundColor: cardBg,
              borderColor,
              borderWidth: 1,
              borderRadius: 18,
              width: '100%',
              maxWidth: props.maxWidth === 'sm' ? 320 : props.maxWidth === 'md' ? 440 : undefined,
              alignSelf: props.centered ? 'center' : 'auto',
            }}
          >
            {(props.title || props.description) && (
              <CardHeader style={{ padding: 20, paddingBottom: 12 }}>
                {props.title && (
                  <CardTitle style={{ fontSize: 17, fontWeight: '800', color: textPrimary }}>
                    {props.title}
                  </CardTitle>
                )}
                {props.description && (
                  <CardDescription style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>
                    {props.description}
                  </CardDescription>
                )}
              </CardHeader>
            )}
            <CardContent style={{ padding: 20, paddingTop: props.title ? 0 : 20, gap: 12 }}>
              {renderedChildren}
            </CardContent>
          </Card>
        );

      case 'PremiumStats':
      case 'StatCard':
        return (
          <PremiumStats
            key={key}
            variant={props.variant || '01'}
            title={props.title}
            description={props.description}
            value={props.value}
            change={props.change}
            data={props.data}
            segments={props.segments}
            used={props.used}
            total={props.total}
            usedLabel={props.usedLabel}
            totalLabel={props.totalLabel}
            buttonLabel={props.buttonLabel}
            upgradeUrl={props.upgradeUrl}
          />
        );

      case 'PricingCard':
        return (
          <PricingCard
            key={key}
            title={props.title || 'Plan'}
            description={props.description}
            price={props.price || '$29'}
            period={props.period || '/month'}
            features={props.features || []}
            popular={props.popular || false}
            buttonLabel={props.buttonLabel || 'Get Started'}
            onSelect={() => onAction && onAction('select-plan', props)}
          />
        );

      case 'Price':
        return (
          <View key={key} style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
            <Text style={{ fontSize: 32, fontWeight: '900', color: textPrimary }}>
              {props.amount || '$0'}
            </Text>
            {props.period && (
              <Text style={{ fontSize: 13, fontWeight: '600', color: textMuted }}>
                {props.period}
              </Text>
            )}
          </View>
        );

      case 'FeatureList':
        return <FeatureList key={key} features={props.features || []} />;

      case 'Heading': {
        const level = props.level || '2';
        const fontSize = level === '1' ? 26 : level === '2' ? 20 : level === '3' ? 17 : 15;
        return (
          <Text
            key={key}
            style={{
              fontSize,
              fontWeight: '800',
              color: textPrimary,
              letterSpacing: level === '1' ? -0.5 : 0,
            }}
          >
            {props.children || ''}
          </Text>
        );
      }

      case 'Text':
        return (
          <Text
            key={key}
            style={{
              fontSize: props.size === 'sm' ? 12 : props.size === 'lg' ? 16 : 14,
              color: props.size === 'sm' ? textMuted : textPrimary,
              lineHeight: 20,
            }}
          >
            {props.children || ''}
          </Text>
        );

      case 'Button':
        return (
          <Button
            key={key}
            variant={props.variant || 'default'}
            onPress={() => onAction && onAction(props.onClick || 'button-click', props)}
            style={{ borderRadius: 12 }}
          >
            {props.label || 'Submit'}
          </Button>
        );

      case 'Badge':
        return (
          <Badge key={key} variant={props.variant || 'default'}>
            {props.label || 'Badge'}
          </Badge>
        );

      case 'Alert':
        return (
          <Alert key={key} variant={props.variant || 'default'}>
            {props.title && <AlertTitle>{props.title}</AlertTitle>}
            {props.description && <AlertDescription>{props.description}</AlertDescription>}
            {renderedChildren}
          </Alert>
        );

      case 'Progress':
        return (
          <View key={key} style={{ gap: 6 }}>
            {props.label && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: textPrimary }}>{props.label}</Text>
                <Text style={{ fontSize: 12, color: textMuted }}>{props.value || 0}%</Text>
              </View>
            )}
            <Progress value={props.value || 0} />
          </View>
        );

      case 'Separator':
        return <Separator key={key} orientation={props.orientation || 'horizontal'} />;

      case 'Input':
        return (
          <View key={key} style={{ gap: 4 }}>
            {props.label && (
              <Text style={{ fontSize: 12, fontWeight: '600', color: textPrimary }}>
                {props.label}
              </Text>
            )}
            <Input placeholder={props.placeholder || ''} defaultValue={props.value} />
          </View>
        );

      case 'Checkbox':
        return (
          <View key={key} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Checkbox checked={props.checked || false} onCheckedChange={() => {}} />
            {props.label && (
              <Text style={{ fontSize: 13, color: textPrimary }}>{props.label}</Text>
            )}
          </View>
        );

      case 'Switch':
        return (
          <View key={key} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {props.label && (
              <Text style={{ fontSize: 13, fontWeight: '600', color: textPrimary }}>{props.label}</Text>
            )}
            <Switch checked={props.checked || false} onCheckedChange={() => {}} />
          </View>
        );

      case 'Avatar':
        return (
          <Avatar key={key} size={props.size === 'lg' ? 54 : props.size === 'sm' ? 32 : 44}>
            {props.src && <AvatarImage source={{ uri: props.src }} />}
            <AvatarFallback>{props.fallback || 'U'}</AvatarFallback>
          </Avatar>
        );

      case 'Form':
        return (
          <View key={key} style={{ gap: 14, width: '100%' }}>
            {renderedChildren}
          </View>
        );

      default:
        return (
          <View key={key} style={{ gap: 8 }}>
            {renderedChildren}
          </View>
        );
    }
  };

  // Check if schema uses elements map format
  if (schema.root && schema.elements) {
    return (
      <View style={[{ width: '100%' }, style]}>
        {renderElement(schema.root, schema.elements)}
      </View>
    );
  }

  // Direct element tree
  return (
    <View style={[{ width: '100%' }, style]}>
      {renderElement(schema)}
    </View>
  );
}
