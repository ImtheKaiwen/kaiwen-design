import { lazy, Suspense, useState, type ReactNode } from 'react';
import {
  Check,
  CircleHelp,
  Code2,
  Component,
  ExternalLink,
  LayoutGrid,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Palette,
  Search,
  Sparkles,
  Sun,
  X,
} from '@imthekaiwen/icons';
import {
  Alert,
  AppShell,
  Button,
  Card,
  Checkbox,
  CommandPalette,
  ConfirmationPage,
  Container,
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  EmptyState,
  ErrorState,
  Grid,
  Inline,
  Input,
  KaiwenProvider,
  LanguageSwitcher,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  PageHeader,
  Progress,
  ReorderableList,
  Sidebar,
  SidebarItem,
  Skeleton,
  Spinner,
  Stack,
  SuccessPage,
  Switch,
  ThemeSwitcher,
  ToastProvider,
  Tooltip,
  UploadProgress,
  Wizard,
  useToast,
  type MotionLevel,
  type CommandPaletteItem,
  type DrawerSide,
  type ReorderableListItem,
  type ReorderableListLabels,
  type ThemePreference,
  type UploadFileItem,
  type UploadProgressLabels,
  type WizardStep,
} from '@imthekaiwen/ui-web';
import {
  BarChart,
  DataTable,
  GroupedBarChart,
  PieChart,
  StackedBarChart,
  type BarChartDatum,
  type BarChartOrientation,
  type DataTableColumn,
  type GroupedBarChartDatum,
  type GroupedBarChartSeries,
  type PieChartDatum,
} from '@imthekaiwen/ui-web/data';

const ComponentRegistry = lazy(
  () => import('./documentation/ComponentRegistry'),
);

const nav = [
  { id: 'foundations', label: 'Foundations', icon: Palette },
  { id: 'components', label: 'Components', icon: Component },
  { id: 'patterns', label: 'Patterns', icon: LayoutGrid },
  { id: 'advanced', label: 'Advanced', icon: Search },
  { id: 'motion', label: 'Motion Lab', icon: Sparkles },
  { id: 'docs', label: 'Docs & Agents', icon: Code2 },
] as const;

const studioCommands: readonly CommandPaletteItem[] = [
  {
    id: 'foundations',
    label: 'Foundations bölümüne git',
    description: 'Tema, tipografi ve tokenları incele',
    keywords: ['renk', 'spacing', 'tema'],
    icon: <Palette size={17} aria-hidden />,
    shortcut: 'G F',
  },
  {
    id: 'components',
    label: 'Components bölümüne git',
    description: 'Public bileşenleri ve durumlarını incele',
    keywords: ['button', 'select', 'switch'],
    icon: <Component size={17} aria-hidden />,
    shortcut: 'G C',
  },
  {
    id: 'patterns',
    label: 'Patterns bölümüne git',
    description: 'Wizard, upload ve sonuç akışlarını incele',
    icon: <LayoutGrid size={17} aria-hidden />,
    shortcut: 'G P',
  },
  {
    id: 'motion',
    label: 'Motion Lab bölümüne git',
    description: 'Kesilebilir hareketleri deneyin',
    icon: <Sparkles size={17} aria-hidden />,
  },
  {
    id: 'docs',
    label: 'Docs & Agents bölümüne git',
    description: 'API ve agent sözleşmelerini görüntüle',
    icon: <Code2 size={17} aria-hidden />,
  },
];

type StudioProject = {
  id: string;
  name: string;
  owner: string;
  members: number;
  status: 'active' | 'review' | 'paused';
};

const studioProjects: readonly StudioProject[] = [
  {
    id: 'kw-1042',
    name: 'Kaiwen Workspace',
    owner: 'Deniz Kaya',
    members: 18,
    status: 'active',
  },
  {
    id: 'kw-1043',
    name: 'Uzun Türkçe çalışma alanı ve araştırma arşivi',
    owner: 'Ece Yılmaz',
    members: 7,
    status: 'review',
  },
  {
    id: 'kw-1044',
    name: 'Agent Lab',
    owner: 'Mert Demir',
    members: 24,
    status: 'active',
  },
  {
    id: 'kw-1045',
    name: 'Archive',
    owner: 'Ada Şen',
    members: 3,
    status: 'paused',
  },
];

const studioUsageData: readonly BarChartDatum[] = [
  { id: 'monday', label: 'Pazartesi', value: 42 },
  { id: 'tuesday', label: 'Salı', value: 68 },
  {
    id: 'wednesday',
    label: 'Çarşamba',
    value: 53,
    description: 'En yoğun inceleme günü',
  },
  { id: 'thursday', label: 'Perşembe', value: 76 },
  { id: 'friday', label: 'Cuma', value: 35 },
];

const studioDistributionData: readonly PieChartDatum[] = [
  { id: 'design', label: 'Tasarım', value: 38 },
  { id: 'research', label: 'Araştırma', value: 27 },
  { id: 'engineering', label: 'Mühendislik', value: 21 },
  { id: 'operations', label: 'Operasyon', value: 14 },
];

const studioFlowSeries: readonly GroupedBarChartSeries[] = [
  { id: 'created', label: 'Oluşturulan' },
  { id: 'completed', label: 'Tamamlanan' },
  { id: 'review', label: 'İncelemede' },
];

const studioFlowData: readonly GroupedBarChartDatum[] = [
  {
    id: 'monday',
    label: 'Pazartesi',
    values: { created: 18, completed: 12, review: 5 },
  },
  {
    id: 'tuesday',
    label: 'Salı',
    values: { created: 26, completed: 19, review: 8 },
  },
  {
    id: 'wednesday',
    label: 'Çarşamba',
    description: 'En yoğun inceleme günü',
    values: { created: 21, completed: 24, review: 7 },
  },
  {
    id: 'thursday',
    label: 'Perşembe',
    values: { created: 32, completed: 27, review: 11 },
  },
];

const studioPriorityItems: readonly ReorderableListItem[] = [
  {
    id: 'research',
    label: 'Araştırma bulguları',
    accessibleLabel: 'Araştırma bulguları',
    description: 'Kullanıcı ihtiyaçlarını ve ürün sınırlarını doğrulayın.',
    meta: '3 belge',
  },
  {
    id: 'design',
    label: 'Tasarım sistemi uyarlaması',
    accessibleLabel: 'Tasarım sistemi uyarlaması',
    description: 'Ortak bileşenleri ürün akışına yerleştirin.',
    meta: '8 ekran',
  },
  {
    id: 'review',
    label: 'Erişilebilirlik incelemesi',
    accessibleLabel: 'Erişilebilirlik incelemesi',
    description: 'Klavye, responsive ve kontrast kontrollerini tamamlayın.',
    meta: 'Bekliyor',
  },
];

const reorderLabels: ReorderableListLabels = {
  list: 'Öncelik sırası',
  grab: (item) => `${item.accessibleLabel}: Sürükleme tutamacı`,
  moveUp: (item) => `${item.accessibleLabel}: Yukarı taşı`,
  moveDown: (item) => `${item.accessibleLabel}: Aşağı taşı`,
  pickedUp: (item, position, total) =>
    `${item.accessibleLabel} tutuldu. ${total} öğeden ${position}. sırada.`,
  moved: (item, position, total) =>
    `${item.accessibleLabel}, ${total} öğeden ${position}. sıraya taşındı.`,
  dropped: (item, position, total) =>
    `${item.accessibleLabel}, ${total} öğeden ${position}. sıraya bırakıldı.`,
  cancelled: (item) => `${item.accessibleLabel} taşıması iptal edildi.`,
};

const studioProjectColumns: readonly DataTableColumn<StudioProject>[] = [
  {
    id: 'name',
    label: 'Proje',
    cell: (project) => <strong>{project.name}</strong>,
    sortable: true,
    sortValue: (project) => project.name,
    size: 'wide',
  },
  {
    id: 'owner',
    label: 'Sahip',
    cell: (project) => project.owner,
  },
  {
    id: 'members',
    label: 'Üye',
    cell: (project) => project.members,
    sortable: true,
    sortValue: (project) => project.members,
    align: 'end',
    size: 'compact',
  },
  {
    id: 'status',
    label: 'Durum',
    cell: (project) => (
      <span className="table-status" data-status={project.status}>
        {project.status === 'active'
          ? 'Aktif'
          : project.status === 'review'
            ? 'İnceleniyor'
            : 'Duraklatıldı'}
      </span>
    ),
  },
];

const colors = [
  ['Canvas', '--kw-surface-canvas'],
  ['Surface', '--kw-surface-default'],
  ['Subtle', '--kw-surface-subtle'],
  ['Hover', '--kw-surface-hover'],
  ['Primary text', '--kw-text-primary'],
  ['Secondary text', '--kw-text-secondary'],
];
const spaces = ['4', '8', '12', '16', '24', '32', '48', '64'];
const languageOptions = [
  { value: 'tr', label: 'Türkçe' },
  { value: 'en', label: 'English' },
] as const;

function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="studio-section" id={id} aria-labelledby={`${id}-title`}>
      <div className="section-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}

function Segmented<T extends string>({
  label,
  value,
  values,
  onChange,
  labels,
}: {
  label: string;
  value: T;
  values: readonly T[];
  onChange: (value: T) => void;
  labels?: Partial<Record<T, string>>;
}) {
  return (
    <fieldset className="segmented">
      <legend>{label}</legend>
      <div>
        {values.map((item) => (
          <Button
            key={item}
            size="sm"
            variant={value === item ? 'primary' : 'ghost'}
            aria-pressed={value === item}
            onClick={() => onChange(item)}
          >
            {labels?.[item] ?? item}
          </Button>
        ))}
      </div>
    </fieldset>
  );
}

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div className="toast-demo">
      <Button
        variant="outline"
        onClick={() =>
          toast({
            id: 'studio-upload',
            tone: 'loading',
            title: 'Dosyalar yükleniyor',
            description: 'İşlem tamamlanana kadar bekleyin.',
          })
        }
      >
        Loading bildirimi
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({
            id: 'studio-upload',
            tone: 'success',
            title: 'Dosyalar yüklendi',
            description: 'Tüm dosyalar kullanıma hazır.',
            duration: 5000,
          })
        }
      >
        Başarılıya güncelle
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({
            tone: 'danger',
            title: 'Bağlantı kurulamadı',
            action: { label: 'Yeniden dene', onClick: () => undefined },
          })
        }
      >
        Eylemli hata
      </Button>
    </div>
  );
}

function OverlayDemo() {
  const sides: readonly DrawerSide[] = ['left', 'right', 'top', 'bottom'];
  return (
    <div className="overlay-demo">
      <Modal
        closeLabel="Modalı kapat"
        trigger={<Button variant="outline">Modalı aç</Button>}
      >
        <ModalHeader
          title="Değişiklikleri yayınla"
          description="Son kontrolü tamamlayıp bu sürümü kullanıma açın."
        />
        <ModalContent>
          Focus yönetimi, Escape ve backdrop davranışı ortak Dialog primitive’i
          üzerinden sağlanır.
        </ModalContent>
        <ModalFooter>
          <Button variant="outline">Vazgeç</Button>
          <Button>Yayınla</Button>
        </ModalFooter>
      </Modal>
      {sides.map((side) => (
        <Drawer
          key={side}
          side={side}
          floating={side === 'bottom'}
          closeLabel="Drawer’ı kapat"
          trigger={<Button variant="outline">{side}</Button>}
        >
          <DrawerHeader
            title={`${side} drawer`}
            description="Dört yönde aynı erişilebilir etkileşim sözleşmesi."
          />
          <DrawerContent>
            Drawer viewport üzerinde katmanlanır; sayfa düzenini itmez.
          </DrawerContent>
          <DrawerFooter>
            <Button>Uygula</Button>
          </DrawerFooter>
        </Drawer>
      ))}
    </div>
  );
}

const wizardSteps: WizardStep[] = [
  { id: 'workspace', label: 'Çalışma alanı', description: 'Temel bilgiler' },
  { id: 'team', label: 'Takım', description: 'Davet ayarları', optional: true },
  { id: 'review', label: 'İncele', description: 'Son kontrol' },
];

function WizardDemo() {
  const [activeStep, setActiveStep] = useState('workspace');
  const [workspaceName, setWorkspaceName] = useState('Kaiwen Workspace');
  const [teamEmail, setTeamEmail] = useState('takim@kaiwen.dev');
  const [complete, setComplete] = useState(false);

  if (complete)
    return (
      <SuccessPage
        title="Çalışma alanı hazır"
        description="Akış tamamlandı; form verisi ürün katmanında korundu."
        details={
          <span>
            {workspaceName} · {teamEmail}
          </span>
        }
        primaryAction={
          <Button
            size="sm"
            onClick={() => {
              setActiveStep('workspace');
              setComplete(false);
            }}
          >
            Yeniden başlat
          </Button>
        }
      />
    );

  return (
    <Wizard
      steps={wizardSteps}
      activeStep={activeStep}
      onStepChange={setActiveStep}
      onComplete={() => setComplete(true)}
      stepsLabel="Çalışma alanı kurulum adımları"
      progressLabel={(current, total) => `${total} adımdan ${current}. adım`}
      completedLabel="Tamamlandı"
      optionalLabel="İsteğe bağlı"
      backLabel="Geri"
      nextLabel="Devam"
      completeLabel="Kurulumu tamamla"
    >
      {activeStep === 'workspace' ? (
        <Input
          label="Çalışma alanı adı"
          value={workspaceName}
          onValueChange={setWorkspaceName}
          description="Geri döndüğünüzde bu değer korunur."
        />
      ) : null}
      {activeStep === 'team' ? (
        <Input
          label="Takım e-postası"
          type="email"
          value={teamEmail}
          onValueChange={setTeamEmail}
          description="İsteğe bağlı davet alıcısı."
        />
      ) : null}
      {activeStep === 'review' ? (
        <Stack gap="8">
          <strong>Kurulum özeti</strong>
          <span>{workspaceName}</span>
          <span>{teamEmail}</span>
        </Stack>
      ) : null}
    </Wizard>
  );
}

const uploadLabels: UploadProgressLabels = {
  fileList: 'Yüklenecek dosyalar',
  queued: 'Sırada',
  uploading: 'Yükleniyor',
  success: 'Tamamlandı',
  error: 'Yüklenemedi',
  cancel: 'İptal et',
  retry: 'Yeniden dene',
  remove: 'Kaldır',
};

function UploadDemo() {
  const [files, setFiles] = useState<UploadFileItem[]>([
    { id: 'brief', name: 'proje-özeti.pdf', meta: '2,4 MB', status: 'success' },
    {
      id: 'research',
      name: 'araştırma-notları.pdf',
      meta: '5 MB',
      status: 'uploading',
      progress: 64,
      progressText: '3,2 MB / 5 MB',
    },
    {
      id: 'archive',
      name: 'eski-arşiv.zip',
      meta: '18 MB',
      status: 'error',
      error: 'Dosya boyutu 10 MB sınırını aşıyor.',
    },
  ]);

  return (
    <UploadProgress
      label="Proje dosyaları"
      description="PDF, PNG veya ZIP; dosya başına en fazla 10 MB. Yükleme işlemi ürün adapter’ına aittir."
      dropLabel="Dosyaları buraya bırakın veya bilgisayarınızdan seçin"
      selectLabel="Dosya seç"
      accept=".pdf,.png,.zip"
      files={files}
      labels={uploadLabels}
      onFilesSelected={(selected) =>
        setFiles((current) => [
          ...current,
          ...selected.map((file) => ({
            id: `${file.name}-${file.lastModified}`,
            name: file.name,
            meta: `${Math.max(1, Math.round(file.size / 1024))} KB`,
            status: 'queued' as const,
          })),
        ])
      }
      onCancel={(id) =>
        setFiles((current) => current.filter((file) => file.id !== id))
      }
      onRetry={(id) =>
        setFiles((current) =>
          current.map((file) =>
            file.id === id
              ? { ...file, status: 'uploading', progress: 0, error: undefined }
              : file,
          ),
        )
      }
      onRemove={(id) =>
        setFiles((current) => current.filter((file) => file.id !== id))
      }
    />
  );
}

function ScreenTemplateDemos() {
  return (
    <div className="screen-template-grid">
      <article
        className="screen-template"
        aria-labelledby="settings-template-title"
      >
        <PageHeader
          headingLevel={3}
          eyebrow="Ayarlar şablonu"
          title={<span id="settings-template-title">Çalışma alanı</span>}
          description="Sık değiştirilen tercihleri açık bölümler ve kalıcı eylemlerle düzenleyin."
          actions={<Button size="sm">Değişiklikleri kaydet</Button>}
        />
        <Stack gap="12">
          <Card surface="subtle">
            <Inline justify="between" align="center" gap="16">
              <Stack gap="4">
                <strong>Haftalık özet</strong>
                <small>Takım etkinliğini e-posta ile alın.</small>
              </Stack>
              <Switch defaultChecked aria-label="Haftalık özet" />
            </Inline>
          </Card>
          <Input
            label="Varsayılan proje adı"
            defaultValue="Yeni Kaiwen projesi"
            description="Yeni projeler bu adla başlar; ürün doğrulaması adapter katmanında kalır."
          />
        </Stack>
      </article>

      <article
        className="screen-template"
        aria-labelledby="collection-template-title"
      >
        <PageHeader
          headingLevel={3}
          eyebrow="Liste şablonu"
          title={<span id="collection-template-title">Projeler</span>}
          description="Başlık, filtre özeti ve ana eylem dar görünümde doğal sırayla alt alta geçer."
          metadata={
            <Inline gap="8">
              <span>2 etkin proje</span>
              <span aria-hidden>·</span>
              <span>Bugün güncellendi</span>
            </Inline>
          }
          actions={<Button size="sm">Yeni proje</Button>}
        />
        <Stack gap="12">
          <Alert tone="info" title="Filtre uygulanıyor" role="status">
            Yalnızca etkin çalışma alanları gösteriliyor.
          </Alert>
          <Grid columns={2} gap="12">
            <Card surface="subtle">
              <Stack gap="8">
                <strong>Tasarım sistemi</strong>
                <small>12 bileşen · Az önce güncellendi</small>
              </Stack>
            </Card>
            <Card surface="subtle">
              <Stack gap="8">
                <strong>Ürün keşfi</strong>
                <small>8 belge · Dün güncellendi</small>
              </Stack>
            </Card>
          </Grid>
        </Stack>
      </article>
    </div>
  );
}

export function App() {
  const [theme, setTheme] = useState<ThemePreference>('system');
  const [motion, setMotion] = useState<MotionLevel>('balanced');
  const [locale, setLocale] = useState('tr');
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [controlledSwitch, setControlledSwitch] = useState(true);
  const [releaseNotes, setReleaseNotes] = useState(true);
  const [selectedProjects, setSelectedProjects] = useState<readonly string[]>(
    [],
  );
  const [projectPage, setProjectPage] = useState(1);
  const [chartOrientation, setChartOrientation] =
    useState<BarChartOrientation>('horizontal');
  const [priorityItems, setPriorityItems] =
    useState<readonly ReorderableListItem[]>(studioPriorityItems);
  const [projectName, setProjectName] = useState('Kaiwen Workspace');

  return (
    <KaiwenProvider
      theme={theme}
      motion={motion}
      density="comfortable"
      locale={locale}
      className="studio-root"
    >
      <ToastProvider label="Bildirimler" dismissLabel="Bildirimi kapat">
        <AppShell
          className="studio-shell"
          sidebar={
            <Sidebar
              label="Studio bölümleri"
              header={
                <>
                  <a href="#top" className="brand" aria-label="Kaiwen Design">
                    <span>Kaiwen Design</span>
                  </a>
                  <p className="nav-label">Studio</p>
                </>
              }
              footer={
                <>
                  <div className="sidebar-roadmap">
                    <LayoutGrid size={17} aria-hidden />
                    <div>
                      <strong>Phase 1.1</strong>
                      <span>Layouts + patterns</span>
                    </div>
                  </div>
                  <SidebarItem
                    className="repo-link"
                    href="https://github.com/ImtheKaiwen/kaiwen-design"
                    target="_blank"
                    rel="noreferrer"
                    icon={<ExternalLink size={17} />}
                    label="Repository"
                  />
                </>
              }
            >
              {nav.map(({ id, label, icon: Icon }) => (
                <SidebarItem
                  key={id}
                  href={`#${id}`}
                  label={label}
                  icon={<Icon size={17} />}
                  onClick={() => setMenuOpen(false)}
                />
              ))}
            </Sidebar>
          }
          sidebarCollapsed={sidebarCollapsed}
          sidebarOpen={menuOpen}
          onSidebarOpenChange={setMenuOpen}
          dismissSidebarLabel="Menüyü kapat"
          contentId="main"
          skipLinkLabel="İçeriğe geç"
          mobileHeader={
            <>
              <a href="#top" className="brand" aria-label="Kaiwen Design">
                <span>Kaiwen Design</span>
              </a>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Menüyü aç veya kapat"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((value) => !value)}
              >
                <Menu aria-hidden size={20} />
              </Button>
            </>
          }
          topbar={
            <>
              <span className="status">
                <i /> v0.2 advanced
              </span>
              <CommandPalette
                title="Studio komutları"
                description="Bir bölüme hızlıca gidin."
                searchLabel="Komut ara"
                placeholder="Bölüm veya bileşen ara…"
                emptyLabel="Eşleşen komut bulunamadı."
                closeLabel="Komut menüsünü kapat"
                items={studioCommands}
                open={commandOpen}
                onOpenChange={setCommandOpen}
                onSelect={(item) =>
                  document.querySelector(`#${item.id}`)?.scrollIntoView({
                    behavior: motion === 'off' ? 'auto' : 'smooth',
                  })
                }
                enableShortcut
                trigger={
                  <Button
                    className="command-trigger"
                    size="sm"
                    variant="outline"
                  >
                    <Search size={16} aria-hidden />
                    <span>Komut ara</span>
                    <kbd>⌘ K</kbd>
                  </Button>
                }
              />
              <Button
                className="sidebar-collapse"
                size="sm"
                variant="ghost"
                aria-label={
                  sidebarCollapsed
                    ? 'Kenar çubuğunu genişlet'
                    : 'Kenar çubuğunu daralt'
                }
                aria-pressed={sidebarCollapsed}
                onClick={() => setSidebarCollapsed((value) => !value)}
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpen aria-hidden size={17} />
                ) : (
                  <PanelLeftClose aria-hidden size={17} />
                )}
              </Button>
              <div className="quick-controls" aria-label="Hızlı tercihler">
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label={
                    theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'
                  }
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? (
                    <Sun size={17} aria-hidden />
                  ) : (
                    <Moon size={17} aria-hidden />
                  )}
                </Button>
              </div>
            </>
          }
        >
          <div
            id="top"
            className="content"
            onClick={() => menuOpen && setMenuOpen(false)}
          >
            <header className="hero">
              <p className="eyebrow">Kaiwen Design System</p>
              <h1>
                Quiet surfaces.
                <br />
                <span>Thoughtful motion.</span>
              </h1>
              <p>
                Bağımsız ürünler için erişilebilir, kararlı ve yeniden
                kullanılabilir bir arayüz temeli. Bu Studio, paketlerdeki gerçek
                bileşenleri çalıştırır.
              </p>
              <div className="hero-actions">
                <Button
                  size="lg"
                  onClick={() =>
                    document.querySelector('#components')?.scrollIntoView({
                      behavior: motion === 'off' ? 'auto' : 'smooth',
                    })
                  }
                >
                  Bileşenleri keşfet
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() =>
                    document.querySelector('#docs')?.scrollIntoView({
                      behavior: motion === 'off' ? 'auto' : 'smooth',
                    })
                  }
                >
                  Başlangıç rehberi
                </Button>
              </div>
            </header>

            <Section
              id="foundations"
              eyebrow="01 · Foundations"
              title="Tek kaynaktan tasarım kararları"
              description="Renk, tipografi ve ölçüler tema ile birlikte değişen semantik CSS tokenları üzerinden akar."
            >
              <div className="panel controls-panel">
                <ThemeSwitcher
                  label="Tema tercihi"
                  labels={{ light: 'Açık', dark: 'Koyu', system: 'Sistem' }}
                  value={theme}
                  onValueChange={setTheme}
                />
                <Segmented
                  label="Hareket"
                  value={motion}
                  values={['off', 'subtle', 'balanced', 'expressive'] as const}
                  onChange={setMotion}
                />
                <LanguageSwitcher
                  label="Arayüz dili"
                  options={languageOptions}
                  value={locale}
                  onValueChange={setLocale}
                  controlSize="sm"
                />
              </div>
              <Grid columns={3} gap="16" className="foundation-grid">
                <article className="panel">
                  <h3>Semantic colors</h3>
                  <div className="swatches">
                    {colors.map(([name, token]) => (
                      <div className="swatch" key={token}>
                        <span style={{ background: `var(${token})` }} />
                        <div>
                          <strong>{name}</strong>
                          <code>{token}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
                <article className="panel type-card">
                  <h3>Typography</h3>
                  <p className="type-display">Aa</p>
                  <p className="type-heading">Dengeli başlık</p>
                  <p>
                    Okunabilir gövde metni, Türkçe karakterleri ve uzun
                    içerikleri güvenle taşır.
                  </p>
                  <code>Inter, system-ui fallback</code>
                </article>
                <article className="panel spacing-card">
                  <h3>Spacing scale</h3>
                  {spaces.map((space) => (
                    <div key={space}>
                      <code>{space}</code>
                      <span style={{ width: `var(--kw-space-${space})` }} />
                    </div>
                  ))}
                </article>
              </Grid>
            </Section>

            <Section
              id="components"
              eyebrow="02 · Components"
              title="İlk üretim bileşenleri"
              description="Form, yüzey ve yükleme bileşenleri native semantik, kontrollü durum ve ortak motion sözleşmesini paylaşır."
            >
              <Grid columns={2} gap="16" className="component-grid">
                <article className="panel showcase">
                  <div className="panel-title">
                    <div>
                      <h3>Button</h3>
                      <p>Action · Stable</p>
                    </div>
                    <code>@imthekaiwen/ui-web</code>
                  </div>
                  <div className="canvas button-canvas">
                    <Button>Projeyi oluştur</Button>
                    <Button variant="secondary">İkincil</Button>
                    <Button variant="outline">Sınır çizgili</Button>
                    <Button variant="ghost">Hayalet</Button>
                    <Button loading>Kaydediliyor</Button>
                    <Button disabled>Devre dışı</Button>
                  </div>
                  <pre tabIndex={0}>
                    <code>{`import { Button } from '@imthekaiwen/ui-web';\n\n<Button variant="primary">Projeyi oluştur</Button>`}</code>
                  </pre>
                </article>
                <article className="panel showcase">
                  <div className="panel-title">
                    <div>
                      <h3>Switch</h3>
                      <p>Input · Stable</p>
                    </div>
                    <code>@imthekaiwen/ui-web</code>
                  </div>
                  <div className="canvas switch-canvas">
                    <label>
                      <span>
                        <strong>Akıllı hareket</strong>
                        <small>Global motion tercihine uyar</small>
                      </span>
                      <Switch
                        checked={controlledSwitch}
                        onCheckedChange={setControlledSwitch}
                        aria-label="Akıllı hareket"
                      />
                    </label>
                    <label>
                      <span>
                        <strong>Devre dışı seçenek</strong>
                        <small>Native disabled davranışı</small>
                      </span>
                      <Switch disabled aria-label="Devre dışı seçenek" />
                    </label>
                  </div>
                  <pre tabIndex={0}>
                    <code>{`<Switch\n  checked={enabled}\n  onCheckedChange={setEnabled}\n/>`}</code>
                  </pre>
                </article>
                <article className="panel showcase">
                  <div className="panel-title">
                    <div>
                      <h3>Checkbox</h3>
                      <p>Input · Stable</p>
                    </div>
                    <code>@imthekaiwen/ui-web</code>
                  </div>
                  <div className="canvas checkbox-canvas">
                    <Checkbox
                      checked={releaseNotes}
                      onCheckedChange={setReleaseNotes}
                      label="Sürüm notlarını al"
                      description="Önemli bileşen ve API değişiklikleri"
                    />
                    <Checkbox
                      checked="indeterminate"
                      label="Bazı çalışma alanları seçili"
                    />
                    <Checkbox disabled label="Kuruluş tarafından yönetiliyor" />
                  </div>
                  <pre tabIndex={0}>
                    <code>{`<Checkbox\n  checked={enabled}\n  onCheckedChange={setEnabled}\n  label="Sürüm notlarını al"\n/>`}</code>
                  </pre>
                </article>
                <Card
                  className="showcase compact-showcase"
                  padding="lg"
                  role="region"
                  aria-label="Card bileşeni"
                >
                  <div className="panel-title">
                    <div>
                      <h3>Card</h3>
                      <p>Surface · Stable</p>
                    </div>
                    <code>@imthekaiwen/ui-web</code>
                  </div>
                  <Stack gap="12">
                    <Card surface="subtle">
                      <strong>Semantik yüzey</strong>
                      <p>
                        Border, radius ve spacing değerleri ortak tokenlardan
                        gelir.
                      </p>
                    </Card>
                    <Card surface="raised">
                      Raised yalnızca gerçek katman ayrımı gerektiğinde
                      kullanılır.
                    </Card>
                  </Stack>
                </Card>
                <Card
                  className="showcase compact-showcase"
                  padding="lg"
                  role="region"
                  aria-label="Tooltip bileşeni"
                >
                  <div className="panel-title">
                    <div>
                      <h3>Tooltip</h3>
                      <p>Overlay · Stable</p>
                    </div>
                    <code>@imthekaiwen/ui-web</code>
                  </div>
                  <div className="tooltip-demo">
                    <Tooltip content="Hover, keyboard focus ve Escape davranışı desteklenir.">
                      <Button variant="outline">
                        <CircleHelp size={16} aria-hidden />
                        Açıklamayı göster
                      </Button>
                    </Tooltip>
                  </div>
                </Card>
                <Card
                  className="showcase compact-showcase"
                  padding="lg"
                  role="region"
                  aria-label="Input bileşeni"
                >
                  <div className="panel-title">
                    <div>
                      <h3>Input</h3>
                      <p>Form · Stable</p>
                    </div>
                    <code>@imthekaiwen/ui-web</code>
                  </div>
                  <Stack gap="20" className="input-demo">
                    <Input
                      label="Proje adı"
                      value={projectName}
                      onValueChange={setProjectName}
                      description="Kontrollü değer ve native form semantiği."
                    />
                    <Input
                      label="Takım kodu"
                      defaultValue="kw"
                      errorText="Takım kodu en az üç karakter olmalıdır."
                    />
                  </Stack>
                </Card>
                <Card
                  className="showcase compact-showcase"
                  padding="lg"
                  role="region"
                  aria-label="Yükleme bileşenleri"
                >
                  <div className="panel-title">
                    <div>
                      <h3>Skeleton & Spinner</h3>
                      <p>Loading · Stable</p>
                    </div>
                    <code>@imthekaiwen/ui-web</code>
                  </div>
                  <div
                    className="loading-demo"
                    role="region"
                    aria-busy="true"
                    aria-label="Örnek içerik yükleniyor"
                  >
                    <Stack gap="12">
                      <Skeleton height="5rem" />
                      <Skeleton variant="text" width="72%" />
                      <Skeleton variant="text" width="92%" />
                    </Stack>
                    <Spinner label="Örnek içerik yükleniyor" />
                  </div>
                </Card>
                <Card
                  className="showcase compact-showcase"
                  padding="lg"
                  role="region"
                  aria-label="Progress bileşeni"
                >
                  <div className="panel-title">
                    <div>
                      <h3>Progress</h3>
                      <p>Loading · Stable</p>
                    </div>
                    <code>@imthekaiwen/ui-web</code>
                  </div>
                  <Stack gap="20" className="feedback-demo">
                    <Progress
                      label="Dosyalar yükleniyor"
                      value={64}
                      showValue
                      valueText="Dosyaların yüzde 64'ü yüklendi"
                    />
                    <Progress
                      label="İşleme tamamlandı"
                      value={100}
                      showValue
                      motion="off"
                    />
                  </Stack>
                </Card>
                <Card
                  className="showcase compact-showcase"
                  padding="lg"
                  role="region"
                  aria-label="Alert bileşeni"
                >
                  <div className="panel-title">
                    <div>
                      <h3>Alert</h3>
                      <p>Feedback · Stable</p>
                    </div>
                    <code>@imthekaiwen/ui-web</code>
                  </div>
                  <Stack gap="12" className="feedback-demo">
                    <Alert
                      role="region"
                      tone="success"
                      title="Değişiklikler kaydedildi"
                      icon={<Check size={18} />}
                    >
                      Bu sayfadan güvenle ayrılabilirsiniz.
                    </Alert>
                    <Alert
                      role="region"
                      tone="warning"
                      title="Oturum sona ermek üzere"
                      action={
                        <Button size="sm" variant="outline">
                          Uzat
                        </Button>
                      }
                    />
                  </Stack>
                </Card>
                <Card
                  className="showcase compact-showcase state-showcase"
                  padding="lg"
                  role="region"
                  aria-label="EmptyState ve ErrorState bileşenleri"
                >
                  <div className="panel-title">
                    <div>
                      <h3>Empty & Error State</h3>
                      <p>Feedback · Stable</p>
                    </div>
                    <code>@imthekaiwen/ui-web</code>
                  </div>
                  <Grid columns={2} gap="12">
                    <EmptyState
                      role="region"
                      aria-label="Boş durum örneği"
                      title="Henüz proje yok"
                      description="İlk projenizi oluşturarak başlayın."
                      icon={<CircleHelp size={22} />}
                      action={<Button size="sm">Proje oluştur</Button>}
                    />
                    <ErrorState
                      role="region"
                      aria-label="Hata durumu örneği"
                      title="Projeler yüklenemedi"
                      description="Bağlantınızı kontrol edin."
                      icon={<X size={22} />}
                      action={
                        <Button size="sm" variant="outline">
                          Yeniden dene
                        </Button>
                      }
                    />
                  </Grid>
                </Card>
                <Card
                  className="showcase compact-showcase state-showcase"
                  padding="lg"
                  role="region"
                  aria-label="Toast bileşeni"
                >
                  <div className="panel-title">
                    <div>
                      <h3>Toast</h3>
                      <p>Feedback · Stable</p>
                    </div>
                    <code>@imthekaiwen/ui-web</code>
                  </div>
                  <ToastDemo />
                </Card>
                <Card
                  className="showcase compact-showcase state-showcase"
                  padding="lg"
                  role="region"
                  aria-label="Modal ve Drawer bileşenleri"
                >
                  <div className="panel-title">
                    <div>
                      <h3>Modal + Drawer</h3>
                      <p>Overlay · Focus-managed</p>
                    </div>
                    <code>@imthekaiwen/ui-web</code>
                  </div>
                  <OverlayDemo />
                </Card>
                <Card
                  className="showcase compact-showcase state-showcase"
                  padding="lg"
                  role="region"
                  aria-label="Container bileşeni"
                >
                  <div className="panel-title">
                    <div>
                      <h3>Container</h3>
                      <p>Layout · Stable</p>
                    </div>
                    <code>@imthekaiwen/ui-web</code>
                  </div>
                  <div className="container-demo">
                    <Container maxWidth="content">
                      <Card surface="subtle">
                        <strong>Okunabilir ve güvenli içerik alanı</strong>
                        <p>
                          Responsive gutter, uzun Türkçe içerik ve genişlik
                          sınırları ortak layout tokenlarından gelir.
                        </p>
                        <code>
                          kaiwen.dev/cok-uzun-bir-kaynak-yolu/1234567890
                        </code>
                      </Card>
                    </Container>
                  </div>
                </Card>
              </Grid>
            </Section>

            <Section
              id="patterns"
              eyebrow="03 · Patterns"
              title="Yönlendirilmiş akışlar, görünür sonuçlar"
              description="Wizard ürün durumunu sahiplenmeden adımları koordine eder; onay ve başarı sayfaları kritik kararları kalıcı içerikle açıklar."
            >
              <div className="pattern-grid">
                <Card
                  className="pattern-showcase pattern-wizard"
                  padding="lg"
                  role="region"
                  aria-label="Wizard pattern örneği"
                >
                  <div className="panel-title">
                    <div>
                      <h3>Wizard</h3>
                      <p>Pattern · Controlled</p>
                    </div>
                    <code>@imthekaiwen/ui-web</code>
                  </div>
                  <WizardDemo />
                </Card>
                <Card
                  className="pattern-showcase pattern-upload"
                  padding="lg"
                  role="region"
                  aria-label="UploadProgress pattern örneği"
                >
                  <div className="panel-title">
                    <div>
                      <h3>UploadProgress</h3>
                      <p>Pattern · Controlled</p>
                    </div>
                    <code>@imthekaiwen/ui-web/patterns</code>
                  </div>
                  <UploadDemo />
                </Card>
                <Card
                  className="pattern-showcase"
                  padding="lg"
                  role="region"
                  aria-label="ConfirmationPage pattern örneği"
                >
                  <div className="panel-title">
                    <div>
                      <h3>ConfirmationPage</h3>
                      <p>Pattern · Stable</p>
                    </div>
                    <code>@imthekaiwen/ui-web</code>
                  </div>
                  <ConfirmationPage
                    title="Çalışma alanını oluştur?"
                    description="Bu bilgilerle yeni alan ve ilk takım daveti oluşturulacak."
                    details={<span>Kaiwen Workspace · Takım planı</span>}
                    primaryAction={<Button size="sm">Onayla ve oluştur</Button>}
                    secondaryAction={
                      <Button size="sm" variant="outline">
                        Düzenlemeye dön
                      </Button>
                    }
                  />
                </Card>
                <Card
                  className="pattern-showcase"
                  padding="lg"
                  role="region"
                  aria-label="SuccessPage pattern örneği"
                >
                  <div className="panel-title">
                    <div>
                      <h3>SuccessPage</h3>
                      <p>Pattern · Stable</p>
                    </div>
                    <code>@imthekaiwen/ui-web</code>
                  </div>
                  <SuccessPage
                    title="Çalışma alanı hazır"
                    description="Takımınız artık çalışmaya başlayabilir."
                    details={<span>Kimlik: KW-1042</span>}
                    primaryAction={
                      <Button size="sm">Çalışma alanını aç</Button>
                    }
                    secondaryAction={
                      <Button size="sm" variant="ghost">
                        Ana sayfaya dön
                      </Button>
                    }
                  />
                </Card>
                <Card
                  className="pattern-showcase pattern-templates"
                  padding="lg"
                  role="region"
                  aria-label="Ekran şablonları"
                >
                  <div className="panel-title">
                    <div>
                      <h3>Screen templates</h3>
                      <p>Composition · Responsive</p>
                    </div>
                    <code>@imthekaiwen/ui-web/layouts</code>
                  </div>
                  <ScreenTemplateDemos />
                </Card>
              </div>
            </Section>

            <Section
              id="advanced"
              eyebrow="04 · Advanced"
              title="Hızlı erişim, yoğun veride netlik"
              description="Command Palette hızlı erişimi; DataTable yoğun veri gezinmesini; tek ve çok serili grafikler ise değerleri gizlemeden responsive karşılaştırmayı ortaklaştırır."
            >
              <div className="advanced-grid">
                <Card
                  className="advanced-showcase"
                  padding="lg"
                  role="region"
                  aria-label="Command Palette bileşeni"
                >
                  <div>
                    <span className="advanced-icon">
                      <Search size={20} aria-hidden />
                    </span>
                    <div>
                      <h3>CommandPalette</h3>
                      <p>
                        Komutları filtreleyin; ok tuşlarıyla ilerleyin ve Enter
                        ile çalıştırın. Escape odağı açan kontrole geri verir.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setCommandOpen(true)}
                  >
                    Komutları aç <kbd>⌘ K</kbd>
                  </Button>
                </Card>
                <Card
                  className="data-showcase"
                  padding="lg"
                  role="region"
                  aria-label="DataTable bileşeni"
                >
                  <div className="panel-title">
                    <div>
                      <h3>DataTable</h3>
                      <p>Data · Sortable · Responsive</p>
                    </div>
                    <code>@imthekaiwen/ui-web/data</code>
                  </div>
                  <DataTable
                    columns={studioProjectColumns}
                    rows={studioProjects}
                    getRowId={(project) => project.id}
                    caption="Son projeler"
                    labels={{
                      sortAscending: 'Artan sırala',
                      sortDescending: 'Azalan sırala',
                      loading: 'Projeler yükleniyor',
                      scrollRegion: 'Proje tablosu kaydırma alanı',
                    }}
                    emptyState="Henüz proje yok."
                    defaultSort={{
                      columnId: 'name',
                      direction: 'ascending',
                    }}
                    selection={{
                      value: selectedProjects,
                      onValueChange: setSelectedProjects,
                      getRowLabel: (project) => `${project.name} projesini seç`,
                      selectAllLabel: 'Tüm uygun projeleri seç',
                      clearAllLabel: 'Tüm proje seçimlerini kaldır',
                      isRowSelectable: (project) => project.status !== 'paused',
                    }}
                    pagination={{
                      page: projectPage,
                      pageSize: 3,
                      onPageChange: setProjectPage,
                      labels: {
                        navigation: 'Proje sayfaları',
                        previous: 'Önceki',
                        next: 'Sonraki',
                        pageStatus: (page, pageCount) =>
                          `${page} / ${pageCount}. sayfa`,
                      },
                    }}
                  />
                </Card>
                <Card
                  className="data-showcase chart-showcase"
                  padding="lg"
                  role="region"
                  aria-label="BarChart bileşeni"
                >
                  <div className="panel-title">
                    <div>
                      <h3>BarChart</h3>
                      <p>Data · Accessible · Responsive</p>
                    </div>
                    <code>@imthekaiwen/ui-web/data</code>
                  </div>
                  <div className="chart-controls">
                    <Segmented
                      label="Grafik yönü"
                      value={chartOrientation}
                      values={['horizontal', 'vertical'] as const}
                      labels={{ horizontal: 'Yatay', vertical: 'Dikey' }}
                      onChange={setChartOrientation}
                    />
                  </div>
                  <BarChart
                    title="Haftalık aktif çalışma alanları"
                    description="Son yedi gün içindeki benzersiz aktif çalışma alanı sayısı"
                    data={studioUsageData}
                    formatValue={(value) => `${value} alan`}
                    emptyState="Bu dönem için veri yok."
                    loadingLabel="Kullanım grafiği yükleniyor"
                    orientation={chartOrientation}
                  />
                </Card>
                <Card
                  className="data-showcase reorder-showcase"
                  padding="lg"
                  role="region"
                  aria-label="ReorderableList bileşeni"
                >
                  <div className="panel-title">
                    <div>
                      <h3>ReorderableList</h3>
                      <p>Pattern · Pointer + touch + keyboard</p>
                    </div>
                    <code>@imthekaiwen/ui-web/patterns</code>
                  </div>
                  <p className="showcase-note">
                    Tutamaçtan sürükleyin; Space ile yakalayıp ok tuşlarıyla
                    taşıyın veya görünür yön düğmelerini kullanın.
                  </p>
                  <ReorderableList
                    items={priorityItems}
                    onReorder={setPriorityItems}
                    labels={reorderLabels}
                  />
                </Card>
                <Card
                  className="data-showcase chart-showcase"
                  padding="lg"
                  role="region"
                  aria-label="PieChart bileşeni"
                >
                  <div className="panel-title">
                    <div>
                      <h3>PieChart</h3>
                      <p>Data · Accessible · Modular</p>
                    </div>
                    <code>@imthekaiwen/ui-web/data</code>
                  </div>
                  <PieChart
                    title="Aktif projelerin dağılımı"
                    description="Disiplinlerin toplam aktif proje içindeki payı"
                    data={studioDistributionData}
                    formatValue={(value) => `%${value}`}
                    segmentsLabel="Aktif proje dağılımı dilimleri"
                    emptyState="Bu dönem için dağılım verisi yok."
                    loadingLabel="Dağılım grafiği yükleniyor"
                  />
                </Card>
                <Card
                  className="data-showcase chart-showcase"
                  padding="lg"
                  role="region"
                  aria-label="GroupedBarChart bileşeni"
                >
                  <div className="panel-title">
                    <div>
                      <h3>GroupedBarChart</h3>
                      <p>Data · Multi-series · Patterned</p>
                    </div>
                    <code>@imthekaiwen/ui-web/data</code>
                  </div>
                  <GroupedBarChart
                    title="Haftalık iş akışı"
                    description="Görev durumlarının günlere göre karşılaştırması"
                    data={studioFlowData}
                    series={studioFlowSeries}
                    formatValue={(value) => `${value} görev`}
                    plotLabel="Günlere ve durumlara göre görev grafiği"
                    legendLabel="Görev durumları"
                    emptyState="Bu dönem için iş akışı verisi yok."
                    loadingLabel="İş akışı grafiği yükleniyor"
                  />
                </Card>
                <Card
                  className="data-showcase chart-showcase"
                  padding="lg"
                  role="region"
                  aria-label="StackedBarChart bileşeni"
                >
                  <div className="panel-title">
                    <div>
                      <h3>StackedBarChart</h3>
                      <p>Data · Stacked · Axis-aware</p>
                    </div>
                    <code>@imthekaiwen/ui-web/data</code>
                  </div>
                  <div className="chart-controls">
                    <Segmented
                      label="Yığılmış grafik yönü"
                      value={chartOrientation}
                      values={['horizontal', 'vertical'] as const}
                      labels={{ horizontal: 'Yatay', vertical: 'Dikey' }}
                      onChange={setChartOrientation}
                    />
                  </div>
                  <StackedBarChart
                    title="Haftalık kapasite dağılımı"
                    description="Görev durumlarının günlük toplam içindeki payı"
                    data={studioFlowData}
                    series={studioFlowSeries}
                    formatValue={(value) => `${value} görev`}
                    formatAxisValue={(value) => String(Math.round(value))}
                    plotLabel="Günlere göre yığılmış görev grafiği"
                    legendLabel="Görev durumları"
                    axisLabel="Görev sayısı ekseni"
                    emptyState="Bu dönem için kapasite verisi yok."
                    loadingLabel="Kapasite grafiği yükleniyor"
                    orientation={chartOrientation}
                  />
                </Card>
              </div>
            </Section>

            <Section
              id="motion"
              eyebrow="05 · Motion Lab"
              title="Hareket, durumun hizmetinde"
              description="Seviyeyi değiştirin; aşağıdaki gerçek kontroller aynı merkezi preset ve reduced-motion politikasını kullanır."
            >
              <div className="panel motion-lab">
                <Segmented
                  label="Motion level"
                  value={motion}
                  values={['off', 'subtle', 'balanced', 'expressive'] as const}
                  onChange={setMotion}
                />
                <div className="motion-stage">
                  <div>
                    <span>Press / cancel</span>
                    <Button motion="expressive">
                      Basılı tut ve dışarı sürükle
                    </Button>
                  </div>
                  <div>
                    <span>Elastic state</span>
                    <Switch
                      checked={controlledSwitch}
                      onCheckedChange={setControlledSwitch}
                      aria-label="Elastik hareket önizlemesi"
                    />
                  </div>
                </div>
                <p className="motion-note">
                  <Sparkles size={16} aria-hidden /> İşletim sistemi “hareketi
                  azalt” tercihi bütün yerel seçimlerin üzerinde uygulanır.
                </p>
              </div>
            </Section>

            <Section
              id="docs"
              eyebrow="06 · Docs & Agents"
              title="Küçük API, açık sınırlar"
              description="Normatif belgeler kararları; TypeScript, story ve testler ise çalışan API gerçekliğini taşır."
            >
              <Grid columns={3} gap="16" className="docs-grid">
                <article className="panel">
                  <span className="doc-number">01</span>
                  <h3>Kurulum</h3>
                  <pre tabIndex={0}>
                    <code>pnpm add @imthekaiwen/ui-web</code>
                  </pre>
                  <p>Stilleri uygulama girişinde açıkça import edin.</p>
                </article>
                <article className="panel">
                  <span className="doc-number">02</span>
                  <h3>Provider</h3>
                  <pre tabIndex={0}>
                    <code>{`<KaiwenProvider\n theme="system" motion="balanced"\n>`}</code>
                  </pre>
                  <p>
                    Tema, density, locale ve motion birbirinden bağımsız
                    eksenlerdir.
                  </p>
                </article>
                <article className="panel">
                  <span className="doc-number">03</span>
                  <h3>Agent contract</h3>
                  <p>
                    Önce mevcut export ve story’leri arayın; eşdeğer bileşeni
                    ürün içinde yeniden üretmeyin.
                  </p>
                  <a
                    href="https://github.com/ImtheKaiwen/kaiwen-design"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Kaynak sözleşmeleri aç
                  </a>
                </article>
              </Grid>
              <Suspense
                fallback={
                  <div className="registry-loading panel" role="status">
                    <Skeleton width="38%" />
                    <Skeleton width="100%" />
                    <Skeleton width="100%" />
                  </div>
                }
              >
                <ComponentRegistry />
              </Suspense>
            </Section>
            <footer>
              <span>Kaiwen Design · Phase 2</span>
              <span>Accessible by default · Motion with intent</span>
            </footer>
          </div>
        </AppShell>
      </ToastProvider>
    </KaiwenProvider>
  );
}
