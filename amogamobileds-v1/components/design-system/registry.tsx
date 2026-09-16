import React, { useState } from 'react';
import { View } from '../ui/view';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { InputOTP } from '../ui/input-otp';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Spinner } from '../ui/spinner';
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ModeToggle } from '../ui/mode-toggle';
import { useToast } from '../ui/toast';
import { ColorPicker } from '../ui/color-picker';
import { Accordion, AccordionItem } from '../ui/accordion';
import { Progress } from '../ui/progress';
import { Slider } from '../ui/slider';
import { Toggle, ToggleGroup } from '../ui/toggle';
import { Tooltip } from '../ui/tooltip';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { AlertDialog } from '../ui/alert-dialog';
import { ActionSheet } from '../ui/action-sheet';
import { BottomSheet } from '../ui/bottom-sheet';
import { Collapsible } from '../ui/collapsible';
import {
  Combobox,
  ComboboxTrigger,
  ComboboxValue,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxItem,
  OptionType,
} from '../ui/combobox';
import { DatePicker } from '../ui/date-picker';
import { FilePicker } from '../ui/file-picker';
import { MediaPicker } from '../ui/media-picker';
import { Gallery } from '../ui/gallery';
import { HelloWave } from '../ui/hello-wave';
import { Icon } from '../ui/icon';
import { Image } from '../ui/image';
import { Link } from '../ui/link';
import { ParallaxScrollView } from '../ui/parallax-scrollview';
import { Picker } from '../ui/picker';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { RadioGroup, RadioOption } from '../ui/radio';
import { ScrollView } from '../ui/scroll-view';
import { SearchBar } from '../ui/searchbar';
import { ShareButton } from '../ui/share';
import { Sheet } from '../ui/sheet';
import { Table, TableColumn } from '../ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Video } from '../ui/video';
import { AudioPlayer } from '../ui/audio-player';
import { AudioRecorder } from '../ui/audio-recorder';
import { AudioWaveform } from '../ui/audio-waveform';
import { Camera } from '../ui/camera';
import { CameraPreview as CameraPreviewComponent } from '../ui/camera-preview';
import { Carousel } from '../ui/carousel';
import { AvoidKeyboard } from '../ui/avoid-keyboard';
import { Onboarding } from '../ui/onboarding';

// CHARTS
import { ChartContainer } from '../charts/chart-container';
import { BarChart } from '../charts/bar-chart';
import { LineChart } from '../charts/line-chart';
import { AreaChart } from '../charts/area-chart';
import { PieChart } from '../charts/pie-chart';
import { ProgressRingChart } from '../charts/progress-ring-chart';
import { BubbleChart } from '../charts/bubble-chart';
import { CandlestickChart } from '../charts/candlestick-chart';
import { ColumnChart } from '../charts/column-chart';
import { DoughnutChart } from '../charts/doughnut-chart';
import { HeatmapChart } from '../charts/heatmap-chart';
import { PolarAreaChart } from '../charts/polar-area-chart';
import { RadarChart } from '../charts/radar-chart';
import { RadialBarChart } from '../charts/radial-bar-chart';
import { ScatterChart } from '../charts/scatter-chart';
import { StackedAreaChart } from '../charts/stacked-area-chart';
import { StackedBarChart } from '../charts/stacked-bar-chart';
import { TreemapChart } from '../charts/treemap-chart';

import {
  Mail,
  Lock,
  Sparkles,
  Bold,
  Italic,
  Underline,
  HelpCircle,
  Share2,
  Camera as CameraIcon,
  Heart,
  Shield,
  Bell,
  Activity
} from 'lucide-react-native';

import { AppThemesPreview } from './previews/AppThemesPreview';
import { LucideIconsPreview } from './previews/LucideIconsPreview';
import { ChatPreviews } from './previews/ChatPreviews';
import {
  SignInPreview,
  SignUpPreview,
  VerifyOtpPreview,
  ForgotPasswordPreview,
} from './previews/AuthPreviews';
import { PreferencesPreview } from './previews/PreferencesPreview';
import { MapPreviews } from './previews/MapPreviews';
import { CalendarKitPreviews, CalendarAppPreview } from './previews/CalendarKitPreviews';
import { AiChatPreview } from './previews/AiChatPreview';
import {
  JsonRendererPreview,
  SchemaEditorPreview,
  PremiumStatsPreview,
  PricingCardPreview,
  UserProfileCardPreview,
  DynamicFeedbackFormPreview,
  WebSearchUIPreview,
  PromptSuggestionsPreview,
  ToolSelectorPreview,
  StackPreview,
} from './previews/ChatUiRenderPreviews';
import {
  QuestionnaireWizardPreview,
  MultiStepWizardPreview,
  SegmentedStepProgressPreview,
  LinearAndCircularProgressPreview,
} from './previews/WizardPreviews';
import {
  CompleteKanbanBoardPreview,
  TaskCardItemPreview,
} from './previews/KanbanPreviews';
import {
  FileUploaderAndViewerPreview,
  FileManagerViewPreview,
  FileCardItemPreview,
  FolderTreeItemPreview,
  FileUploadFormPreview,
} from './previews/FilesPreviews';
import {
  IntegrationCardPreview,
  CreditCardPreview,
  EcommerceProductCardPreview,
  AssignTaskCardPreview,
  AppointmentCardPreview,
  StatisticsCardPreview,
} from './previews/DataCardsPreviews';
import {
  CompleteVouchersPagePreview,
  NewVoucherScanPreview,
  NewVoucherPreview,
} from './previews/VouchersPreviews';
import {
  StatsBlocksCollectionPreview,
  Stats01TrendingPreview,
  Stats02BordersPreview,
  Stats03CardsPreview,
  Stats04BadgesPreview,
  Stats05LinksPreview,
  Stats06StatusPreview,
  Stats07RadialProgressPreview,
  Stats08RadialLinksPreview,
  Stats09LinearProgressPreview,
  Stats10AreaSparklinePreview,
  Stats11ResourceDashboardPreview,
  Stats12UsageMetersPreview,
  Stats13SegmentedProgressPreview,
  Stats14ResourceBreakdownPreview,
  Stats15GrowthProjectionPreview,
} from './previews/StatsPreviews';
import {
  EmailComposePreview,
  CompleteMailPagePreview,
  EmailViewPreview,
  EmailDetailPreview,
  EmailEditorPreview,
  EmailCardItemPreview,
} from './previews/MailPreviews';
import {
  EmailSettingPreview,
  AiApiSettingPreview,
  ChatApiSettingPreview,
  FilesSettingPreview,
  AppSettingsPagePreview,
} from './previews/AppSettingsPreviews';

export type ComponentCategory =
  | 'Primitives'
  | 'Inputs'
  | 'Charts'
  | 'Feedback'
  | 'Layout'
  | 'Display'
  | 'Media'
  | 'Data'
  | 'Themes'
  | 'Icons'
  | 'Chat'
  | 'Chat UI Render'
  | 'Wizards'
  | 'Kanban Board'
  | 'Files'
  | 'Data Cards'
  | 'Vouchers'
  | 'Stats'
  | 'Mail'
  | 'Auth'
  | 'App Settings'
  | 'Pages';

export interface ComponentItem {
  id: string;
  name: string;
  file: string;
  category: ComponentCategory;
  tag: string;
  description: string;
  Preview: React.ComponentType;
  codeSnippet?: string;
}

/* =========================================================================
   1. PRIMITIVES
   ========================================================================= */

function ButtonPreview() {
  const [loading, setLoading] = useState(false);
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>VARIANTS</Text>
      <View style={{ gap: 8 }}>
        <Button variant="default" onPress={() => {}}>Default Primary</Button>
        <Button variant="secondary" onPress={() => {}}>Secondary Button</Button>
        <Button variant="outline" onPress={() => {}}>Outline Button</Button>
        <Button variant="ghost" onPress={() => {}}>Ghost Button</Button>
        <Button variant="destructive" onPress={() => {}}>Destructive Action</Button>
      </View>
      <Text variant="caption" style={{ fontWeight: '600', marginTop: 12 }}>SIZES</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Button size="sm" variant="default">Small</Button>
        <Button size="default" variant="default">Default</Button>
        <Button size="lg" variant="default">Large</Button>
      </View>
      <Text variant="caption" style={{ fontWeight: '600', marginTop: 12 }}>STATES & ICONS</Text>
      <View style={{ gap: 8 }}>
        <Button
          variant="default"
          loading={loading}
          onPress={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 2000);
          }}
        >
          {loading ? 'Processing...' : 'Tap for Loading State'}
        </Button>
        <Button variant="outline" icon={Sparkles}>
          With Left Icon
        </Button>
        <Button variant="default" disabled>
          Disabled Button
        </Button>
      </View>
    </View>
  );
}

function BadgePreview() {
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>BADGE VARIANTS</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="success">Success</Badge>
      </View>
      <Text variant="caption" style={{ fontWeight: '600', marginTop: 12 }}>STATUS INDICATORS</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Badge variant="default">PRO Feature</Badge>
        <Badge variant="secondary">Verified</Badge>
        <Badge variant="destructive">Live Incident</Badge>
      </View>
    </View>
  );
}

function AvatarPreview() {
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>SIZES & FALLBACKS</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <Avatar size={36}>
          <AvatarImage source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }} />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Avatar size={48}>
          <AvatarImage source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }} />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <Avatar size={60}>
          <AvatarFallback>MA</AvatarFallback>
        </Avatar>
      </View>
    </View>
  );
}

function IconPreview() {
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>THEMED LUCIDE ICONS</Text>
      <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <Icon name={Heart} size={24} color="#ef4444" />
        <Icon name={Sparkles} size={24} color="#8b5cf6" />
        <Icon name={Shield} size={24} color="#10b981" />
        <Icon name={Bell} size={24} color="#f59e0b" />
        <Icon name={Activity} size={24} color="#3b82f6" />
      </View>
    </View>
  );
}

function ImagePreview() {
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>RESPONSIVE IMAGE</Text>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600' }}
        style={{ width: '100%', height: 180, borderRadius: 12 }}
        contentFit="cover"
      />
    </View>
  );
}

function TextPreview() {
  return (
    <View style={{ gap: 10 }}>
      <Text variant="heading">Heading Typography</Text>
      <Text variant="title">Title Typography</Text>
      <Text variant="subtitle">Subtitle Typography</Text>
      <Text variant="body">Body typography with balanced line height and optimal legibility.</Text>
      <Text variant="caption" style={{ opacity: 0.7 }}>Caption metadata and secondary hints.</Text>
    </View>
  );
}

function ViewPreview() {
  return (
    <View style={{ gap: 12 }}>
      <View style={{ padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.08)' }}>
        <Text variant="body" style={{ fontWeight: '600', color: '#3b82f6' }}>Foundational View Container</Text>
        <Text variant="caption" style={{ marginTop: 4 }}>Supports theme tokens, flexible layout, and cross-platform padding.</Text>
      </View>
    </View>
  );
}

function HelloWavePreview() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 }}>
      <HelloWave />
      <Text variant="title">Welcome to BNA UI</Text>
    </View>
  );
}

function LinkPreview() {
  return (
    <View style={{ gap: 12 }}>
      <Link href="https://ui.ahmedbna.com">
        <Text style={{ color: '#3b82f6', textDecorationLine: 'underline', fontWeight: '500' }}>
          Explore BNA UI Documentation ↗
        </Text>
      </Link>
    </View>
  );
}

function SeparatorPreview() {
  return (
    <View style={{ gap: 14 }}>
      <Text variant="body">Section Alpha</Text>
      <Separator />
      <Text variant="body">Section Beta</Text>
      <Separator orientation="horizontal" />
      <Text variant="caption" style={{ opacity: 0.7 }}>Dividers separate content sections cleanly.</Text>
    </View>
  );
}

/* =========================================================================
   2. INPUTS & FORMS
   ========================================================================= */

function InputPreview() {
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [val3, setVal3] = useState('');

  return (
    <View style={{ gap: 16 }}>
      <Input
        label="Email"
        icon={Mail}
        placeholder="you@example.com"
        value={val1}
        onChangeText={setVal1}
      />
      <Input
        label="Password"
        icon={Lock}
        placeholder="Enter password"
        secureTextEntry
        value={val2}
        onChangeText={setVal2}
      />
      <Input
        label="With Error"
        placeholder="Invalid field"
        error="This field is required"
        value={val3}
        onChangeText={setVal3}
      />
    </View>
  );
}

function InputOTPPreview() {
  const [otp, setOtp] = useState('482910');
  return (
    <View style={{ gap: 16, alignItems: 'center' }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>6-DIGIT VERIFICATION CODE</Text>
      <InputOTP length={6} value={otp} onChangeText={setOtp} />
    </View>
  );
}

function CheckboxPreview() {
  const [checked1, setChecked1] = useState(true);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);

  return (
    <View style={{ gap: 14 }}>
      <Checkbox
        checked={checked1}
        onCheckedChange={setChecked1}
        label="Accept Terms and Conditions"
      />
      <Checkbox
        checked={checked2}
        onCheckedChange={setChecked2}
        label="Subscribe to weekly product updates"
      />
      <Checkbox
        checked={checked3}
        onCheckedChange={setChecked3}
        disabled
        label="Disabled Checkbox option"
      />
    </View>
  );
}

function SwitchPreview() {
  const [s1, setS1] = useState(true);
  const [s2, setS2] = useState(false);

  return (
    <View style={{ gap: 16 }}>
      <Switch
        value={s1}
        onValueChange={setS1}
        label="Push Notifications"
      />
      <Switch
        value={s2}
        onValueChange={setS2}
        label="Biometric Face ID Lock"
      />
    </View>
  );
}

function RadioPreview() {
  const [selected, setSelected] = useState('monthly');
  const options: RadioOption[] = [
    { label: 'Monthly Plan ($12/mo)', value: 'monthly' },
    { label: 'Annual Plan ($99/yr - Save 30%)', value: 'annual' },
    { label: 'Lifetime Access ($299)', value: 'lifetime', disabled: true },
  ];
  return (
    <View style={{ gap: 12 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>BILLING CYCLE</Text>
      <RadioGroup options={options} value={selected} onValueChange={setSelected} />
    </View>
  );
}

function TogglePreview() {
  const [pressed, setPressed] = useState(false);
  const [format, setFormat] = useState('bold');

  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>STANDALONE TOGGLE</Text>
      <Toggle pressed={pressed} onPressedChange={setPressed}>
        <Text>{pressed ? 'Active State' : 'Inactive State'}</Text>
      </Toggle>

      <Text variant="caption" style={{ fontWeight: '600', marginTop: 8 }}>TOGGLE GROUP</Text>
      <ToggleGroup>
        <Toggle pressed={format === 'bold'} onPressedChange={() => setFormat('bold')}><Bold size={16} /></Toggle>
        <Toggle pressed={format === 'italic'} onPressedChange={() => setFormat('italic')}><Italic size={16} /></Toggle>
        <Toggle pressed={format === 'underline'} onPressedChange={() => setFormat('underline')}><Underline size={16} /></Toggle>
      </ToggleGroup>
    </View>
  );
}

function SearchbarPreview() {
  const [search, setSearch] = useState('');
  return (
    <View style={{ gap: 12 }}>
      <SearchBar
        placeholder="Search components, tokens, icons..."
        value={search}
        onChangeText={setSearch}
      />
    </View>
  );
}

function ComboboxPreview() {
  const [val, setVal] = useState<OptionType | null>({ label: 'React Native', value: 'react-native' });
  return (
    <View style={{ gap: 12 }}>
      <Combobox value={val} onValueChange={setVal}>
        <ComboboxTrigger>
          <ComboboxValue placeholder="Select Framework" />
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search frameworks..." />
          <ComboboxList>
            <ComboboxItem value="react-native">React Native</ComboboxItem>
            <ComboboxItem value="expo">Expo Router</ComboboxItem>
            <ComboboxItem value="typescript">TypeScript</ComboboxItem>
            <ComboboxItem value="supabase">Supabase</ComboboxItem>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </View>
  );
}

function PickerPreview() {
  const [val, setVal] = useState('us');
  const options = [
    { label: 'United States (+1)', value: 'us' },
    { label: 'United Kingdom (+44)', value: 'uk' },
    { label: 'Germany (+49)', value: 'de' },
    { label: 'Japan (+81)', value: 'jp' },
  ];
  return (
    <View style={{ gap: 12 }}>
      <Picker
        label="Country Code"
        options={options}
        value={val}
        onValueChange={(v) => v && setVal(v)}
      />
    </View>
  );
}

function DatePickerPreview() {
  const [date, setDate] = useState(new Date());
  return (
    <View style={{ gap: 12 }}>
      <DatePicker
        label="Appointment Date"
        value={date}
        onChange={(d) => {
          if (d instanceof Date) setDate(d);
        }}
      />
    </View>
  );
}

function FilePickerPreview() {
  const [files, setFiles] = useState<any[]>([]);
  return (
    <View style={{ gap: 12 }}>
      <FilePicker
        onFilesSelected={setFiles}
        maxFiles={3}
      />
    </View>
  );
}

function MediaPickerPreview() {
  const [media, setMedia] = useState<any[]>([]);
  return (
    <View style={{ gap: 12 }}>
      <MediaPicker
        onSelectionChange={(assets) => setMedia(assets)}
        multiple
      />
    </View>
  );
}

function ColorPickerPreview() {
  const [color, setColor] = useState('#6366f1');
  return (
    <View style={{ gap: 14 }}>
      <ColorPicker value={color} onColorChange={setColor} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: color }} />
        <Text variant="caption" style={{ fontWeight: '600' }}>Active: {color.toUpperCase()}</Text>
      </View>
    </View>
  );
}

function SliderPreview() {
  const [value, setValue] = useState(65);
  return (
    <View style={{ gap: 16 }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>VOLUME LEVEL: {value}%</Text>
      <Slider value={value} onValueChange={setValue} min={0} max={100} />
    </View>
  );
}

/* =========================================================================
   3. FEEDBACK & STATUS
   ========================================================================= */

function AlertPreview() {
  return (
    <View style={{ gap: 12 }}>
      <Alert variant="default">
        <AlertTitle>Order Dispatched</AlertTitle>
        <AlertDescription>Your package is in transit and will arrive by tomorrow 4 PM.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Security Warning</AlertTitle>
        <AlertDescription>Your API key has expired. Please generate a new key in settings.</AlertDescription>
      </Alert>
    </View>
  );
}

function AlertDialogPreview() {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ gap: 12 }}>
      <Button variant="destructive" onPress={() => setOpen(true)}>
        Open Alert Dialog
      </Button>
      <AlertDialog
        isVisible={open}
        onClose={() => setOpen(false)}
        title="Delete Deployment?"
        description="This action cannot be undone. This will permanently delete your cluster."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={() => setOpen(false)}
      />
    </View>
  );
}

function ToastPreview() {
  const toast = useToast();
  return (
    <View style={{ gap: 10 }}>
      <Button
        variant="default"
        onPress={() => toast.success('Profile Updated', 'Your profile details have been saved.')}
      >
        Trigger Success Toast
      </Button>
      <Button
        variant="destructive"
        onPress={() => toast.error('Payment Failed', 'Card was declined by issuing bank.')}
      >
        Trigger Error Toast
      </Button>
    </View>
  );
}

function SpinnerPreview() {
  return (
    <View style={{ gap: 20, alignItems: 'center' }}>
      <Text variant="caption" style={{ fontWeight: '600' }}>SPINNER SIZES</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
        <Spinner size="sm" />
        <Spinner size="default" />
        <Spinner size="lg" />
      </View>
    </View>
  );
}

function ProgressPreview() {
  const [val, setVal] = useState(68);
  return (
    <View style={{ gap: 14 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text variant="caption" style={{ fontWeight: '600' }}>UPLOADING ASSETS</Text>
        <Text variant="caption" style={{ fontWeight: '600' }}>{val}%</Text>
      </View>
      <Progress value={val} />
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
        <Button size="sm" variant="outline" onPress={() => setVal(Math.max(0, val - 15))}>-15%</Button>
        <Button size="sm" variant="outline" onPress={() => setVal(Math.min(100, val + 15))}>+15%</Button>
      </View>
    </View>
  );
}

function SkeletonPreview() {
  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Skeleton style={{ width: 48, height: 48, borderRadius: 24 }} />
        <View style={{ flex: 1, gap: 6 }}>
          <Skeleton style={{ width: '60%', height: 16, borderRadius: 4 }} />
          <Skeleton style={{ width: '40%', height: 12, borderRadius: 4 }} />
        </View>
      </View>
      <Skeleton style={{ width: '100%', height: 80, borderRadius: 12, marginTop: 8 }} />
    </View>
  );
}

/* =========================================================================
   4. LAYOUT & STRUCTURE
   ========================================================================= */

function CardPreview() {
  return (
    <View style={{ gap: 16 }}>
      <Card>
        <CardHeader>
          <CardTitle>Cloud Cluster PRO</CardTitle>
          <CardDescription>Managed Kubernetes in us-east-1 with high availability.</CardDescription>
        </CardHeader>
        <CardContent>
          <Text variant="body">
            Cards group related content, actions, and media in a unified elevated surface.
          </Text>
        </CardContent>
        <CardFooter style={{ justifyContent: 'flex-end', gap: 8 }}>
          <Button size="sm" variant="outline">Docs</Button>
          <Button size="sm" variant="default">Upgrade</Button>
        </CardFooter>
      </Card>
    </View>
  );
}

function AccordionPreview() {
  return (
    <View style={{ gap: 8 }}>
      <Accordion>
        <AccordionItem title="What is BNA UI?">
          <Text variant="body">
            BNA UI is an open-code mobile design system built with Expo, React Native, and TypeScript.
          </Text>
        </AccordionItem>
        <AccordionItem title="How does copy-paste work?">
          <Text variant="body">
            You own the component source code. Copy the files directly into your project and customize freely.
          </Text>
        </AccordionItem>
      </Accordion>
    </View>
  );
}

function CollapsiblePreview() {
  return (
    <View style={{ gap: 10 }}>
      <Collapsible title="Advanced Configuration">
        <View style={{ padding: 12, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.04)', gap: 4 }}>
          <Text variant="caption">SSL Encryption: Enabled</Text>
          <Text variant="caption">HTTP/3 QUIC: Enabled</Text>
          <Text variant="caption">Edge Caching: 300s TTL</Text>
        </View>
      </Collapsible>
    </View>
  );
}

function SheetPreview() {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ gap: 12 }}>
      <Button variant="default" onPress={() => setOpen(true)}>Open Side Sheet</Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <View style={{ gap: 16, padding: 20 }}>
          <Text variant="title">Sidebar Navigation</Text>
          <Text variant="body">Configure filter preferences and navigation options.</Text>
          <Button variant="default" onPress={() => setOpen(false)}>Apply Filters</Button>
        </View>
      </Sheet>
    </View>
  );
}

function BottomSheetPreview() {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ gap: 12 }}>
      <Button variant="default" onPress={() => setOpen(true)}>Open Bottom Sheet</Button>
      <BottomSheet isVisible={open} onClose={() => setOpen(false)} title="Quick Actions">
        <View style={{ gap: 12, paddingVertical: 12 }}>
          <Button variant="outline">Share Link</Button>
          <Button variant="outline">Add to Favorites</Button>
          <Button variant="destructive" onPress={() => setOpen(false)}>Close Sheet</Button>
        </View>
      </BottomSheet>
    </View>
  );
}

function ActionSheetPreview() {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ gap: 12 }}>
      <Button variant="default" onPress={() => setOpen(true)}>Show Action Sheet</Button>
      <ActionSheet
        visible={open}
        onClose={() => setOpen(false)}
        title="Photo Options"
        options={[
          { title: 'Take Photo', onPress: () => setOpen(false) },
          { title: 'Choose from Library', onPress: () => setOpen(false) },
        ]}
      />
    </View>
  );
}

function ScrollViewPreview() {
  return (
    <View style={{ height: 160 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 8 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View key={i} style={{ padding: 12, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.03)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' }}>
              <Text variant="body">Scroll item #{i}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function AvoidKeyboardPreview() {
  return (
    <View style={{ gap: 12 }}>
      <Input label="Chat Message" placeholder="Type a message..." />
      <AvoidKeyboard offset={10} />
      <Text variant="caption" style={{ opacity: 0.7 }}>Automatically shifts content smoothly above native keyboard.</Text>
    </View>
  );
}

function ParallaxScrollViewPreview() {
  return (
    <View style={{ gap: 12 }}>
      <Text variant="body" style={{ fontWeight: '600' }}>Parallax Header ScrollView</Text>
      <Text variant="caption" style={{ opacity: 0.7 }}>Smooth scaling and translation header effects on scroll.</Text>
    </View>
  );
}

function OnboardingPreview() {
  const steps = [
    { id: '1', title: 'Welcome to Amoga', description: 'Modern React Native design system components.' },
    { id: '2', title: 'Copy & Paste', description: 'Fully customizable, typed, open-code components.' },
    { id: '3', title: 'Ready to Ship', description: 'Build stunning cross-platform mobile apps in record time.' },
  ];
  return (
    <View style={{ gap: 12 }}>
      <Onboarding steps={steps} onComplete={() => {}} />
    </View>
  );
}

/* =========================================================================
   5. DISPLAY & OVERLAYS
   ========================================================================= */

function TooltipPreview() {
  return (
    <View style={{ gap: 16 }}>
      <Tooltip content="Verified encrypted connection">
        <Button variant="outline" icon={HelpCircle}>Hover / Tap for Hint</Button>
      </Tooltip>
    </View>
  );
}

function PopoverPreview() {
  return (
    <View style={{ gap: 12 }}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open Context Popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <View style={{ gap: 6, width: 200, padding: 8 }}>
            <Text variant="caption" style={{ fontWeight: '700' }}>Popover Actions</Text>
            <Text variant="caption">Floating contextual information layer.</Text>
          </View>
        </PopoverContent>
      </Popover>
    </View>
  );
}

function TablePreview() {
  const columns: TableColumn[] = [
    { id: 'invoice', header: 'Invoice', accessorKey: 'invoice' },
    { id: 'status', header: 'Status', accessorKey: 'status' },
    { id: 'amount', header: 'Amount', accessorKey: 'amount' },
  ];
  const data = [
    { invoice: 'INV-001', status: 'Paid', amount: '$250.00' },
    { invoice: 'INV-002', status: 'Pending', amount: '$150.00' },
    { invoice: 'INV-003', status: 'Completed', amount: '$420.00' },
  ];
  return (
    <View style={{ gap: 12 }}>
      <Table data={data} columns={columns} />
    </View>
  );
}

function TabsPreview() {
  return (
    <View style={{ gap: 12 }}>
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Text variant="body" style={{ marginTop: 8 }}>Manage your profile information and email address.</Text>
        </TabsContent>
        <TabsContent value="password">
          <Text variant="body" style={{ marginTop: 8 }}>Change password and configure two-factor authentication.</Text>
        </TabsContent>
      </Tabs>
    </View>
  );
}

function CarouselPreview() {
  return (
    <View style={{ gap: 12 }}>
      <Carousel showIndicators showArrows>
        <View style={{ height: 120, backgroundColor: '#3b82f6', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Slide 1: Telemetry</Text>
        </View>
        <View style={{ height: 120, backgroundColor: '#10b981', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Slide 2: Security</Text>
        </View>
        <View style={{ height: 120, backgroundColor: '#8b5cf6', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Slide 3: Performance</Text>
        </View>
      </Carousel>
    </View>
  );
}

function ModeTogglePreview() {
  return (
    <View style={{ gap: 12, alignItems: 'center' }}>
      <ModeToggle />
    </View>
  );
}

function SharePreview() {
  return (
    <View style={{ gap: 12 }}>
      <ShareButton
        content={{
          title: 'Check out BNA UI',
          message: 'A comprehensive open-code mobile UI system for Expo and React Native!',
          url: 'https://ui.ahmedbna.com',
        }}
      >
        <Button variant="default">Share App</Button>
      </ShareButton>
    </View>
  );
}

/* =========================================================================
   6. MEDIA & AUDIO/VIDEO
   ========================================================================= */

function AudioPlayerPreview() {
  return (
    <View style={{ gap: 12 }}>
      <AudioPlayer
        source={{ uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }}
        showControls
        showWaveform
      />
    </View>
  );
}

function AudioRecorderPreview() {
  return (
    <View style={{ gap: 12 }}>
      <AudioRecorder onRecordingComplete={() => {}} />
    </View>
  );
}

function AudioWaveformPreview() {
  return (
    <View style={{ gap: 12 }}>
      <AudioWaveform progress={0.45} />
    </View>
  );
}

function VideoPreview() {
  return (
    <View style={{ gap: 12 }}>
      <Video
        source={{ uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
        style={{ width: '100%', height: 180, borderRadius: 12 }}
        nativeControls
      />
    </View>
  );
}

function GalleryPreview() {
  const items = [
    { id: '1', uri: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400', title: 'Abstract' },
    { id: '2', uri: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400', title: 'Vibrant' },
    { id: '3', uri: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400', title: 'Patterns' },
  ];
  return (
    <View style={{ gap: 12 }}>
      <Gallery items={items} columns={3} />
    </View>
  );
}

function CameraPreview() {
  return (
    <View style={{ gap: 12, padding: 16, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.04)', alignItems: 'center' }}>
      <CameraIcon size={32} color="#6366f1" />
      <Text variant="body" style={{ fontWeight: '600' }}>Camera Component</Text>
      <Text variant="caption" style={{ opacity: 0.7 }}>Captures photos/videos with zoom, flash, and aspect ratio controls.</Text>
    </View>
  );
}

function CameraPreviewPreview() {
  return (
    <View style={{ gap: 12, padding: 16, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.04)', alignItems: 'center' }}>
      <CameraIcon size={32} color="#10b981" />
      <Text variant="body" style={{ fontWeight: '600' }}>Camera Preview</Text>
      <Text variant="caption" style={{ opacity: 0.7 }}>Full screen viewfinder with capture controls and media gallery preview.</Text>
    </View>
  );
}

/* =========================================================================
   7. CHARTS (18 COMPREHENSIVE CHARTS)
   ========================================================================= */

function ChartContainerPreview() {
  return (
    <ChartContainer title="System Metrics" description="Weekly telemetry breakdown">
      <BarChart
        data={[
          { label: 'Mon', value: 45 },
          { label: 'Tue', value: 72 },
          { label: 'Wed', value: 60 },
        ]}
        width={280}
        height={160}
      />
    </ChartContainer>
  );
}

function BarChartPreview() {
  const data = [
    { label: 'Jan', value: 42 },
    { label: 'Feb', value: 68 },
    { label: 'Mar', value: 85 },
    { label: 'Apr', value: 55 },
    { label: 'May', value: 92 },
  ];
  return (
    <ChartContainer title="Monthly Revenue ($K)">
      <BarChart data={data} width={300} height={180} />
    </ChartContainer>
  );
}

function LineChartPreview() {
  const data = [
    { label: 'W1', value: 20 },
    { label: 'W2', value: 45 },
    { label: 'W3', value: 38 },
    { label: 'W4', value: 75 },
    { label: 'W5', value: 90 },
  ];
  return (
    <ChartContainer title="User Engagement Growth">
      <LineChart data={data} width={300} height={180} />
    </ChartContainer>
  );
}

function AreaChartPreview() {
  const data = [
    { label: 'Q1', value: 120 },
    { label: 'Q2', value: 240 },
    { label: 'Q3', value: 380 },
    { label: 'Q4', value: 510 },
  ];
  return (
    <ChartContainer title="Data Volume (GB)">
      <AreaChart data={data} width={300} height={180} />
    </ChartContainer>
  );
}

function PieChartPreview() {
  const data = [
    { label: 'iOS', value: 55, color: '#6366f1' },
    { label: 'Android', value: 35, color: '#10b981' },
    { label: 'Web', value: 10, color: '#f59e0b' },
  ];
  return (
    <ChartContainer title="Platform Share">
      <PieChart data={data} size={180} />
    </ChartContainer>
  );
}

function DoughnutChartPreview() {
  const data = [
    { label: 'Direct', value: 45, color: '#3b82f6' },
    { label: 'Referral', value: 30, color: '#10b981' },
    { label: 'Social', value: 25, color: '#ec4899' },
  ];
  return (
    <ChartContainer title="Acquisition Channels">
      <DoughnutChart data={data} />
    </ChartContainer>
  );
}

function ProgressRingChartPreview() {
  const data = [
    { label: 'Move', value: 85, color: '#ef4444' },
    { label: 'Exercise', value: 65, color: '#10b981' },
    { label: 'Stand', value: 92, color: '#3b82f6' },
  ];
  return (
    <ChartContainer title="Daily Fitness Rings">
      <ProgressRingChart data={data} size={180} />
    </ChartContainer>
  );
}

function RadialBarChartPreview() {
  const data = [
    { label: 'CPU', value: 78, color: '#f43f5e' },
    { label: 'Memory', value: 62, color: '#8b5cf6' },
    { label: 'Storage', value: 45, color: '#06b6d4' },
  ];
  return (
    <ChartContainer title="Resource Utilization">
      <RadialBarChart data={data} />
    </ChartContainer>
  );
}

function ColumnChartPreview() {
  const data = [
    { label: '2022', value: 320, color: '#3b82f6' },
    { label: '2023', value: 480, color: '#10b981' },
    { label: '2024', value: 640, color: '#8b5cf6' },
  ];
  return (
    <ChartContainer title="Annual Shipments">
      <ColumnChart data={data} />
    </ChartContainer>
  );
}

function BubbleChartPreview() {
  const data = [
    { x: 10, y: 30, size: 15, label: 'Alpha' },
    { x: 25, y: 60, size: 25, label: 'Beta' },
    { x: 45, y: 80, size: 20, label: 'Gamma' },
  ];
  return (
    <ChartContainer title="Market Dispersion">
      <BubbleChart data={data} />
    </ChartContainer>
  );
}

function CandlestickChartPreview() {
  const data = [
    { date: 'Mon', open: 120, high: 135, low: 115, close: 130 },
    { date: 'Tue', open: 130, high: 140, low: 125, close: 128 },
    { date: 'Wed', open: 128, high: 145, low: 126, close: 142 },
  ];
  return (
    <ChartContainer title="Asset Price Action">
      <CandlestickChart data={data} />
    </ChartContainer>
  );
}

function HeatmapChartPreview() {
  const data = [
    { row: 'Mon', col: 'Morning', value: 40 },
    { row: 'Mon', col: 'Afternoon', value: 75 },
    { row: 'Tue', col: 'Morning', value: 60 },
    { row: 'Tue', col: 'Afternoon', value: 90 },
  ];
  return (
    <ChartContainer title="Activity Intensity Matrix">
      <HeatmapChart data={data} />
    </ChartContainer>
  );
}

function PolarAreaChartPreview() {
  const data = [
    { label: 'DevOps', value: 80, color: '#3b82f6' },
    { label: 'Frontend', value: 95, color: '#10b981' },
    { label: 'Backend', value: 85, color: '#8b5cf6' },
    { label: 'Design', value: 70, color: '#f59e0b' },
  ];
  return (
    <ChartContainer title="Team Capabilities">
      <PolarAreaChart data={data} />
    </ChartContainer>
  );
}

function RadarChartPreview() {
  const data = [
    { label: 'Speed', value: 90 },
    { label: 'Reliability', value: 85 },
    { label: 'Security', value: 95 },
    { label: 'Usability', value: 88 },
    { label: 'Scalability', value: 92 },
  ];
  return (
    <ChartContainer title="System Radar Evaluation">
      <RadarChart data={data} />
    </ChartContainer>
  );
}

function ScatterChartPreview() {
  const data = [
    { x: 5, y: 10 },
    { x: 15, y: 30 },
    { x: 25, y: 55 },
  ];
  return (
    <ChartContainer title="Correlation Matrix">
      <ScatterChart data={data} />
    </ChartContainer>
  );
}

function StackedAreaChartPreview() {
  const data = [
    { x: 1, y: [20, 30], label: 'Jan' },
    { x: 2, y: [35, 45], label: 'Feb' },
  ];
  return (
    <ChartContainer title="Traffic Split by Source">
      <StackedAreaChart data={data} categories={['Organic', 'Paid']} />
    </ChartContainer>
  );
}

function StackedBarChartPreview() {
  const data = [
    { label: 'Q1', values: [30, 20] },
    { label: 'Q2', values: [45, 30] },
  ];
  return (
    <ChartContainer title="Channel Revenue Breakdown">
      <StackedBarChart data={data} categories={['Direct', 'Partner']} />
    </ChartContainer>
  );
}

function TreemapChartPreview() {
  const data = [
    { label: 'Engine', value: 300, color: '#3b82f6' },
    { label: 'UI', value: 200, color: '#10b981' },
  ];
  return (
    <ChartContainer title="Bundle Size Treemap">
      <TreemapChart data={data} />
    </ChartContainer>
  );
}

/* =========================================================================
   COMPONENTS REGISTRY CATALOG
   ========================================================================= */

export const DESIGN_SYSTEM_COMPONENTS: ComponentItem[] = [
  // 1. PRIMITIVES
  {
    id: 'button',
    name: 'Button',
    file: 'button.tsx',
    category: 'Primitives',
    tag: 'BUTTON',
    description: 'Versatile button with multiple variants, sizes, and interactive animations.',
    Preview: ButtonPreview,
    codeSnippet: `import { Button } from '../ui/button';

export function Example() {
  return <Button variant="default">Click Me</Button>;
}`,
  },
  {
    id: 'badge',
    name: 'Badge',
    file: 'badge.tsx',
    category: 'Primitives',
    tag: 'BADGE',
    description: 'A small status descriptor for UI elements with color indicators.',
    Preview: BadgePreview,
    codeSnippet: `import { Badge } from '../ui/badge';

export function Example() {
  return <Badge variant="success">Active</Badge>;
}`,
  },
  {
    id: 'avatar',
    name: 'Avatar',
    file: 'avatar.tsx',
    category: 'Primitives',
    tag: 'AVATAR',
    description: 'An image element with initials fallback for representing user profiles.',
    Preview: AvatarPreview,
    codeSnippet: `import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

export function Example() {
  return (
    <Avatar size={48}>
      <AvatarImage source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }} />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  );
}`,
  },
  {
    id: 'icon',
    name: 'Icon',
    file: 'icon.tsx',
    category: 'Primitives',
    tag: 'ICON',
    description: 'Themed icon component with support for Lucide React Native icons.',
    Preview: IconPreview,
    codeSnippet: `import { Icon } from '../ui/icon';
import { Heart } from 'lucide-react-native';

export function Example() {
  return <Icon name={Heart} size={24} color="#ef4444" />;
}`,
  },
  {
    id: 'image',
    name: 'Image',
    file: 'image.tsx',
    category: 'Primitives',
    tag: 'IMAGE',
    description: 'Responsive image component with loading states and error handling.',
    Preview: ImagePreview,
    codeSnippet: `import { Image } from '../ui/image';

export function Example() {
  return <Image source={{ uri: 'https://example.com/hero.jpg' }} style={{ width: '100%', height: 200 }} />;
}`,
  },
  {
    id: 'text',
    name: 'Text',
    file: 'text.tsx',
    category: 'Primitives',
    tag: 'TEXT',
    description: 'Typography component with preconfigured headings, weights, and color tokens.',
    Preview: TextPreview,
    codeSnippet: `import { Text } from '../ui/text';

export function Example() {
  return <Text variant="title">Heading Text</Text>;
}`,
  },
  {
    id: 'view',
    name: 'View',
    file: 'view.tsx',
    category: 'Primitives',
    tag: 'VIEW',
    description: 'Foundational View component with theme tokens and ref forwarding.',
    Preview: ViewPreview,
    codeSnippet: `import { View } from '../ui/view';

export function Example() {
  return <View style={{ padding: 16 }}>Container</View>;
}`,
  },
  {
    id: 'hello-wave',
    name: 'Hello Wave',
    file: 'hello-wave.tsx',
    category: 'Primitives',
    tag: 'HELLO WAVE',
    description: 'Animated waving hand emoji with smooth rotation animation.',
    Preview: HelloWavePreview,
    codeSnippet: `import { HelloWave } from '../ui/hello-wave';

export function Example() {
  return <HelloWave />;
}`,
  },
  {
    id: 'link',
    name: 'Link',
    file: 'link.tsx',
    category: 'Primitives',
    tag: 'LINK',
    description: 'Accessible navigation link for internal and external URLs.',
    Preview: LinkPreview,
    codeSnippet: `import { Link } from '../ui/link';

export function Example() {
  return <Link href="https://ui.ahmedbna.com">Visit Documentation</Link>;
}`,
  },
  {
    id: 'separator',
    name: 'Separator',
    file: 'separator.tsx',
    category: 'Primitives',
    tag: 'SEPARATOR',
    description: 'Subtle divider lines to delineate sections and content blocks.',
    Preview: SeparatorPreview,
    codeSnippet: `import { Separator } from '../ui/separator';

export function Example() {
  return <Separator style={{ marginVertical: 16 }} />;
}`,
  },

  // 2. INPUTS & FORMS
  {
    id: 'input',
    name: 'Input',
    file: 'input.tsx',
    category: 'Inputs',
    tag: 'INPUT',
    description: 'Styled text input component with labels, validation errors, and icon slots.',
    Preview: InputPreview,
    codeSnippet: `import { Input } from '../ui/input';

export function Example() {
  const [value, setValue] = useState('');
  return <Input label="Email" placeholder="you@example.com" value={value} onChangeText={setValue} />;
}`,
  },
  {
    id: 'input-otp',
    name: 'Input OTP',
    file: 'input-otp.tsx',
    category: 'Inputs',
    tag: 'INPUT OTP',
    description: 'Secure segmented verification pin input for one-time passwords.',
    Preview: InputOTPPreview,
    codeSnippet: `import { InputOTP } from '../ui/input-otp';

export function Example() {
  const [otp, setOtp] = useState('');
  return <InputOTP length={6} value={otp} onChangeText={setOtp} />;
}`,
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    file: 'checkbox.tsx',
    category: 'Inputs',
    tag: 'CHECKBOX',
    description: 'Accessible toggle for boolean values and multi-select lists.',
    Preview: CheckboxPreview,
    codeSnippet: `import { Checkbox } from '../ui/checkbox';

export function Example() {
  const [checked, setChecked] = useState(false);
  return <Checkbox checked={checked} onCheckedChange={setChecked} label="Agree to Terms" />;
}`,
  },
  {
    id: 'switch',
    name: 'Switch',
    file: 'switch.tsx',
    category: 'Inputs',
    tag: 'SWITCH',
    description: 'Smooth toggle switch for switching settings and binary preferences.',
    Preview: SwitchPreview,
    codeSnippet: `import { Switch } from '../ui/switch';

export function Example() {
  const [val, setVal] = useState(true);
  return <Switch value={val} onValueChange={setVal} label="Enable Notifications" />;
}`,
  },
  {
    id: 'radio',
    name: 'Radio Group',
    file: 'radio.tsx',
    category: 'Inputs',
    tag: 'RADIO',
    description: 'Set of checkable radio buttons where only one option can be selected.',
    Preview: RadioPreview,
    codeSnippet: `import { RadioGroup } from '../ui/radio';

export function Example() {
  const [val, setVal] = useState('monthly');
  return (
    <RadioGroup
      options={[{ label: 'Monthly', value: 'monthly' }]}
      value={val}
      onValueChange={setVal}
    />
  );
}`,
  },
  {
    id: 'toggle',
    name: 'Toggle & Group',
    file: 'toggle.tsx',
    category: 'Inputs',
    tag: 'TOGGLE',
    description: 'Two-state button and multi-button segmented groups.',
    Preview: TogglePreview,
    codeSnippet: `import { Toggle, ToggleGroup } from '../ui/toggle';

export function Example() {
  const [active, setActive] = useState(false);
  return <Toggle pressed={active} onPressedChange={setActive}>Toggle Me</Toggle>;
}`,
  },
  {
    id: 'searchbar',
    name: 'Searchbar',
    file: 'searchbar.tsx',
    category: 'Inputs',
    tag: 'SEARCHBAR',
    description: 'Customizable search input with debouncing and clear action.',
    Preview: SearchbarPreview,
    codeSnippet: `import { SearchBar } from '../ui/searchbar';

export function Example() {
  const [q, setQ] = useState('');
  return <SearchBar placeholder="Search..." value={q} onChangeText={setQ} />;
}`,
  },
  {
    id: 'combobox',
    name: 'Combobox',
    file: 'combobox.tsx',
    category: 'Inputs',
    tag: 'COMBOBOX',
    description: 'Searchable dropdown combining an input with a searchable list of items.',
    Preview: ComboboxPreview,
    codeSnippet: `import { Combobox } from '../ui/combobox';

export function Example() {
  const [item, setItem] = useState('');
  return <Combobox items={[{ label: 'Option 1', value: '1' }]} value={item} onValueChange={setItem} />;
}`,
  },
  {
    id: 'picker',
    name: 'Picker',
    file: 'picker.tsx',
    category: 'Inputs',
    tag: 'PICKER',
    description: 'Dropdown selection menu with search and section support.',
    Preview: PickerPreview,
    codeSnippet: `import { Picker } from '../ui/picker';

export function Example() {
  const [val, setVal] = useState('');
  return <Picker options={[{ label: 'A', value: 'a' }]} value={val} onValueChange={setVal} />;
}`,
  },
  {
    id: 'date-picker',
    name: 'Date Picker',
    file: 'date-picker.tsx',
    category: 'Inputs',
    tag: 'DATE PICKER',
    description: 'Date and time selection sheet with calendar and time wheel.',
    Preview: DatePickerPreview,
    codeSnippet: `import { DatePicker } from '../ui/date-picker';

export function Example() {
  const [date, setDate] = useState(new Date());
  return <DatePicker label="Select Date" value={date} onChange={setDate} />;
}`,
  },
  {
    id: 'file-picker',
    name: 'File Picker',
    file: 'file-picker.tsx',
    category: 'Inputs',
    tag: 'FILE PICKER',
    description: 'Upload files and documents with validation and size checks.',
    Preview: FilePickerPreview,
    codeSnippet: `import { FilePicker } from '../ui/file-picker';

export function Example() {
  return <FilePicker onFilesSelected={(files) => console.log(files)} />;
}`,
  },
  {
    id: 'media-picker',
    name: 'Media Picker',
    file: 'media-picker.tsx',
    category: 'Inputs',
    tag: 'MEDIA PICKER',
    description: 'Select images and videos from device gallery or camera.',
    Preview: MediaPickerPreview,
    codeSnippet: `import { MediaPicker } from '../ui/media-picker';

export function Example() {
  return <MediaPicker onSelectionChange={(media) => console.log(media)} />;
}`,
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    file: 'color-picker.tsx',
    category: 'Inputs',
    tag: 'COLOR PICKER',
    description: 'HSV visual color palette and swatch selector.',
    Preview: ColorPickerPreview,
    codeSnippet: `import { ColorPicker } from '../ui/color-picker';

export function Example() {
  const [color, setColor] = useState('#6366f1');
  return <ColorPicker value={color} onColorChange={setColor} />;
}`,
  },
  {
    id: 'slider',
    name: 'Slider',
    file: 'slider.tsx',
    category: 'Inputs',
    tag: 'SLIDER',
    description: 'Smooth slider control for choosing a value within a numeric range.',
    Preview: SliderPreview,
    codeSnippet: `import { Slider } from '../ui/slider';

export function Example() {
  const [val, setVal] = useState(50);
  return <Slider value={val} onValueChange={setVal} min={0} max={100} />;
}`,
  },

  // 3. FEEDBACK & STATUS
  {
    id: 'alert',
    name: 'Alert',
    file: 'alert.tsx',
    category: 'Feedback',
    tag: 'ALERT',
    description: 'Inline callout messages for status notifications and warnings.',
    Preview: AlertPreview,
    codeSnippet: `import { Alert, AlertTitle, AlertDescription } from '../ui/alert';

export function Example() {
  return (
    <Alert variant="default">
      <AlertTitle>Notification</AlertTitle>
      <AlertDescription>Your file has finished uploading.</AlertDescription>
    </Alert>
  );
}`,
  },
  {
    id: 'alert-dialog',
    name: 'Alert Dialog',
    file: 'alert-dialog.tsx',
    category: 'Feedback',
    tag: 'ALERT DIALOG',
    description: 'Modal confirmation dialog that interrupts the user for critical decisions.',
    Preview: AlertDialogPreview,
    codeSnippet: `import { AlertDialog } from '../ui/alert-dialog';

export function Example() {
  const [open, setOpen] = useState(false);
  return <AlertDialog isVisible={open} onClose={() => setOpen(false)} title="Confirm Action" onConfirm={() => setOpen(false)} />;
}`,
  },
  {
    id: 'toast',
    name: 'Toast Notifications',
    file: 'toast.tsx',
    category: 'Feedback',
    tag: 'TOAST',
    description: 'Floating notification alerts with iOS Dynamic Island animation.',
    Preview: ToastPreview,
    codeSnippet: `import { useToast } from '../ui/toast';

export function Example() {
  const toast = useToast();
  return <Button onPress={() => toast.success('Saved', 'Changes saved successfully.')}>Show Toast</Button>;
}`,
  },
  {
    id: 'spinner',
    name: 'Spinner & Loader',
    file: 'spinner.tsx',
    category: 'Feedback',
    tag: 'SPINNER',
    description: 'Indicates background activity and asynchronous loading states.',
    Preview: SpinnerPreview,
    codeSnippet: `import { Spinner } from '../ui/spinner';

export function Example() {
  return <Spinner size="default" />;
}`,
  },
  {
    id: 'progress',
    name: 'Progress Bar',
    file: 'progress.tsx',
    category: 'Feedback',
    tag: 'PROGRESS',
    description: 'Animated linear completion bar with smooth width transitions.',
    Preview: ProgressPreview,
    codeSnippet: `import { Progress } from '../ui/progress';

export function Example() {
  return <Progress value={65} />;
}`,
  },
  {
    id: 'skeleton',
    name: 'Skeleton Shimmer',
    file: 'skeleton.tsx',
    category: 'Feedback',
    tag: 'SKELETON',
    description: 'Placeholder shapes representing content during fetching.',
    Preview: SkeletonPreview,
    codeSnippet: `import { Skeleton } from '../ui/skeleton';

export function Example() {
  return <Skeleton style={{ width: '100%', height: 48, borderRadius: 8 }} />;
}`,
  },

  // 4. LAYOUT & STRUCTURE
  {
    id: 'card',
    name: 'Card',
    file: 'card.tsx',
    category: 'Layout',
    tag: 'CARD',
    description: 'Elevated surfaces grouping related headers, contents, and actions.',
    Preview: CardPreview,
    codeSnippet: `import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

export function Example() {
  return (
    <Card>
      <CardHeader><CardTitle>Card Header</CardTitle></CardHeader>
      <CardContent><Text>Card Body Content</Text></CardContent>
    </Card>
  );
}`,
  },
  {
    id: 'accordion',
    name: 'Accordion',
    file: 'accordion.tsx',
    category: 'Layout',
    tag: 'ACCORDION',
    description: 'Collapsible header sections with smooth height animations.',
    Preview: AccordionPreview,
    codeSnippet: `import { Accordion, AccordionItem } from '../ui/accordion';

export function Example() {
  return (
    <Accordion>
      <AccordionItem title="Question 1">Answer 1</AccordionItem>
    </Accordion>
  );
}`,
  },
  {
    id: 'collapsible',
    name: 'Collapsible',
    file: 'collapsible.tsx',
    category: 'Layout',
    tag: 'COLLAPSIBLE',
    description: 'Interactive component which expands and collapses custom content.',
    Preview: CollapsiblePreview,
    codeSnippet: `import { Collapsible } from '../ui/collapsible';

export function Example() {
  return (
    <Collapsible title="Advanced">
      <Text>Expanded Details</Text>
    </Collapsible>
  );
}`,
  },
  {
    id: 'sheet',
    name: 'Sheet',
    file: 'sheet.tsx',
    category: 'Layout',
    tag: 'SHEET',
    description: 'Side modal sheet for navigation drawers and filter settings.',
    Preview: SheetPreview,
    codeSnippet: `import { Sheet } from '../ui/sheet';

export function Example() {
  const [open, setOpen] = useState(false);
  return <Sheet open={open} onOpenChange={setOpen}><Text>Content</Text></Sheet>;
}`,
  },
  {
    id: 'bottom-sheet',
    name: 'Bottom Sheet',
    file: 'bottom-sheet.tsx',
    category: 'Layout',
    tag: 'BOTTOM SHEET',
    description: 'Modal sheet sliding up from bottom with gesture snap points.',
    Preview: BottomSheetPreview,
    codeSnippet: `import { BottomSheet } from '../ui/bottom-sheet';

export function Example() {
  const [open, setOpen] = useState(false);
  return <BottomSheet isVisible={open} onClose={() => setOpen(false)} title="Menu"><Text>Sheet Body</Text></BottomSheet>;
}`,
  },
  {
    id: 'action-sheet',
    name: 'Action Sheet',
    file: 'action-sheet.tsx',
    category: 'Layout',
    tag: 'ACTION SHEET',
    description: 'Native action menu sheet triggered from the bottom of screen.',
    Preview: ActionSheetPreview,
    codeSnippet: `import { ActionSheet } from '../ui/action-sheet';

export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <ActionSheet
      visible={open}
      onClose={() => setOpen(false)}
      title="Options"
      options={[{ title: 'Option 1', onPress: () => {} }]}
    />
  );
}`,
  },
  {
    id: 'scroll-view',
    name: 'Scroll View',
    file: 'scroll-view.tsx',
    category: 'Layout',
    tag: 'SCROLL VIEW',
    description: 'Scrollable container view with indicator controls.',
    Preview: ScrollViewPreview,
    codeSnippet: `import { ScrollView } from '../ui/scroll-view';

export function Example() {
  return <ScrollView><Text>Scrollable Content</Text></ScrollView>;
}`,
  },
  {
    id: 'avoid-keyboard',
    name: 'Avoid Keyboard',
    file: 'avoid-keyboard.tsx',
    category: 'Layout',
    tag: 'AVOID KEYBOARD',
    description: 'Automatically adjusts viewport height to prevent keyboard overlap.',
    Preview: AvoidKeyboardPreview,
    codeSnippet: `import { AvoidKeyboard } from '../ui/avoid-keyboard';

export function Example() {
  return <AvoidKeyboard><Input label="Chat" /></AvoidKeyboard>;
}`,
  },
  {
    id: 'parallax-scrollview',
    name: 'Parallax ScrollView',
    file: 'parallax-scrollview.tsx',
    category: 'Layout',
    tag: 'PARALLAX',
    description: 'Scroll view featuring a rich parallax header image transformation.',
    Preview: ParallaxScrollViewPreview,
    codeSnippet: `import { ParallaxScrollView } from '../ui/parallax-scrollview';

export function Example() {
  return <ParallaxScrollView headerImage={<Image source={{ uri: '...' }} />}><Text>Content</Text></ParallaxScrollView>;
}`,
  },
  {
    id: 'onboarding',
    name: 'Onboarding Flow',
    file: 'onboarding.tsx',
    category: 'Layout',
    tag: 'ONBOARDING',
    description: 'Multi-step welcome flow with animated pagination and skip controls.',
    Preview: OnboardingPreview,
    codeSnippet: `import { Onboarding } from '../ui/onboarding';

export function Example() {
  return <Onboarding steps={[{ id: '1', title: 'Welcome', description: 'Explore the app' }]} onComplete={() => {}} />;
}`,
  },

  // 5. DISPLAY & OVERLAYS
  {
    id: 'tooltip',
    name: 'Tooltip',
    file: 'tooltip.tsx',
    category: 'Display',
    tag: 'TOOLTIP',
    description: 'Contextual overlays with helpful hints on hover or press.',
    Preview: TooltipPreview,
    codeSnippet: `import { Tooltip } from '../ui/tooltip';

export function Example() {
  return <Tooltip content="Hint text"><Button>Hover</Button></Tooltip>;
}`,
  },
  {
    id: 'popover',
    name: 'Popover',
    file: 'popover.tsx',
    category: 'Display',
    tag: 'POPOVER',
    description: 'Floating rich content layer anchored to any interactive trigger.',
    Preview: PopoverPreview,
    codeSnippet: `import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';

export function Example() {
  return (
    <Popover>
      <PopoverTrigger><Button>Open</Button></PopoverTrigger>
      <PopoverContent><Text>Popover content</Text></PopoverContent>
    </Popover>
  );
}`,
  },
  {
    id: 'table',
    name: 'Table',
    file: 'table.tsx',
    category: 'Display',
    tag: 'TABLE',
    description: 'Flexible data table with styled header, rows, and cells.',
    Preview: TablePreview,
    codeSnippet: `import { Table } from '../ui/table';

export function Example() {
  return <Table data={[{ id: '1', name: 'Item' }]} columns={[{ id: 'name', header: 'Name', accessorKey: 'name' }]} />;
}`,
  },
  {
    id: 'tabs',
    name: 'Tabs',
    file: 'tabs.tsx',
    category: 'Display',
    tag: 'TABS',
    description: 'Segmented content views with animated indicators.',
    Preview: TabsPreview,
    codeSnippet: `import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

export function Example() {
  return (
    <Tabs defaultValue="tab1">
      <TabsList><TabsTrigger value="tab1">Tab 1</TabsTrigger></TabsList>
      <TabsContent value="tab1"><Text>Tab Content</Text></TabsContent>
    </Tabs>
  );
}`,
  },
  {
    id: 'carousel',
    name: 'Carousel',
    file: 'carousel.tsx',
    category: 'Display',
    tag: 'CAROUSEL',
    description: 'Sliding carousel banner with indicators and gestures.',
    Preview: CarouselPreview,
    codeSnippet: `import { Carousel } from '../ui/carousel';

export function Example() {
  return <Carousel showIndicators><View><Text>Slide 1</Text></View></Carousel>;
}`,
  },
  {
    id: 'mode-toggle',
    name: 'Mode Toggle',
    file: 'mode-toggle.tsx',
    category: 'Display',
    tag: 'THEME',
    description: 'Switch between light, dark, and system themes.',
    Preview: ModeTogglePreview,
    codeSnippet: `import { ModeToggle } from '../ui/mode-toggle';

export function Example() {
  return <ModeToggle />;
}`,
  },
  {
    id: 'share',
    name: 'Share',
    file: 'share.tsx',
    category: 'Display',
    tag: 'SHARE',
    description: 'Triggers platform native share sheet with custom links and messages.',
    Preview: SharePreview,
    codeSnippet: `import { ShareButton } from '../ui/share';

export function Example() {
  return <ShareButton message="Check out BNA UI" url="https://ui.ahmedbna.com"><Button>Share</Button></ShareButton>;
}`,
  },

  // 6. MEDIA & AUDIO/VIDEO
  {
    id: 'audio-player',
    name: 'Audio Player',
    file: 'audio-player.tsx',
    category: 'Media',
    tag: 'AUDIO PLAYER',
    description: 'Full audio player with scrubber, time duration, and track info.',
    Preview: AudioPlayerPreview,
    codeSnippet: `import { AudioPlayer } from '../ui/audio-player';

export function Example() {
  return <AudioPlayer source={{ uri: 'https://example.com/audio.mp3' }} showControls />;
}`,
  },
  {
    id: 'audio-recorder',
    name: 'Audio Recorder',
    file: 'audio-recorder.tsx',
    category: 'Media',
    tag: 'AUDIO RECORDER',
    description: 'Records audio with visual waveform feedback and playback.',
    Preview: AudioRecorderPreview,
    codeSnippet: `import { AudioRecorder } from '../ui/audio-recorder';

export function Example() {
  return <AudioRecorder onRecordingComplete={(uri) => console.log(uri)} />;
}`,
  },
  {
    id: 'audio-waveform',
    name: 'Audio Waveform',
    file: 'audio-waveform.tsx',
    category: 'Media',
    tag: 'WAVEFORM',
    description: 'Animated sound waveform visualization with scrubber position.',
    Preview: AudioWaveformPreview,
    codeSnippet: `import { AudioWaveform } from '../ui/audio-waveform';

export function Example() {
  return <AudioWaveform progress={0.5} />;
}`,
  },
  {
    id: 'video',
    name: 'Video Player',
    file: 'video.tsx',
    category: 'Media',
    tag: 'VIDEO',
    description: 'Full-featured video player with native playback controls.',
    Preview: VideoPreview,
    codeSnippet: `import { Video } from '../ui/video';

export function Example() {
  return <Video source={{ uri: 'https://example.com/video.mp4' }} style={{ height: 200 }} nativeControls />;
}`,
  },
  {
    id: 'gallery',
    name: 'Gallery',
    file: 'gallery.tsx',
    category: 'Media',
    tag: 'GALLERY',
    description: 'Responsive multi-image gallery with modal zoom viewer.',
    Preview: GalleryPreview,
    codeSnippet: `import { Gallery } from '../ui/gallery';

export function Example() {
  return <Gallery items={[{ id: '1', uri: 'https://example.com/photo.jpg' }]} columns={3} />;
}`,
  },
  {
    id: 'camera',
    name: 'Camera',
    file: 'camera.tsx',
    category: 'Media',
    tag: 'CAMERA',
    description: 'Camera view with zoom controls, torch, front/back switch, and recording.',
    Preview: CameraPreview,
    codeSnippet: `import { Camera } from '../ui/camera';

export function Example() {
  return <Camera />;
}`,
  },
  {
    id: 'camera-preview',
    name: 'Camera Preview',
    file: 'camera-preview.tsx',
    category: 'Media',
    tag: 'CAMERA PREVIEW',
    description: 'Complete camera screen with capture button and media gallery viewer.',
    Preview: CameraPreviewPreview,
    codeSnippet: `import { CameraPreview } from '../ui/camera-preview';

export function Example() {
  return <CameraPreview onMediaCaptured={(media) => console.log(media)} />;
}`,
  },

  // 7. CHARTS (18 CHARTS)
  {
    id: 'chart-container',
    name: 'Chart Container',
    file: 'chart-container.tsx',
    category: 'Charts',
    tag: 'CONTAINER',
    description: 'Standard container card wrapping charts with header, subtitle, and legend.',
    Preview: ChartContainerPreview,
    codeSnippet: `import { ChartContainer } from '../charts/chart-container';

export function Example() {
  return <ChartContainer title="Telemetry"><Text>Chart Element</Text></ChartContainer>;
}`,
  },
  {
    id: 'bar-chart',
    name: 'Bar Chart',
    file: 'bar-chart.tsx',
    category: 'Charts',
    tag: 'BAR CHART',
    description: 'Vertical bar charts with grid lines, rounded caps, and value tooltips.',
    Preview: BarChartPreview,
    codeSnippet: `import { BarChart } from '../charts/bar-chart';

export function Example() {
  const data = [{ label: 'Jan', value: 40 }, { label: 'Feb', value: 70 }];
  return <BarChart data={data} width={300} height={200} />;
}`,
  },
  {
    id: 'line-chart',
    name: 'Line Chart',
    file: 'line-chart.tsx',
    category: 'Charts',
    tag: 'LINE CHART',
    description: 'Continuous smooth line chart with data points and gradient area fills.',
    Preview: LineChartPreview,
    codeSnippet: `import { LineChart } from '../charts/line-chart';

export function Example() {
  const data = [{ label: 'Mon', value: 10 }, { label: 'Tue', value: 35 }];
  return <LineChart data={data} width={300} height={200} />;
}`,
  },
  {
    id: 'area-chart',
    name: 'Area Chart',
    file: 'area-chart.tsx',
    category: 'Charts',
    tag: 'AREA CHART',
    description: 'Smooth gradient-filled area chart for volumetric and trend metrics.',
    Preview: AreaChartPreview,
    codeSnippet: `import { AreaChart } from '../charts/area-chart';

export function Example() {
  const data = [{ label: 'Q1', value: 100 }, { label: 'Q2', value: 250 }];
  return <AreaChart data={data} width={300} height={200} />;
}`,
  },
  {
    id: 'pie-chart',
    name: 'Pie Chart',
    file: 'pie-chart.tsx',
    category: 'Charts',
    tag: 'PIE CHART',
    description: 'Pie charts with percentage distribution and slice highlights.',
    Preview: PieChartPreview,
    codeSnippet: `import { PieChart } from '../charts/pie-chart';

export function Example() {
  const data = [{ label: 'A', value: 60, color: '#3b82f6' }, { label: 'B', value: 40, color: '#10b981' }];
  return <PieChart data={data} size={180} />;
}`,
  },
  {
    id: 'doughnut-chart',
    name: 'Doughnut Chart',
    file: 'doughnut-chart.tsx',
    category: 'Charts',
    tag: 'DOUGHNUT',
    description: 'Donut chart with hollow center, metric display, and legend.',
    Preview: DoughnutChartPreview,
    codeSnippet: `import { DoughnutChart } from '../charts/doughnut-chart';

export function Example() {
  const data = [{ label: 'Direct', value: 50, color: '#3b82f6' }, { label: 'Organic', value: 50, color: '#10b981' }];
  return <DoughnutChart data={data} />;
}`,
  },
  {
    id: 'progress-ring-chart',
    name: 'Progress Ring',
    file: 'progress-ring-chart.tsx',
    category: 'Charts',
    tag: 'PROGRESS RING',
    description: 'Multi-ring radial progress chart for fitness and multi-goal tracking.',
    Preview: ProgressRingChartPreview,
    codeSnippet: `import { ProgressRingChart } from '../charts/progress-ring-chart';

export function Example() {
  const data = [{ label: 'Move', value: 80, color: '#ef4444' }];
  return <ProgressRingChart data={data} size={180} />;
}`,
  },
  {
    id: 'radial-bar-chart',
    name: 'Radial Bar Chart',
    file: 'radial-bar-chart.tsx',
    category: 'Charts',
    tag: 'RADIAL BAR',
    description: 'Circular radial bar chart with gauge display and center metrics.',
    Preview: RadialBarChartPreview,
    codeSnippet: `import { RadialBarChart } from '../charts/radial-bar-chart';

export function Example() {
  const data = [{ label: 'CPU', value: 75, color: '#f43f5e' }];
  return <RadialBarChart data={data} />;
}`,
  },
  {
    id: 'column-chart',
    name: 'Column Chart',
    file: 'column-chart.tsx',
    category: 'Charts',
    tag: 'COLUMN CHART',
    description: 'Horizontal column bars for comparing categorized values.',
    Preview: ColumnChartPreview,
    codeSnippet: `import { ColumnChart } from '../charts/column-chart';

export function Example() {
  const data = [{ label: 'Item 1', value: 80, color: '#3b82f6' }];
  return <ColumnChart data={data} />;
}`,
  },
  {
    id: 'bubble-chart',
    name: 'Bubble Chart',
    file: 'bubble-chart.tsx',
    category: 'Charts',
    tag: 'BUBBLE CHART',
    description: '3D coordinate mapping chart visualizing X, Y, and magnitude size.',
    Preview: BubbleChartPreview,
    codeSnippet: `import { BubbleChart } from '../charts/bubble-chart';

export function Example() {
  const data = [{ x: 10, y: 20, size: 15, label: 'A' }];
  return <BubbleChart data={data} />;
}`,
  },
  {
    id: 'candlestick-chart',
    name: 'Candlestick Chart',
    file: 'candlestick-chart.tsx',
    category: 'Charts',
    tag: 'CANDLESTICK',
    description: 'Financial stock chart with Open, High, Low, and Close candles.',
    Preview: CandlestickChartPreview,
    codeSnippet: `import { CandlestickChart } from '../charts/candlestick-chart';

export function Example() {
  const data = [{ date: 'Mon', open: 100, high: 120, low: 95, close: 115 }];
  return <CandlestickChart data={data} />;
}`,
  },
  {
    id: 'heatmap-chart',
    name: 'Heatmap Chart',
    file: 'heatmap-chart.tsx',
    category: 'Charts',
    tag: 'HEATMAP',
    description: 'Matrix color density map for activity levels and time distributions.',
    Preview: HeatmapChartPreview,
    codeSnippet: `import { HeatmapChart } from '../charts/heatmap-chart';

export function Example() {
  const data = [{ row: 'Mon', col: 'Morning', value: 40 }];
  return <HeatmapChart data={data} />;
}`,
  },
  {
    id: 'polar-area-chart',
    name: 'Polar Area Chart',
    file: 'polar-area-chart.tsx',
    category: 'Charts',
    tag: 'POLAR AREA',
    description: 'Polar radial area chart with equal-angle variable-radius sectors.',
    Preview: PolarAreaChartPreview,
    codeSnippet: `import { PolarAreaChart } from '../charts/polar-area-chart';

export function Example() {
  const data = [{ label: 'A', value: 80, color: '#3b82f6' }];
  return <PolarAreaChart data={data} />;
}`,
  },
  {
    id: 'radar-chart',
    name: 'Radar Chart',
    file: 'radar-chart.tsx',
    category: 'Charts',
    tag: 'RADAR CHART',
    description: 'Spider radar plot for multi-variable attribute comparison.',
    Preview: RadarChartPreview,
    codeSnippet: `import { RadarChart } from '../charts/radar-chart';

export function Example() {
  const data = [{ label: 'Speed', value: 90 }, { label: 'Quality', value: 80 }];
  return <RadarChart data={data} />;
}`,
  },
  {
    id: 'scatter-chart',
    name: 'Scatter Chart',
    file: 'scatter-chart.tsx',
    category: 'Charts',
    tag: 'SCATTER CHART',
    description: 'Scatter point chart for statistical distributions and cluster analysis.',
    Preview: ScatterChartPreview,
    codeSnippet: `import { ScatterChart } from '../charts/scatter-chart';

export function Example() {
  const data = [{ x: 5, y: 10 }, { x: 15, y: 30 }];
  return <ScatterChart data={data} />;
}`,
  },
  {
    id: 'stacked-area-chart',
    name: 'Stacked Area Chart',
    file: 'stacked-area-chart.tsx',
    category: 'Charts',
    tag: 'STACKED AREA',
    description: 'Multi-series cumulative area chart for layered volume breakdown.',
    Preview: StackedAreaChartPreview,
    codeSnippet: `import { StackedAreaChart } from '../charts/stacked-area-chart';

export function Example() {
  const data = [{ x: 1, y: [20, 30], label: 'Jan' }];
  return <StackedAreaChart data={data} categories={['Organic', 'Paid']} />;
}`,
  },
  {
    id: 'stacked-bar-chart',
    name: 'Stacked Bar Chart',
    file: 'stacked-bar-chart.tsx',
    category: 'Charts',
    tag: 'STACKED BAR',
    description: 'Segmented horizontal and vertical stacked bar charts.',
    Preview: StackedBarChartPreview,
    codeSnippet: `import { StackedBarChart } from '../charts/stacked-bar-chart';

export function Example() {
  const data = [{ label: 'Q1', values: [30, 20] }];
  return <StackedBarChart data={data} categories={['Direct', 'Partner']} />;
}`,
  },
  {
    id: 'treemap-chart',
    name: 'Treemap Chart',
    file: 'treemap-chart.tsx',
    category: 'Charts',
    tag: 'TREEMAP',
    description: 'Hierarchical nested rectangles scaled proportionally by value.',
    Preview: TreemapChartPreview,
    codeSnippet: `import { TreemapChart } from '../charts/treemap-chart';

export function Example() {
  const data = [{ label: 'Engine', value: 300, color: '#3b82f6' }];
  return <TreemapChart data={data} />;
}`,
  },
  // ─── THEMES ─────────────────────────────────────────────────────────────
  {
    id: 'app-themes',
    name: 'App Themes & Tokens Showcase',
    file: 'color-themes.ts',
    category: 'Themes',
    tag: 'THEMES',
    description: 'Dynamic theme explorer featuring 50+ curated themes, base palettes, and live mode preview.',
    Preview: AppThemesPreview,
    codeSnippet: `import { useColorTheme } from '../../providers/color-theme-provider';

export function Example() {
  const { colorTheme, setColorTheme, colorThemes } = useColorTheme();
  return (
    <button onClick={() => setColorTheme('supabase')}>
      Current Theme: {colorTheme}
    </button>
  );
}`,
  },

  // ─── ICONS ──────────────────────────────────────────────────────────────
  {
    id: 'lucide-icons',
    name: 'Lucide React Icons Explorer',
    file: 'icon.tsx',
    category: 'Icons',
    tag: 'ICONS',
    description: 'Comprehensive searchable icon gallery with live stroke, size & color customization.',
    Preview: LucideIconsPreview,
    codeSnippet: `import { Search, Sparkles, Heart, Settings } from 'lucide-react-native';

export function Example() {
  return <Sparkles size={24} color="#8b5cf6" strokeWidth={2} />;
}`,
  },

  // ─── CHAT ───────────────────────────────────────────────────────────────
  {
    id: 'chat-sidebar',
    name: 'Chat Sidebar',
    file: 'chat-sidebar.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Master sidebar container with subtabs (Chats, Contact, Groups, Folder), search bar, category divider line with count, and a scrollable conversation list.',
    Preview: () => <ChatPreviews entry={{ id: 'chat-sidebar' }} />,
    codeSnippet: `import { ChatSidebar, ChatCardItem } from '../chat';

export function Example() {
  return (
    <ChatSidebar tabs={[{ id: 'chats', label: 'Chats' }]} activeTab="chats">
      <ChatCardItem id="1" title="Aman" lastMessage="Hey there!" isActive />
    </ChatSidebar>
  );
}`,
  },
  {
    id: 'chat-card-item',
    name: 'Chat Card Item',
    file: 'chat-card-item.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Conversation preview card for sidebar list. Displays contact name, pill badge (💬 Chat), timestamp, member & online counter, and last message snippet with active left accent stripe.',
    Preview: () => <ChatPreviews entry={{ id: 'chat-card-item' }} />,
    codeSnippet: `import { ChatCardItem } from '../chat';

export function Example() {
  return (
    <ChatCardItem
      id="c1"
      title="Aman"
      badgeLabel="Chat"
      time="about 3 hours ago"
      membersCount={2}
      lastMessage="images (1).jpg"
      isActive
    />
  );
}`,
  },
  {
    id: 'chat-input',
    name: 'Chat Input (Composer)',
    file: 'chat-input.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Modern messaging pill input container with emoji picker, attachment clip, camera trigger, and circular emerald green microphone/send button.',
    Preview: () => <ChatPreviews entry={{ id: 'chat-input' }} />,
    codeSnippet: `import { ChatInput } from '../chat';

export function Example() {
  const [msg, setMsg] = React.useState('');
  return <ChatInput value={msg} onChange={setMsg} onSend={() => setMsg('')} placeholder="Message" />;
}`,
  },
  {
    id: 'chat-header',
    name: 'Chat Header',
    file: 'chat-header.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Conversation header bar with user avatar, status/presence, and exact HeaderActions (Act on this bell, Quick Flag, and 3-dot dropdown menu).',
    Preview: () => <ChatPreviews entry={{ id: 'chat-header' }} />,
    codeSnippet: `import { ChatHeader } from '../chat';

export function Example() {
  return (
    <ChatHeader
      title="Mohammed Aman"
      subtitle="Last seen today at 04:58 PM"
      status="online"
    />
  );
}`,
  },
  {
    id: 'chat-message-list',
    name: 'Chat Message List',
    file: 'chat-message-list.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Scrollable message viewport container with automatic auto-scroll to bottom, infinite scroll top loader for history, and rich bubble rendering for text, live location cards, and media attachments.',
    Preview: () => <ChatPreviews entry={{ id: 'chat-message-list' }} />,
    codeSnippet: `import { ChatMessageList, ChatBubble } from '../chat';

export function Example() {
  return (
    <ChatMessageList>
      <ChatBubble senderName="Mohammed Aman" content="Hello!" time="09:06 AM" status="read" />
    </ChatMessageList>
  );
}`,
  },
  {
    id: 'chat-bubble',
    name: 'Message Bubble',
    file: 'chat-bubble.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Pure, customizable message bubble. Supports text, file/PDF attachments, location cards, status delivery receipts (sent, delivered, read), and interactive reactions.',
    Preview: () => <ChatPreviews entry={{ id: 'chat-bubble' }} />,
    codeSnippet: `import { ChatBubble } from '../chat';

export function Example() {
  return (
    <ChatBubble
      senderName="Aman"
      content="Got it! Looks super clean."
      time="09:55 AM"
      status="read"
      reactions={[{ emoji: '👍', count: 2 }]}
    />
  );
}`,
  },
  {
    id: 'typing-indicator',
    name: 'Typing Indicator',
    file: 'typing-indicator.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Smooth 3-dot pulse animation indicating live incoming message activity.',
    Preview: () => <ChatPreviews entry={{ id: 'typing-indicator' }} />,
    codeSnippet: `import { TypingIndicator } from '../chat';

export function Example() {
  return <TypingIndicator label="Aman is typing..." />;
}`,
  },
  {
    id: 'chat-empty-state',
    name: 'Chat Empty State',
    file: 'chat-empty-state.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Clean placeholder screen displayed when no conversation is selected or a message thread is empty.',
    Preview: () => <ChatPreviews entry={{ id: 'chat-empty-state' }} />,
    codeSnippet: `import { ChatEmptyState } from '../chat';

export function Example() {
  return (
    <ChatEmptyState
      title="No conversation selected"
      description="Choose a chat from the sidebar or start a new conversation to begin messaging."
    />
  );
}`,
  },
  {
    id: 'contact-manager',
    name: 'Contact Manager',
    file: 'contact-manager.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Standalone contact management interface. Displays saved contacts with avatar initials, email, status toggle switch, and direct actions for Chat, Edit, and Delete.',
    Preview: () => <ChatPreviews entry={{ id: 'contact-manager' }} />,
    codeSnippet: `import { ContactManager } from '../chat';

export function Example() {
  return <ContactManager contacts={[{ id: '1', name: 'Aman', email: 'aman@amoga.io', initials: 'AM', isEnabled: true }]} />;
}`,
  },
  {
    id: 'group-manager',
    name: 'Groups Manager',
    file: 'group-manager.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Group channel manager for creating, searching, and managing team chat groups with member counts and instant chat triggers.',
    Preview: () => <ChatPreviews entry={{ id: 'group-manager' }} />,
    codeSnippet: `import { GroupManager } from '../chat';

export function Example() {
  return <GroupManager groups={[{ id: 'g1', name: 'Design Team', membersCount: 4, isEnabled: true }]} />;
}`,
  },
  {
    id: 'chat-action-menu',
    name: '3-Dot Message Action Menu',
    file: 'chat-action-menu.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Interactive dropdown context menu for chat messages featuring Reply, Forward, Pin Message, Star, Favorite, Archive, Action This, and Delete.',
    Preview: () => <ChatPreviews entry={{ id: 'chat-action-menu' }} />,
    codeSnippet: `import { ChatActionMenu } from '../chat';

export function Example() {
  return <ChatActionMenu onSelect={(actionId) => console.log(actionId)} />;
}`,
  },
  {
    id: 'chat-icon-bar',
    name: 'Chat Icon Bar (Action Pill)',
    file: 'chat-icon-bar.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Floating pill action bar for message feedback and reactions featuring Thumbs Up, Thumbs Down, Copy, Share, and More options.',
    Preview: () => <ChatPreviews entry={{ id: 'chat-icon-bar' }} />,
    codeSnippet: `import { ChatIconBar } from '../chat';

export function Example() {
  return <ChatIconBar onThumbUp={() => {}} onCopy={() => {}} />;
}`,
  },
  {
    id: 'file-upload-progress',
    name: 'File Upload with Progress Bar',
    file: 'file-upload-progress.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Dynamic file upload progress indicator card supporting upload states (Uploading, Paused, Completed, Error), smooth percentage bar, and pause/cancel/retry controls.',
    Preview: () => <ChatPreviews entry={{ id: 'file-upload-progress' }} />,
    codeSnippet: `import { FileUploadProgress } from '../chat';

export function Example() {
  return (
    <FileUploadProgress
      fileName="quarterly_financial_report.pdf"
      fileSize="3.6 MB"
      fileType="PDF"
      initialProgress={68}
      status="uploading"
    />
  );
}`,
  },
  {
    id: 'uploaded-file-card',
    name: 'Uploaded File Card',
    file: 'uploaded-file-card.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Compact attachment card displaying file type icon badge, document name, file size/extension metadata, and direct View/Preview and Download actions.',
    Preview: () => <ChatPreviews entry={{ id: 'uploaded-file-card' }} />,
    codeSnippet: `import { UploadedFileCard } from '../chat';

export function Example() {
  return (
    <UploadedFileCard
      fileName="bank-full.csv"
      fileSize="3.6 MB"
      fileType="CSV"
      extension="csv"
      onPreview={() => {}}
      onDownload={() => {}}
    />
  );
}`,
  },
  {
    id: 'chat-attachment-menu',
    name: 'Chat Attachment Menu',
    file: 'chat-attachment-menu.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Interactive popup attachment menu featuring Images, Videos, Documents, Location, Image Converter, Doc Converter, Doc Scanner, Scan Document, and Extract Text.',
    Preview: () => <ChatPreviews entry={{ id: 'chat-attachment-menu' }} />,
    codeSnippet: `import { ChatAttachmentMenu } from '../chat';

export function Example() {
  return <ChatAttachmentMenu onSelect={(type) => console.log(type)} selectedId="location" />;
}`,
  },
  {
    id: 'chat-location-card',
    name: 'Location Sharing Card',
    file: 'chat-location-card.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Rich location sharing card with animated radar map canvas, map pin marker, coordinates, live tracking badge, and direct Navigate & View actions.',
    Preview: () => <ChatPreviews entry={{ id: 'chat-location-card' }} />,
    codeSnippet: `import { ChatLocationCard } from '../chat';

export function Example() {
  return (
    <ChatLocationCard
      title="Amoga Tech Hub"
      address="Building 10, Cyber City, Gurugram"
      latitude={28.4595}
      longitude={77.0266}
      isLive
    />
  );
}`,
  },
  {
    id: 'chat-profile-modal',
    name: 'Profile & Shared Media Drawer',
    file: 'chat-profile-modal.tsx',
    category: 'Chat',
    tag: 'CHAT',
    description: 'Telegram-style interactive profile and shared media drawer with Media, Docs, Audio, and Links tabs, instant search, audio playback, and file preview/download.',
    Preview: () => <ChatPreviews entry={{ id: 'chat-profile-modal' }} />,
    codeSnippet: `import { useState } from 'react';
import { ChatProfileModal } from 'amogamobileds-v1';

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <ChatProfileModal
      visible={open}
      onClose={() => setOpen(false)}
      conversation={activeConversation}
      messages={messages}
      onOpenMedia={(url) => console.log('Open:', url)}
      onOpenDoc={(url) => console.log('Doc:', url)}
    />
  );
}`,
  },
  /* =========================================================================
     13. CHAT UI RENDER (GENERATIVE UI SYSTEM)
     ========================================================================= */
  {
    id: 'chat-ui-json-renderer',
    name: 'JSON UI Renderer',
    file: 'json-renderer.tsx',
    category: 'Chat UI Render',
    tag: 'GEN-UI',
    description: 'Dynamic generative UI engine that parses structured JSON component trees (Stack, Card, StatCard, PricingCard, Button, Badge, Alert, Inputs) into live interactive mobile components.',
    Preview: JsonRendererPreview,
    codeSnippet: `import { JsonRenderer } from 'amogamobileds-v1';

const schema = {
  root: 'stack-root',
  elements: {
    'stack-root': {
      type: 'Stack',
      props: { direction: 'vertical', gap: 'md' },
      children: ['stat-card', 'pricing-plan']
    },
    'stat-card': {
      type: 'PremiumStats',
      props: { variant: '01', title: 'Total Revenue', value: '$48,290.00', change: '+18.4%' }
    },
    'pricing-plan': {
      type: 'PricingCard',
      props: {
        title: 'Pro Team',
        price: '$49',
        features: ['Generative UI Engine', 'Multi-Model Switcher', 'Priority SLA'],
        popular: true
      }
    }
  }
};

export function Example() {
  return <JsonRenderer schema={schema} onAction={(action) => console.log(action)} />;
}`,
  },
  {
    id: 'chat-ui-schema-editor',
    name: 'UI Schema Studio',
    file: 'schema-editor.tsx',
    category: 'Chat UI Render',
    tag: 'STUDIO',
    description: 'Interactive generative UI schema studio featuring a dual-mode tab switcher between Live Preview and real-time editable JSON code editor with instant validation.',
    Preview: SchemaEditorPreview,
    codeSnippet: `import { SchemaEditor } from 'amogamobileds-v1';

export function Example() {
  return (
    <SchemaEditor
      onSchemaChange={(newSchema) => console.log('Updated Schema:', newSchema)}
      onAction={(action) => console.log('Triggered action:', action)}
    />
  );
}`,
  },
  {
    id: 'chat-ui-premium-stats',
    name: 'Premium Stats & KPIs',
    file: 'premium-stats.tsx',
    category: 'Chat UI Render',
    tag: 'STATS',
    description: 'Rich generative KPI & metric cards ported from amoganextapp (Variants 01-15): trend badge cards, progress completion tracks, segmented cloud storage bar, and resource usage breakdown lists.',
    Preview: PremiumStatsPreview,
    codeSnippet: `import { PremiumStats } from 'amogamobileds-v1';

export function Example() {
  return (
    <PremiumStats
      variant="13"
      title="Cloud Storage"
      total={10}
      usedLabel="GB"
      totalLabel="GB"
      segments={[
        { label: 'Models', value: 4.2, color: 'indigo-500' },
        { label: 'Assets', value: 2.1, color: 'blue-500' },
        { label: 'Vectors', value: 1.5, color: 'violet-500' },
      ]}
    />
  );
}`,
  },
  {
    id: 'chat-ui-pricing-card',
    name: 'Pricing Cards Stack',
    file: 'pricing-card.tsx',
    category: 'Chat UI Render',
    tag: 'COMMERCE',
    description: 'Generative pricing tiers with plan badges, big price counters, checkmarked feature lists, and highlighted popular plans with action CTA triggers.',
    Preview: PricingCardPreview,
    codeSnippet: `import { PricingCard } from 'amogamobileds-v1';

export function Example() {
  return (
    <PricingCard
      title="Pro Plan"
      price="$49"
      period="/month"
      popular={true}
      features={['Unlimited AI Chat', 'Custom Themes', 'Cloud Sync']}
      onSelect={() => console.log('Selected Plan')}
    />
  );
}`,
  },
  {
    id: 'chat-ui-user-profile',
    name: 'Generative User Profile',
    file: 'user-profile-card.tsx',
    category: 'Chat UI Render',
    tag: 'PROFILE',
    description: 'Rich generative user profile card with avatar fallback/image, verified badge, bio description, quick metric counters (Projects, Followers, Following), and dual action buttons.',
    Preview: UserProfileCardPreview,
    codeSnippet: `import { UserProfileCard } from 'amogamobileds-v1';

export function Example() {
  return (
    <UserProfileCard
      name="Amoga Studio"
      handle="@amogadev"
      role="Lead UI Architect"
      avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"
      verified
      onFollow={() => console.log('Followed')}
    />
  );
}`,
  },
  {
    id: 'chat-ui-feedback-form',
    name: 'Dynamic Feedback Form',
    file: 'dynamic-feedback-form.tsx',
    category: 'Chat UI Render',
    tag: 'FORMS',
    description: 'Generative interactive review & feedback form with interactive star rating selector, topic category pills, input fields, and submission confirmation state.',
    Preview: DynamicFeedbackFormPreview,
    codeSnippet: `import { DynamicFeedbackForm } from 'amogamobileds-v1';

export function Example() {
  return (
    <DynamicFeedbackForm
      title="Rate AI Assistant"
      onSubmit={(data) => console.log('Submitted:', data)}
    />
  );
}`,
  },
  {
    id: 'chat-ui-web-search',
    name: 'Web Search Sources & Media',
    file: 'web-search-ui.tsx',
    category: 'Chat UI Render',
    tag: 'SOURCES',
    description: 'AI Search Results visual card displaying crawled source articles with domain favicons, title, domain tag, external link buttons, and an interactive Related Images Gallery with full-screen lightbox.',
    Preview: WebSearchUIPreview,
    codeSnippet: `import { WebSearchUI } from 'amogamobileds-v1';

export function Example() {
  return (
    <WebSearchUI
      sources={[
        { title: 'Vercel AI SDK 4.0 Generative UI', url: 'https://sdk.vercel.ai' },
        { title: 'Expo SDK 52 Announcement', url: 'https://expo.dev' }
      ]}
      images={['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400']}
    />
  );
}`,
  },
  {
    id: 'chat-ui-prompt-suggestions',
    name: 'Prompt Suggestion Chips',
    file: 'prompt-suggestions.tsx',
    category: 'Chat UI Render',
    tag: 'STARTERS',
    description: 'Starter prompt recommendation cards with colored icon badges, category tags (Generative UI, Web Search, Chat), title, description, and click-to-prompt dispatch.',
    Preview: PromptSuggestionsPreview,
    codeSnippet: `import { PromptSuggestions } from 'amogamobileds-v1';

export function Example() {
  return (
    <PromptSuggestions
      onSelect={(prompt, tool) => console.log('Selected:', prompt, tool)}
      currentTool="ui-render"
    />
  );
}`,
  },
  {
    id: 'chat-ui-tool-selector',
    name: 'Tool Selector Dropdown',
    file: 'tool-selector.tsx',
    category: 'Chat UI Render',
    tag: 'TOOLS',
    description: 'Compact tool selector supporting multi-tool switching between AI Chat, Web Search, and UI Render with active indicators.',
    Preview: ToolSelectorPreview,
    codeSnippet: `import { ToolSelector } from 'amogamobileds-v1';

export function Example() {
  const [tool, setTool] = React.useState('ui-render');
  return <ToolSelector tool={tool} onSelectTool={setTool} />;
}`,
  },
  {
    id: 'chat-ui-stack',
    name: 'Stack Layout Container',
    file: 'stack.tsx',
    category: 'Chat UI Render',
    tag: 'LAYOUT',
    description: 'Flexible layout container supporting vertical and horizontal directions, gap sizing (xs, sm, md, lg, xl), alignments, and responsive wrapping for generative UI structures.',
    Preview: StackPreview,
    codeSnippet: `import { Stack, Badge } from 'amogamobileds-v1';

export function Example() {
  return (
    <Stack direction="horizontal" gap="md" align="center" wrap>
      <Badge variant="default">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
    </Stack>
  );
}`,
  },
  /* =========================================================================
     14. AUTHENTICATION & ONBOARDING
     ========================================================================= */
  {
    id: 'auth-sign-in',
    name: 'Sign In Screen',
    file: 'sign-in.tsx',
    category: 'Auth',
    tag: 'AUTH',
    description: 'Complete user authentication card with email & password inputs, password visibility toggle, active sign-in validation, forgot password link, and Google/Apple OAuth triggers.',
    Preview: SignInPreview,
    codeSnippet: `import { SignInScreen } from '../../app/(auth)/sign-in';

export function Example() {
  return <SignInScreen />;
}`,
  },
  {
    id: 'auth-sign-up',
    name: 'Sign Up Screen',
    file: 'sign-up.tsx',
    category: 'Auth',
    tag: 'AUTH',
    description: 'User registration screen with full name, work email, password strength indicator bar, terms & privacy agreement checkbox, and account creation validation.',
    Preview: SignUpPreview,
    codeSnippet: `import { SignUpScreen } from '../../app/(auth)/sign-up';

export function Example() {
  return <SignUpScreen />;
}`,
  },
  {
    id: 'auth-verify-otp',
    name: 'OTP Verification',
    file: 'verify-otp.tsx',
    category: 'Auth',
    tag: 'AUTH',
    description: 'Two-factor / OTP verification screen with 6-digit verification code input blocks, automated code verification, and resend countdown timer trigger.',
    Preview: VerifyOtpPreview,
    codeSnippet: `import { VerifyOtpScreen } from '../../app/(auth)/verify-otp';

export function Example() {
  return <VerifyOtpScreen />;
}`,
  },
  {
    id: 'auth-forgot-password',
    name: 'Forgot Password',
    file: 'forgot-password.tsx',
    category: 'Auth',
    tag: 'AUTH',
    description: 'Password recovery card with email input, reset instructions notification banner, and back to sign in navigation action.',
    Preview: ForgotPasswordPreview,
    codeSnippet: `import { ForgotPasswordScreen } from '../../app/(auth)/forgot-password';

export function Example() {
  return <ForgotPasswordScreen />;
}`,
  },
  /* =========================================================================
     14. WIZARDS & MULTI-STEP FLOWS
     ========================================================================= */
  {
    id: 'wizard-questionnaire',
    name: 'Questionnaire & Onboarding Wizard',
    file: 'wizard.tsx',
    category: 'Wizards',
    tag: 'WIZARD',
    description: 'Interactive multi-step questionnaire flow matching shadcn and amogads specifications. Features personal details, role picker cards, session date & time picker, feature choices, progress bar, summary review, and restart.',
    Preview: QuestionnaireWizardPreview,
    codeSnippet: `import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Wizard } from 'amogamobileds-v1';

export function QuestionnaireWizardExample() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Product Manager');

  const steps = [
    { id: '1', title: 'Personal Details', description: 'Name & role' },
    { id: '2', title: 'Schedule Session', description: 'Date & time' },
    { id: '3', title: 'Preferences', description: 'Features' },
  ];

  return (
    <Wizard
      title="Onboarding Questionnaire"
      subtitle="Tailor your workspace preferences"
      steps={steps}
      currentStepIndex={step}
      onStepChange={setStep}
      onNext={() => setStep(s => s + 1)}
      onPrevious={() => setStep(s => s - 1)}
      onSubmit={() => console.log('Completed!')}
    >
      <Text>Step content here</Text>
    </Wizard>
  );
}`,
  },
  {
    id: 'wizard-template',
    name: 'Multi-Step Form Wizard',
    file: 'wizard.tsx',
    category: 'Wizards',
    tag: 'WIZARD',
    description: 'Universal multi-step workflow container component with customizable step definitions, breadcrumb indicator, back/next controls, responsive card body, and submit action.',
    Preview: MultiStepWizardPreview,
    codeSnippet: `import React, { useState } from 'react';
import { Wizard, WizardStep } from 'amogamobileds-v1';

export function MultiStepWizardExample() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: WizardStep[] = [
    { id: '1', title: 'General Info', description: 'Name & summary' },
    { id: '2', title: 'Audience', description: 'Industry target' },
    { id: '3', title: 'Deploy', description: 'Environment setup' },
  ];

  return (
    <Wizard
      title="Provisioning Wizard"
      steps={steps}
      currentStepIndex={currentStep}
      onStepChange={setCurrentStep}
      onNext={() => setCurrentStep(s => s + 1)}
      onPrevious={() => setCurrentStep(s => s - 1)}
      onSubmit={() => console.log('Submitted')}
    >
      {/* Current step form components */}
    </Wizard>
  );
}`,
  },
  {
    id: 'wizard-step-progress',
    name: 'Segmented Step Progress',
    file: 'wizard.tsx',
    category: 'Wizards',
    tag: 'WIZARD',
    description: 'Visual multi-stage workflow step progress indicator with animated progress fill line, stage labels, subtitle descriptions, and completion percentage readout.',
    Preview: SegmentedStepProgressPreview,
    codeSnippet: `import React, { useState } from 'react';
import { View } from 'react-native';
import { StepIndicator } from 'amogamobileds-v1';

export function StepProgressExample() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { id: '1', title: 'Account', description: 'Personal details' },
    { id: '2', title: 'Verification', description: 'Identity check' },
    { id: '3', title: 'Billing', description: 'Payment method' },
    { id: '4', title: 'Completion', description: 'Confirmation' },
  ];

  return (
    <View style={{ padding: 16 }}>
      <StepIndicator
        steps={steps}
        currentStepIndex={activeStep}
        onStepClick={setActiveStep}
      />
    </View>
  );
}`,
  },
  {
    id: 'wizard-progress-bars',
    name: 'Linear & Circular Progress Indicators',
    file: 'progress.tsx',
    category: 'Wizards',
    tag: 'WIZARD',
    description: 'Linear progress bar with real-time controls (+/- 10%, simulate, pause) and radial circular SVG progress ring with cloud sync status.',
    Preview: LinearAndCircularProgressPreview,
    codeSnippet: `import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Progress } from 'amogamobileds-v1';

export function ProgressIndicatorsExample() {
  const [progress, setProgress] = useState(65);

  return (
    <View style={{ padding: 20, gap: 12 }}>
      <Text>Progress: {progress}%</Text>
      <Progress value={progress} />
    </View>
  );
}`,
  },
  /* =========================================================================
     15. KANBAN BOARD
     ========================================================================= */
  {
    id: 'complete-kanban-board',
    name: 'Complete Kanban Board Template',
    file: 'kanbantemplate/index.tsx',
    category: 'Kanban Board',
    tag: 'KANBAN',
    description: 'Full interactive Kanban Board template featuring draggable task columns (To Do, In Progress, Under Review, Completed), priority badges, assignee avatars, task creation modal, and column actions.',
    Preview: CompleteKanbanBoardPreview,
    codeSnippet: `import { CompleteKanbanBoardPreview } from 'amogamobileds-v1';

export function KanbanPage() {
  return <CompleteKanbanBoardPreview />;
}`,
  },
  {
    id: 'kanban-task-card',
    name: 'Task Card Item',
    file: 'task-card-item.tsx',
    category: 'Kanban Board',
    tag: 'KANBAN',
    description: 'Sidebar card representing the Tasks and Kanban Board section. Shows project title, date range badge, active dot, and Kanban label.',
    Preview: TaskCardItemPreview,
    codeSnippet: `import { TaskCardItemPreview } from 'amogamobileds-v1';

export function TaskCardDemo() {
  return <TaskCardItemPreview isSelected={true} />;
}`,
  },
  /* =========================================================================
     16. FILES & DOCUMENTS
     ========================================================================= */
  {
    id: 'file-manager-view',
    name: 'File Manager View',
    file: 'user-file-cards-view.tsx',
    category: 'Files',
    tag: 'FILES',
    description: 'Complete folder & file manager view panel featuring folder title (Finance & Invoices), file count pill (4 files), storage path, notification/flag header actions, top controls (LTR, Filter, Sort, Short, View: Card), category filters (All Files, Images, Pdf, Doc, Xls, Videos, Ppt, Txt, Zip), search input, pagination (1–4 of 4), and file cards (PDF, Image, Doc, Spreadsheet) with quick Preview, Download, and More actions.',
    Preview: FileManagerViewPreview,
    codeSnippet: `import { FileManagerViewPreview } from 'amogamobileds-v1';

export function FileManagerDemo() {
  return <FileManagerViewPreview />;
}`,
  },
  {
    id: 'file-card-item',
    name: 'File Card Item',
    file: 'file-card-item.tsx',
    category: 'Files',
    tag: 'FILES',
    description: 'Individual file card component with category-tailored themes (PDF red, Doc blue, XLS emerald, Image amber, Video purple, Zip orange), rich media/icon preview, size & date meta, quick preview/download, and actions.',
    Preview: FileCardItemPreview,
    codeSnippet: `import { FileCardItemPreview } from 'amogamobileds-v1';

export function FileCardDemo() {
  return <FileCardItemPreview />;
}`,
  },
  {
    id: 'file-upload-form',
    name: 'New File Upload',
    file: 'file-upload-form.tsx',
    category: 'Files',
    tag: 'FILES',
    description: 'New file upload composer featuring "Back to Storage" navigation, storage settings warning banner with "Go to App Settings" CTA, Folder & Sub-folder dropdown selectors, Remarks multiline input, Description/Notes editor with rich text formatting toolbar (Bold, Italic, Underline, Lists, Paperclip), Cancel, Save as Draft, and Save actions.',
    Preview: FileUploadFormPreview,
    codeSnippet: `import { FileUploadFormPreview } from 'amogamobileds-v1';

export function UploadDemo() {
  return <FileUploadFormPreview />;
}`,
  },
  {
    id: 'folder-tree-item',
    name: 'Folder Tree Navigation',
    file: 'folder-tree-item.tsx',
    category: 'Files',
    tag: 'FILES',
    description: 'Hierarchical collapsible folder tree node for file navigation sidebar with 3-level nesting (root, user workspace, category subfolder), file count badge, and active selection indicator.',
    Preview: FolderTreeItemPreview,
    codeSnippet: `import { FolderTreeItemPreview } from 'amogamobileds-v1';

export function FolderTreeDemo() {
  return <FolderTreeItemPreview />;
}`,
  },
  {
    id: 'file-uploader-viewer',
    name: 'File Uploader & Inline Document Viewer',
    file: 'file-picker.tsx',
    category: 'Files',
    tag: 'FILES',
    description: 'Combined file attachment dropzone with real-time JSON metadata export, file remove actions, and inline full-page document reading preview.',
    Preview: FileUploaderAndViewerPreview,
    codeSnippet: `import { FileUploaderAndViewerPreview } from 'amogamobileds-v1';

export function FileViewerDemo() {
  return <FileUploaderAndViewerPreview />;
}`,
  },
  /* =========================================================================
     17. DATA CARDS
     ========================================================================= */
  {
    id: 'card-19-integration',
    name: 'Card 19 - Integration Card',
    file: 'data-cards.tsx',
    category: 'Data Cards',
    tag: 'DATA CARD',
    description: 'App integration card featuring Slack integration status, toggle switch, connection badge, description, and settings link.',
    Preview: IntegrationCardPreview,
    codeSnippet: `import { IntegrationCardPreview } from 'amogamobileds-v1';

export function CardPage() {
  return <IntegrationCardPreview />;
}`,
  },
  {
    id: 'card-18-credit-card',
    name: 'Card 18 - Credit Card',
    file: 'data-cards.tsx',
    category: 'Data Cards',
    tag: 'DATA CARD',
    description: 'Sleek credit card component featuring EMV chip, contactless wave icon, card number, cardholder name, expiration date, and Visa logo.',
    Preview: CreditCardPreview,
    codeSnippet: `import { CreditCardPreview } from 'amogamobileds-v1';

export function CardPage() {
  return <CreditCardPreview />;
}`,
  },
  {
    id: 'card-17-ecommerce-product',
    name: 'Card 17 - Ecommerce Product Card',
    file: 'data-cards.tsx',
    category: 'Data Cards',
    tag: 'DATA CARD',
    description: 'E-commerce product card featuring image placeholder, discount badge (-30%), star rating (4.8), price comparison, color swatches, size picker, and add-to-cart action.',
    Preview: EcommerceProductCardPreview,
    codeSnippet: `import { EcommerceProductCardPreview } from 'amogamobileds-v1';

export function CardPage() {
  return <EcommerceProductCardPreview />;
}`,
  },
  {
    id: 'card-16-assign-task',
    name: 'Card 16 - Assign Task Card',
    file: 'data-cards.tsx',
    category: 'Data Cards',
    tag: 'DATA CARD',
    description: 'Project task assignment card featuring task title, priority badge (HIGH), assignee avatar with name, due date countdown (3 days left), and change assignee link.',
    Preview: AssignTaskCardPreview,
    codeSnippet: `import { AssignTaskCardPreview } from 'amogamobileds-v1';

export function CardPage() {
  return <AssignTaskCardPreview />;
}`,
  },
  {
    id: 'card-15-appointment',
    name: 'Card 15 - Appointment Card',
    file: 'data-cards.tsx',
    category: 'Data Cards',
    tag: 'DATA CARD',
    description: 'Medical or consultation appointment card featuring doctor/specialist avatar, appointment date & time, clinic location with map pin, Reschedule and Confirm actions.',
    Preview: AppointmentCardPreview,
    codeSnippet: `import { AppointmentCardPreview } from 'amogamobileds-v1';

export function CardPage() {
  return <AppointmentCardPreview />;
}`,
  },
  {
    id: 'card-14-statistics',
    name: 'Card 14 - Statistics Card',
    file: 'data-cards.tsx',
    category: 'Data Cards',
    tag: 'DATA CARD',
    description: 'Compact statistics & analytics card featuring weekly revenue metric ($24,500), +14.2% growth badge, sparkline bar graph, and target achieved indicator.',
    Preview: StatisticsCardPreview,
    codeSnippet: `import { StatisticsCardPreview } from 'amogamobileds-v1';

export function CardPage() {
  return <StatisticsCardPreview />;
}`,
  },
  /* =========================================================================
     18. VOUCHERS
     ========================================================================= */
  {
    id: 'voucher-invoice-maker',
    name: 'Voucher Form (AI OCR & Print)',
    file: 'invoice-maker.tsx',
    category: 'Vouchers',
    tag: 'VOUCHER',
    description: 'Complete interactive 3-step Voucher creation form (Upload Document, Edit Fields, Voucher Preview) featuring OCR document parser, structured field editor, catalog item picker, and document print preview.',
    Preview: CompleteVouchersPagePreview,
    codeSnippet: `import { CompleteVouchersPagePreview } from 'amogamobileds-v1';

export function VoucherPage() {
  return <CompleteVouchersPagePreview />;
}`,
  },
  {
    id: 'new-voucher-scan',
    name: 'New Voucher Scan',
    file: 'NewVouncherScan.tsx',
    category: 'Vouchers',
    tag: 'VOUCHER',
    description: 'Voucher document processing workflow featuring the file metadata upload form on Step 1 with auto OCR extraction.',
    Preview: NewVoucherScanPreview,
    codeSnippet: `import { NewVoucherScanPreview } from 'amogamobileds-v1';

export function VoucherScanPage() {
  return <NewVoucherScanPreview />;
}`,
  },
  {
    id: 'new-voucher',
    name: 'New Voucher Card',
    file: 'NewVouncher.tsx',
    category: 'Vouchers',
    tag: 'VOUCHER',
    description: 'Voucher preview and payment detail card with verified badge, payee information, and subtotal/tax calculations.',
    Preview: NewVoucherPreview,
    codeSnippet: `import { NewVoucherPreview } from 'amogamobileds-v1';

export function VoucherCardPage() {
  return <NewVoucherPreview />;
}`,
  },
  /* =========================================================================
     19. STATS
     ========================================================================= */
  {
    id: 'complete-stats-blocks',
    name: 'Stats Blocks Collection',
    file: 'stats.tsx',
    category: 'Stats',
    tag: 'STATS',
    description: 'Complete collection of 15 beautifully styled metric & stats blocks: Trending indicators, border cards, badges, status indicators, circular progress rings, area sparklines, and usage breakdown bars.',
    Preview: StatsBlocksCollectionPreview,
    codeSnippet: `import { StatsBlocksCollectionPreview } from 'amogamobileds-v1';

export function StatsPage() {
  return <StatsBlocksCollectionPreview />;
}`,
  },
  {
    id: 'stats-01-trending',
    name: '01. Stats with Trending',
    file: 'stats-01.tsx',
    category: 'Stats',
    tag: 'STATS',
    description: 'KPI stats grid featuring Profit, Late payments, Pending orders, and Operating costs with tabular numbers and green/red trend percentage change pills.',
    Preview: Stats01TrendingPreview,
    codeSnippet: `import { Stats01TrendingPreview } from 'amogamobileds-v1';

export function Stats01Demo() {
  return <Stats01TrendingPreview />;
}`,
  },
  {
    id: 'stats-02-borders',
    name: '02. Stats with Borders',
    file: 'stats-02.tsx',
    category: 'Stats',
    tag: 'STATS',
    description: 'Metric stats card with bordered column dividers, showing current vs previous baseline metrics (Active Users, Conversion Rate, Avg Session Duration) with TrendingUp / TrendingDown badges.',
    Preview: Stats02BordersPreview,
    codeSnippet: `import { Stats02BordersPreview } from 'amogamobileds-v1';

export function Stats02Demo() {
  return <Stats02BordersPreview />;
}`,
  },
  {
    id: 'stats-03-cards',
    name: '03. Stats with Card Layout',
    file: 'stats-03.tsx',
    category: 'Stats',
    tag: 'STATS',
    description: 'Individual cards grid for Unique visitors, Bounce rate, Visit duration, and Conversion rate with bold 3xl values and inline change deltas.',
    Preview: Stats03CardsPreview,
    codeSnippet: `import { Stats03CardsPreview } from 'amogamobileds-v1';

export function Stats03Demo() {
  return <Stats03CardsPreview />;
}`,
  },
  {
    id: 'stats-04-badges',
    name: '04. Stats with Badges',
    file: 'stats-04.tsx',
    category: 'Stats',
    tag: 'STATS',
    description: 'Metric cards with top-aligned title and trend pill badges (Daily active users, Weekly sessions, Duration) and bold primary values.',
    Preview: Stats04BadgesPreview,
    codeSnippet: `import { Stats04BadgesPreview } from 'amogamobileds-v1';

export function Stats04Demo() {
  return <Stats04BadgesPreview />;
}`,
  },
  {
    id: 'stats-05-links',
    name: '05. Stats with Links',
    file: 'stats-05.tsx',
    category: 'Stats',
    tag: 'STATS',
    description: 'Stats cards with metric trend deltas and bottom actionable footer links ("View more →") for Monthly Recurring Revenue, Users, and User Growth.',
    Preview: Stats05LinksPreview,
    codeSnippet: `import { Stats05LinksPreview } from 'amogamobileds-v1';

export function Stats05Demo() {
  return <Stats05LinksPreview />;
}`,
  },
  {
    id: 'stats-06-status',
    name: '06. Stats with Status Indicators',
    file: 'stats-06.tsx',
    category: 'Stats',
    tag: 'STATS',
    description: 'Regional metric stats cards (Europe, North America, Asia) with goals achieved counts, status level indicators (within, observe, critical), status icon badges, and navigation chevrons.',
    Preview: Stats06StatusPreview,
    codeSnippet: `import { Stats06StatusPreview } from 'amogamobileds-v1';

export function Stats06Demo() {
  return <Stats06StatusPreview />;
}`,
  },
  {
    id: 'stats-07-radial-progress',
    name: '07. Stats with Circular Progress',
    file: 'stats-07.tsx',
    category: 'Stats',
    tag: 'STATS',
    description: 'Plan overview card featuring circular radial progress meters for Workspaces, Dashboards, Chart widgets, and Storage with capacity percentages and resource limits.',
    Preview: Stats07RadialProgressPreview,
    codeSnippet: `import { Stats07RadialProgressPreview } from 'amogamobileds-v1';

export function Stats07Demo() {
  return <Stats07RadialProgressPreview />;
}`,
  },
  {
    id: 'stats-08-radial-links',
    name: '08. Stats with Radial Progress & Links',
    file: 'stats-08.tsx',
    category: 'Stats',
    tag: 'STATS',
    description: 'Departmental budget tracking cards (HR, Marketing, Finance, Engineering) with radial circular progress meters, budget ratios, and "View more →" action links.',
    Preview: Stats08RadialLinksPreview,
    codeSnippet: `import { Stats08RadialLinksPreview } from 'amogamobileds-v1';

export function Stats08Demo() {
  return <Stats08RadialLinksPreview />;
}`,
  },
  {
    id: 'stats-09-linear-progress',
    name: '09. Stats with Progress Bars',
    file: 'stats-09.tsx',
    category: 'Stats',
    tag: 'STATS',
    description: 'Linear progress bar cards for resource consumption tracking (Requests, Credits, Storage, API Calls) with percentage indicators and usage-to-limit ratios.',
    Preview: Stats09LinearProgressPreview,
    codeSnippet: `import { Stats09LinearProgressPreview } from 'amogamobileds-v1';

export function Stats09Demo() {
  return <Stats09LinearProgressPreview />;
}`,
  },
  {
    id: 'stats-10-area-sparkline',
    name: '10. Stats with Sparkline Area Chart',
    file: 'stats-10.tsx',
    category: 'Stats',
    tag: 'STATS',
    description: 'Financial ticker metric cards (Alpha Corp, Beta Solutions, Gamma Industries) with stock pricing, point changes, and mini gradient area sparkline charts.',
    Preview: Stats10AreaSparklinePreview,
    codeSnippet: `import { Stats10AreaSparklinePreview } from 'amogamobileds-v1';

export function Stats10Demo() {
  return <Stats10AreaSparklinePreview />;
}`,
  },
  {
    id: 'stats-11-resource-dashboard',
    name: '11. Stats Dashboard with Progress & Actions',
    file: 'stats-11.tsx',
    category: 'Stats',
    tag: 'STATS',
    description: 'Database and cloud infrastructure metrics dashboard with split read/write commands, bandwidth limits with warning alerts, storage gauges, cost budget trackers, and quick upgrade actions.',
    Preview: Stats11ResourceDashboardPreview,
    codeSnippet: `import { Stats11ResourceDashboardPreview } from 'amogamobileds-v1';

export function Stats11Demo() {
  return <Stats11ResourceDashboardPreview />;
}`,
  },
  {
    id: 'stats-12-usage-meters',
    name: '12. Stats Usage Breakdown Dashboard',
    file: 'stats-12.tsx',
    category: 'Stats',
    tag: 'STATS',
    description: '30-day cloud consumption dashboard with donut meters for ISR Reads, Edge Requests, Fast Origin Transfer, Speed Insights, Function Duration, and Web Analytics events.',
    Preview: Stats12UsageMetersPreview,
    codeSnippet: `import { Stats12UsageMetersPreview } from 'amogamobileds-v1';

export function Stats12Demo() {
  return <Stats12UsageMetersPreview />;
}`,
  },
  {
    id: 'stats-13-segmented-progress',
    name: '13. Stats with Segmented Progress',
    file: 'stats-13.tsx',
    category: 'Stats',
    tag: 'STATS',
    description: 'Multi-category storage allocation bar with segmented colors for Documents, Photos, Videos, Music, and Free storage with detailed breakdown legend.',
    Preview: Stats13SegmentedProgressPreview,
    codeSnippet: `import { Stats13SegmentedProgressPreview } from 'amogamobileds-v1';

export function Stats13Demo() {
  return <Stats13SegmentedProgressPreview />;
}`,
  },
  {
    id: 'stats-14-resource-breakdown',
    name: '14. Stats with Usage Breakdown',
    file: 'stats-14.tsx',
    category: 'Stats',
    tag: 'STATS',
    description: 'Monthly cloud spending breakdown card ($860) with +12.5% trend badge, segmented progress bar for Compute, Storage, and Bandwidth, and direct link to resource settings.',
    Preview: Stats14ResourceBreakdownPreview,
    codeSnippet: `import { Stats14ResourceBreakdownPreview } from 'amogamobileds-v1';

export function Stats14Demo() {
  return <Stats14ResourceBreakdownPreview />;
}`,
  },
  {
    id: 'stats-15-growth-projection',
    name: '15. Stats with Value Breakdown',
    file: 'stats-15.tsx',
    category: 'Stats',
    tag: 'STATS',
    description: 'Investment growth projection card showing returns after 1 year, 5 years, and 10 years with bordered rows, monetary values, and emerald percentage return tags.',
    Preview: Stats15GrowthProjectionPreview,
    codeSnippet: `import { Stats15GrowthProjectionPreview } from 'amogamobileds-v1';

export function Stats15Demo() {
  return <Stats15GrowthProjectionPreview />;
}`,
  },
  /* =========================================================================
     20. MAIL
     ========================================================================= */
  {
    id: 'email-compose',
    name: 'Email Compose (New Message)',
    file: 'email-compose.tsx',
    category: 'Mail',
    tag: 'MAIL',
    description: 'New email composition screen matching design system: header with Back to Message navigation, template selector dropdown, subject and recipient fields with Cc/Bcc toggles, rich formatting toolbar, document attachment cards with download/preview/remove actions, full-width attach file button, and Cancel, Save as Draft, and Send actions.',
    Preview: EmailComposePreview,
    codeSnippet: `import { EmailComposePreview } from 'amogamobileds-v1';

export function EmailComposeDemo() {
  return <EmailComposePreview />;
}`,
  },
  {
    id: 'complete-mail-page',
    name: 'Complete Mail Page (Inbox & Thread)',
    file: 'complete-mail-page.tsx',
    category: 'Mail',
    tag: 'MAIL',
    description: 'Full dual-pane email client layout: Left sidebar showing inbox list with search, unread dots, and date pills + Right panel displaying email conversation thread with sender info, rich body, star toggle, and reply toolbar.',
    Preview: CompleteMailPagePreview,
    codeSnippet: `import { CompleteMailPagePreview } from 'amogamobileds-v1';

export function MailPage() {
  return <CompleteMailPagePreview />;
}`,
  },
  {
    id: 'email-view',
    name: 'Email View',
    file: 'email-view.tsx',
    category: 'Mail',
    tag: 'MAIL',
    description: 'Comprehensive standalone email view panel featuring sender profile with avatar and timestamp, editable subject box, rich text formatting toolbar (Bold, Italic, Underline, Lists, Links, Images, Paperclip), formatted message body with milestone bullet points, PDF attachments section with download & preview actions, and bottom action buttons (Reply, Reply All, Forward, Delete).',
    Preview: EmailViewPreview,
    codeSnippet: `import { EmailViewPreview } from 'amogamobileds-v1';

export function EmailViewDemo() {
  return <EmailViewPreview />;
}`,
  },
  {
    id: 'email-detail',
    name: 'Email Detail View',
    file: 'email-detail.tsx',
    category: 'Mail',
    tag: 'MAIL',
    description: 'Full email detail view panel featuring top action toolbar (Archive, Delete, Spam, Snooze, Reply, Reply All, Forward, More, Close), sender header with avatar, timestamp and Reply-To, subheader with relative time, rich formatted message body with milestone progress status, and docked bottom rich text formatting toolbar.',
    Preview: EmailDetailPreview,
    codeSnippet: `import { EmailDetailPreview } from 'amogamobileds-v1';

export function EmailDetailDemo() {
  return <EmailDetailPreview />;
}`,
  },
  {
    id: 'email-editor',
    name: 'Email Editor (Inline Reply)',
    file: 'email-editor.tsx',
    category: 'Mail',
    tag: 'MAIL',
    description: 'Inline rich reply email editor with full formatting toolbar (Bold, Italic, Strikethrough, Code, H1-H6 headings, Lists, Links, Undo/Redo), draft recipient status, multi-line reply area, AI autocomplete shortcut tip (Cmd + J), and Send action.',
    Preview: EmailEditorPreview,
    codeSnippet: `import { EmailEditorPreview } from 'amogamobileds-v1';

export function EmailEditorDemo() {
  return <EmailEditorPreview />;
}`,
  },
  {
    id: 'email-card-item',
    name: 'Email Card Item',
    file: 'email-card-item.tsx',
    category: 'Mail',
    tag: 'MAIL',
    description: 'Sidebar email list item card with unread indicator dot, date pill, subject, and snippet preview.',
    Preview: EmailCardItemPreview,
    codeSnippet: `import { EmailCardItemPreview } from 'amogamobileds-v1';

export function EmailCardDemo() {
  return <EmailCardItemPreview isSelected={true} />;
}`,
  },
  /* =========================================================================
     21. APP SETTINGS
     ========================================================================= */
  {
    id: 'email-setting-manager',
    name: 'Email Settings',
    file: 'email-setting.tsx',
    category: 'App Settings',
    tag: 'SETTINGS',
    description: 'Email accounts manager card with active toggle switches, edit/delete actions, and a full interactive modal dialog with Gmail/Outlook/Yahoo provider presets, IMAP/POP3 protocol selectors, server host & port configuration, and SSL/STARTTLS toggles.',
    Preview: EmailSettingPreview,
    codeSnippet: `import { EmailSettingPreview } from 'amogamobileds-v1';

export function EmailSettingsDemo() {
  return <EmailSettingPreview />;
}`,
  },
  {
    id: 'ai-api-setting-manager',
    name: 'AI API Settings',
    file: 'ai-api-setting.tsx',
    category: 'App Settings',
    tag: 'SETTINGS',
    description: 'AI API credentials manager for OpenRouter and direct model integrations (Gemini 2.5 Flash, GPT-4o, Claude 3.5 Sonnet, DeepSeek Chat, Llama 3.3 70B) with masked API keys, model badges, active toggles, and add/edit modal dialog.',
    Preview: AiApiSettingPreview,
    codeSnippet: `import { AiApiSettingPreview } from 'amogamobileds-v1';

export function AiApiSettingsDemo() {
  return <AiApiSettingPreview />;
}`,
  },
  {
    id: 'chat-api-setting-manager',
    name: 'Chat API Settings',
    file: 'chat-api-setting.tsx',
    category: 'App Settings',
    tag: 'SETTINGS',
    description: 'Chat Supabase project credentials manager with connection name, project URL, masked anon key with reveal toggle, active switch toggles, and modal dialog matching emerald theme.',
    Preview: ChatApiSettingPreview,
    codeSnippet: `import { ChatApiSettingPreview } from 'amogamobileds-v1';

export function ChatApiSettingsDemo() {
  return <ChatApiSettingPreview />;
}`,
  },
  {
    id: 'files-setting-manager',
    name: 'Files Settings',
    file: 'files-setting.tsx',
    category: 'App Settings',
    tag: 'SETTINGS',
    description: 'Files and Supabase Storage credentials manager with project URL, masked publishable key, bucket name (e.g. chat-files), and default upload folder configuration.',
    Preview: FilesSettingPreview,
    codeSnippet: `import { FilesSettingPreview } from 'amogamobileds-v1';

export function FilesSettingsDemo() {
  return <FilesSettingPreview />;
}`,
  },
  /* =========================================================================
     22. PAGES & SCREENS
     ========================================================================= */
  {
    id: 'page-preference',
    name: 'Preference',
    file: 'app_preference_settings.json',
    category: 'Pages',
    tag: 'PAGE',
    description: 'Application preference settings screen featuring 10 customizable options (Push Notifications, Biometric Face ID Lock, Dark Mode, etc.) with real-time switch toggles and dynamic JSON persistence to App_preference_settings.',
    Preview: PreferencesPreview,
    codeSnippet: `import React, { useState } from 'react';
import { View, Text, Switch } from 'react-native';
import initialPreferences from '../ui/app_preference_settings.json';

export function PreferenceSettingsScreen() {
  const [preferences, setPreferences] = useState(initialPreferences);

  const togglePreference = (id: string, value: boolean) => {
    setPreferences(prev =>
      prev.map(item => item.id === id ? { ...item, status: value ? 'Yes' : 'No' } : item)
    );
  };

  return (
    <View style={{ padding: 20 }}>
      {preferences.map(item => (
        <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 }}>
          <Text style={{ color: '#9333ea', fontWeight: '600' }}>{item.preference}</Text>
          <Switch
            value={item.status === 'Yes'}
            onValueChange={val => togglePreference(item.id, val)}
          />
        </View>
      ))}
    </View>
  );
}`,
  },
  {
    id: 'page-full-maps',
    name: 'Full Page Maps',
    file: 'full-page-map.tsx',
    category: 'Pages',
    tag: 'PAGE',
    description: 'Full-width interactive map page featuring CARTO Positron / OpenStreetMap light & dark tiles, live GPS geolocation with permission flow, search filter bar, custom pin markers, explore cards with top gradient accents, reverse geocoding, and zoom controls.',
    Preview: MapPreviews,
    codeSnippet: `import React from 'react';
import { View } from 'react-native';
import { FullPageMap, DEFAULT_MAP_MARKERS } from 'amogamobileds-v1';

export function FullPageMapScreen() {
  return (
    <View style={{ flex: 1, width: '100%', height: '100%' }}>
      <FullPageMap
        markers={DEFAULT_MAP_MARKERS}
        defaultCenter={[23.2599, 77.4126]}
        defaultZoom={4}
        onMarkerSelect={(marker) => console.log('Selected:', marker)}
        onExplore={(marker) => console.log('Explore:', marker)}
      />
    </View>
  );
}`,
  },
  {
    id: 'page-full-calendar',
    name: 'Full Page Calendar',
    file: 'full-page-calendar.tsx',
    category: 'Pages',
    tag: 'PAGE',
    description: 'Comprehensive calendar kit supporting 6 view modes: Day timeline with live current-time indicator, 3-Days timeline, Week grid, Month matrix, Agenda schedule, and Resource multi-staff scheduling with event creation, search filtering, and event detail popups.',
    Preview: CalendarKitPreviews,
    codeSnippet: `import React from 'react';
import { View } from 'react-native';
import { FullPageCalendar, DEFAULT_CALENDAR_EVENTS, DEFAULT_CALENDAR_RESOURCES } from 'amogamobileds-v1';

export function FullPageCalendarScreen() {
  return (
    <View style={{ flex: 1, width: '100%', height: '100%' }}>
      <FullPageCalendar
        initialDate={new Date(2026, 8, 12)}
        initialViewMode="week"
        events={DEFAULT_CALENDAR_EVENTS}
        resources={DEFAULT_CALENDAR_RESOURCES}
        onEventClick={(event) => console.log('Clicked event:', event)}
        onAddEvent={(event) => console.log('Added event:', event)}
      />
    </View>
  );
}`,
  },
  {
    id: 'page-calendar-app',
    name: 'Calendar & Tasks App',
    file: 'calendar-app-view.tsx',
    category: 'Pages',
    tag: 'PAGE',
    description: 'Two-pane Calendar & Task manager app featuring a left sidebar with 4 tabs (Today, This Week, Month, Year), category filters, task completion toggle, and a right-pane synced Full Page Calendar with live view-mode switching.',
    Preview: CalendarAppPreview,
    codeSnippet: `import React from 'react';
import { View } from 'react-native';
import { CalendarAppView } from 'amogamobileds-v1';

export function CalendarAppScreen() {
  return (
    <View style={{ flex: 1, width: '100%', height: '100%' }}>
      <CalendarAppView initialTab="today" />
    </View>
  );
}`,
  },
  {
    id: 'page-ai-chat',
    name: 'AI Chat',
    file: 'ai-chat.tsx',
    category: 'Pages',
    tag: 'PAGE',
    description: 'Full-featured AI Chat & reasoning application with multi-model switcher (Gemini 2.5 Flash, GPT-4o, Claude 3.5 Sonnet, DeepSeek Chat, Llama 3.3 70B), multi-tool execution (AI Chat, Web Search with source cards & images, Dynamic JSON UI Schema renderer with real-time KPI metrics, pricing tiers, star feedback form, user profile cards), prompt suggestions, voice input, and responsive mobile tabs / desktop split canvas.',
    Preview: AiChatPreview,
    codeSnippet: `import React from 'react';
import { View } from 'react-native';
import { AiChat } from 'amogamobileds-v1';

export function AiChatScreen() {
  return (
    <View style={{ flex: 1, width: '100%', height: '100%' }}>
      <AiChat />
    </View>
  );
}`,
  },
  {
    id: 'page-app-settings',
    name: 'App Settings',
    file: 'app-settings-page.tsx',
    category: 'Pages',
    tag: 'PAGE',
    description: 'Full multi-tab Application Settings screen featuring top navigation tabs (Files, Chat, AI API, Email), interactive modals, provider presets, and environment configuration managers.',
    Preview: AppSettingsPagePreview,
    codeSnippet: `import { AppSettingsPagePreview } from 'amogamobileds-v1';

export function AppSettingsScreen() {
  return <AppSettingsPagePreview />;
}`,
  },
];

export const COMPONENTS = DESIGN_SYSTEM_COMPONENTS;
