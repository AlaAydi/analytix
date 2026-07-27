import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration } from 'chart.js';
import { trigger, style, animate, transition } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { ChartComponent } from '../chart/chart.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { KpiGridComponent, KPI } from '../kpi-grid/kpi-grid.component';
import { TransactionTableComponent, Transaction } from '../transaction-table/transaction-table.component';
import { AnalyticsViewComponent } from '../analytics-view/analytics-view.component';
import { ReportsViewComponent } from '../reports-view/reports-view.component';
import { SettingsViewComponent } from '../settings-view/settings-view.component';
import { ToastNotificationComponent } from '../toast-notification/toast-notification.component';
import { ProfileEditorComponent, ProfileUpdate } from '../profile-editor/profile-editor.component';
import { QuickActionsComponent, QuickActionId } from '../quick-actions/quick-actions.component';
import { ProductManagementComponent } from '../product-management/product-management.component';
import { OrdersSalesComponent } from '../orders-sales/orders-sales.component';
import { NotificationsFeedComponent } from '../notifications-feed/notifications-feed.component';
import { TeamUsersComponent } from '../team-users/team-users.component';
import { SupportTicketsComponent } from '../support-tickets/support-tickets.component';
import { AuthService } from '../../services/auth.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChartComponent,
    SidebarComponent,
    HeaderComponent,
    KpiGridComponent,
    TransactionTableComponent,
    AnalyticsViewComponent,
    ReportsViewComponent,
    SettingsViewComponent,
    ProfileEditorComponent,
    QuickActionsComponent,
    ProductManagementComponent,
    OrdersSalesComponent,
    NotificationsFeedComponent,
    TeamUsersComponent,
    SupportTicketsComponent,
    ToastNotificationComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('fadeScaleTab', [
      transition('* => *', [
        style({ opacity: 0, transform: 'scale(0.98)' }),
        animate('250ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Theme & State
  isDarkMode = true;
  activeTab = 'dashboard';
  dateFilter = '30d';
  isAdmin = true;

  // Live Sync State
  isLiveSync = false;
  private liveSyncInterval: any = null;
  lastUpdated = new Date();

  // Metrics
  kpis: KPI[] = [];
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];

  // Chart Configurations (Overview)
  revenueChartType: ChartConfiguration['type'] = 'line';
  revenueChartData!: ChartConfiguration['data'];
  revenueChartOptions!: ChartConfiguration['options'];

  trafficChartType: ChartConfiguration['type'] = 'doughnut';
  trafficChartData!: ChartConfiguration['data'];
  trafficChartOptions!: ChartConfiguration['options'];

  growthChartType: ChartConfiguration['type'] = 'bar';
  growthChartData!: ChartConfiguration['data'];
  growthChartOptions!: ChartConfiguration['options'];

  // Chart Configurations (Analytics)
  activeAnalyticsMetric: 'sessions' | 'conversions' | 'bounce' | 'value' = 'sessions';
  analyticsChartType: ChartConfiguration['type'] = 'line';
  analyticsChartData!: ChartConfiguration['data'];
  analyticsChartOptions!: ChartConfiguration['options'];

  deviceChartType: ChartConfiguration['type'] = 'doughnut';
  deviceChartData!: ChartConfiguration['data'];
  deviceChartOptions!: ChartConfiguration['options'];

  countries = [
    { name: 'France', flag: '🇫🇷', percentage: 42, visits: '24 500' },
    { name: 'États-Unis', flag: '🇺🇸', percentage: 28, visits: '16 330' },
    { name: 'Allemagne', flag: '🇩🇪', percentage: 15, visits: '8 750' },
    { name: 'Royaume-Uni', flag: '🇬🇧', percentage: 10, visits: '5 830' },
    { name: 'Canada', flag: '🇨🇦', percentage: 5, visits: '2 910' }
  ];

  // Report Builder State
  reportType = 'financial';
  reportFormat = 'pdf';
  reportOptions = {
    transactions: true,
    charts: true,
    projections: false,
    comparative: true
  };
  isGeneratingReport = false;
  generationProgress = 0;
  generatedReports = [
    { id: 'REP-742', name: 'Rapport Performance Financière - 30 Jours', type: 'Performance Financière', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), size: '1.4 Mo', status: 'Disponible' },
    { id: 'REP-603', name: 'Audit du Trafic et Acquisition - 7 Jours', type: 'Trafic et Acquisition', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8), size: '2.1 Mo', status: 'Disponible' }
  ];

  // Settings / Profile / API Configuration
  userName = 'Aydi Ala';
  userRole: 'Administrateur' | 'Client' = 'Administrateur';
  userEmail = 'aydi.ala@example.com';
  userCompany = 'Analytix Studio';
  userLocation = 'Remote';
  userBio = 'Pilotage produit, reporting et expérience data pour les équipes modernes.';
  userTimezone = 'Europe/Paris';
  defaultPeriod = '30d';
  refreshInterval = 4;
  enableSound = true;

  apiKeys = {
    googleAnalytics: 'G-74X89L0WZ2',
    stripeKey: 'sk_test_51Nz8P3J3zLz8R2o9v8X9...',
    webhookUrl: 'https://api.analytix.com/v1/webhooks'
  };
  showApiKeys = {
    googleAnalytics: false,
    stripeKey: false
  };
  apiTesting = {
    stripe: false,
    google: false
  };
  apiStatus = {
    stripe: 'disconnected',
    google: 'disconnected'
  };

  systemLogs: string[] = [
    '[17:12:16] Initialisation du système Analytix v2.1.0...',
    '[17:12:17] Chargement des modules de visualisation graphique...',
    '[17:12:17] Connexion établie avec la base de données simulée (35 enregistrements)',
    '[17:12:18] Serveur WebSocket connecté à wss://realtime.analytix.com/live',
    '[17:12:20] Thème sombre chargé depuis les préférences utilisateur.'
  ];

  // Toast notification
  toastMessage = '';
  showToast = false;

  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const requestedTab = params.get('tab');
      if (requestedTab) {
        this.activeTab = requestedTab;
      }
    });

    const { currentUser } = this.authService;
    if (currentUser) {
      const {
        name,
        role,
        email,
        company,
        location,
        bio,
        timezone
      } = currentUser;

      this.userName = name;
      this.userRole = role;
      this.isAdmin = role === 'Administrateur';
      this.userEmail = email;
      this.userCompany = company ?? this.userCompany;
      this.userLocation = location ?? this.userLocation;
      this.userBio = bio ?? this.userBio;
      this.userTimezone = timezone ?? this.userTimezone;
    }

    this.initializeData();
    this.setupCharts();
    this.applyFilters();
    document.body.style.backgroundColor = this.isDarkMode ? '#090d16' : '#f8fafc';
  }

  ngOnDestroy(): void {
    this.stopLiveSync();
  }

  // --- Core Actions ---
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.style.backgroundColor = this.isDarkMode ? '#090d16' : '#f8fafc';
    this.addLog(this.isDarkMode ? 'Thème Sombre activé' : 'Thème Clair activé');
    this.showNotification(this.isDarkMode ? 'Mode Sombre Activé' : 'Mode Clair Activé');
    this.updateChartThemes();
  }

  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
    this.router.navigate(tabName === 'dashboard' ? ['/dashboard'] : ['/dashboard', tabName]);
    this.addLog(`Navigation vers l'onglet : ${tabName.toUpperCase()}`);
    this.showNotification(`Onglet : ${tabName.toUpperCase()}`);

    if (tabName === 'analytics') {
      setTimeout(() => {
        this.updateAnalyticsChartData();
      }, 0);
    }
  }

  onFilterChange(newFilter: string): void {
    this.dateFilter = newFilter;
    this.initializeData();
    this.applyFilters();
    this.updateChartData();
    if (this.activeTab === 'analytics') {
      this.updateAnalyticsChartData();
    }
    this.addLog(`Filtre temporel modifié : ${this.getFilterLabel()}`);
    this.showNotification(`Filtre : ${this.getFilterLabel()}`);
  }

  toggleLiveSync(): void {
    this.isLiveSync = !this.isLiveSync;
    if (this.isLiveSync) {
      this.startLiveSync();
      this.addLog('Synchronisation en temps réel activée');
      this.showNotification('Synchronisation en temps réel activée');
    } else {
      this.stopLiveSync();
      this.addLog('Synchronisation en temps réel désactivée');
      this.showNotification('Synchronisation en temps réel désactivée');
    }
  }

  // --- Sound notification ---
  playNotificationSound(): void {
    if (!this.enableSound) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.connect(gain);

      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.warn('AudioContext failed to trigger:', e);
    }
  }

  // --- PDF & CSV Exports ---
  exportPDF(): void {
    this.showNotification('Préparation du PDF...');
    this.addLog('Lancement de la capture d\'écran HTML pour export PDF...');
    const element = document.getElementById('dashboard-content');
    if (!element) return;

    const actions = document.querySelector('.header-actions') as HTMLElement;
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    if (actions) actions.style.display = 'none';
    if (sidebar) sidebar.style.display = 'none';

    const mainContent = document.querySelector('.main-content') as HTMLElement;
    const originalPadding = mainContent ? mainContent.style.padding : '';
    if (mainContent) mainContent.style.padding = '0';

    html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: this.isDarkMode ? '#0f172a' : '#f8fafc'
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`rapport-dashboard-${this.dateFilter}-${new Date().toISOString().slice(0,10)}.pdf`);

      if (actions) actions.style.display = '';
      if (sidebar) sidebar.style.display = '';
      if (mainContent) mainContent.style.padding = originalPadding;
      this.addLog('Export PDF complété et téléchargé.');
      this.showNotification('PDF exporté avec succès !');
    }).catch(err => {
      console.error('Error generating PDF', err);
      this.addLog('[ERREUR] Impossible de générer le rapport PDF.');
      this.showNotification('Erreur lors de l\'export PDF');
      if (actions) actions.style.display = '';
      if (sidebar) sidebar.style.display = '';
      if (mainContent) mainContent.style.padding = originalPadding;
    });
  }

  exportCSV(): void {
    this.addLog('Génération du fichier CSV des transactions...');
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'ID,Date,Client,Categorie,Montant,Status\n';

    this.filteredTransactions.forEach(t => {
      const row = `${t.id},${t.date.toISOString().slice(0, 10)},"${t.customer}",${t.category},${t.amount},${t.status}`;
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transactions-dashboard-${this.dateFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.addLog('Fichier CSV exporté et téléchargé.');
    this.showNotification('Fichier CSV exporté avec succès !');
  }

  // --- Report Builder Specific ---
  generateReport(): void {
    if (this.isGeneratingReport) return;
    this.isGeneratingReport = true;
    this.generationProgress = 0;
    this.addLog(`Génération du rapport (${this.getReportTypeName(this.reportType)}) au format ${this.reportFormat.toUpperCase()}...`);

    const interval = setInterval(() => {
      this.generationProgress += Math.floor(Math.random() * 15) + 12;
      if (this.generationProgress >= 100) {
        this.generationProgress = 100;
        clearInterval(interval);

        setTimeout(() => {
          this.isGeneratingReport = false;

          const typeLabel = this.getReportTypeName(this.reportType);
          const newRep = {
            id: 'REP-' + Math.floor(100 + Math.random() * 900),
            name: `Rapport ${typeLabel} - ${this.getFilterLabel()}`,
            type: typeLabel,
            date: new Date(),
            size: (Math.random() * 1.8 + 1.1).toFixed(1) + ' Mo',
            status: 'Disponible'
          };
          this.generatedReports = [newRep, ...this.generatedReports];
          this.addLog(`Rapport généré avec succès : ${newRep.id}`);
          this.showNotification('Rapport généré avec succès !');
          this.playNotificationSound();

          if (this.reportFormat === 'pdf') {
            this.exportPDF();
          } else {
            this.exportCSV();
          }
        }, 500);
      }
    }, 150);
  }

  getReportTypeName(type: string): string {
    switch (type) {
      case 'financial': return 'Performance Financière';
      case 'traffic': return 'Trafic et Acquisition';
      case 'conversion': return 'Audit de Conversion';
      default: return 'Activité Générale';
    }
  }

  downloadReport(report: any): void {
    this.addLog(`Téléchargement du rapport archivé : ${report.id}`);
    this.showNotification(`Téléchargement de ${report.id}`);
    if (report.type.includes('Financière')) {
      this.exportPDF();
    } else {
      this.exportCSV();
    }
  }

  // --- Settings specific actions ---
  saveProfile(profile?: ProfileUpdate): void {
    if (profile) {
      this.userName = profile.name;
      this.userEmail = profile.email;
      this.userRole = profile.role;
      this.userCompany = profile.company;
      this.userLocation = profile.location;
      this.userBio = profile.bio;
      this.userTimezone = profile.timezone;

      this.authService.updateProfile(profile);
    }

    this.addLog(`Mise à jour du profil utilisateur: ${this.userName} (${this.userEmail})`);
    this.showNotification('Profil utilisateur sauvegardé !');
    this.playNotificationSound();
  }

  runQuickAction(action: QuickActionId): void {
    switch (action) {
      case 'new-report':
        this.setActiveTab('reports');
        this.showNotification('Ouverture du générateur de rapports');
        break;
      case 'add-transaction':
        this.setActiveTab('dashboard');
        this.showNotification('Module de transactions prêt à l’emploi');
        break;
      case 'invite-member':
        this.setActiveTab('profile');
        this.showNotification('Invite membre: ajustez le profil ou les accès');
        break;
      case 'export-backup':
        this.exportBackup();
        break;
      case 'open-settings':
        this.setActiveTab('settings');
        this.showNotification('Ouverture des paramètres');
        break;
    }
  }

  testApiConnection(provider: 'stripe' | 'google'): void {
    this.apiTesting[provider] = true;
    this.addLog(`Test de connexion vers le fournisseur API: ${provider.toUpperCase()}...`);

    setTimeout(() => {
      this.apiTesting[provider] = false;
      this.apiStatus[provider] = 'connected';
      this.addLog(`[SUCCÈS] Connexion établie avec l'API ${provider.toUpperCase()}`);
      this.showNotification(`Connexion réussie avec ${provider === 'stripe' ? 'Stripe API' : 'Google Analytics API'}`);
      this.playNotificationSound();
    }, 1500);
  }

  toggleApiKeyVisibility(key: 'googleAnalytics' | 'stripeKey'): void {
    this.showApiKeys[key] = !this.showApiKeys[key];
  }

  purgeCache(): void {
    this.addLog('Nettoyage du cache de l\'application (localStorage & mémoire)...');
    this.showNotification('Cache de l\'application nettoyé');
    this.playNotificationSound();
  }

  exportBackup(): void {
    this.addLog('Génération de la sauvegarde des configurations système...');
    const backupData = {
      userName: this.userName,
      userEmail: this.userEmail,
      defaultPeriod: this.defaultPeriod,
      refreshInterval: this.refreshInterval,
      enableSound: this.enableSound,
      apiKeys: this.apiKeys,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytix-settings-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    this.addLog('Fichier de sauvegarde téléchargé.');
    this.showNotification('Sauvegarde des paramètres exportée');
  }

  addLog(msg: string): void {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    this.systemLogs = [`[${timeStr}] ${msg}`, ...this.systemLogs.slice(0, 24)];
  }

  // --- Analytics metric selector ---
  setAnalyticsMetric(metric: 'sessions' | 'conversions' | 'bounce' | 'value'): void {
    this.activeAnalyticsMetric = metric;
    this.updateAnalyticsChartData();
    this.addLog(`Métriques d'analyses changées pour : ${this.getAnalyticsChartLabel()}`);
  }

  updateAnalyticsChartData(): void {
    const dataPoints = this.getAnalyticsChartDataPoints();
    const label = this.getAnalyticsChartLabel();
    let borderC = '#10b981';
    let bgC = 'rgba(16, 185, 129, 0.08)';

    if (this.activeAnalyticsMetric === 'conversions') {
      borderC = '#6366f1';
      bgC = 'rgba(99, 102, 241, 0.08)';
    } else if (this.activeAnalyticsMetric === 'bounce') {
      borderC = '#f43f5e';
      bgC = 'rgba(244, 63, 94, 0.08)';
    } else if (this.activeAnalyticsMetric === 'value') {
      borderC = '#f59e0b';
      bgC = 'rgba(245, 158, 11, 0.08)';
    }

    if (this.analyticsChartData && this.analyticsChartData.datasets && this.analyticsChartData.datasets[0]) {
      this.analyticsChartData = {
        ...this.analyticsChartData,
        labels: this.getChartLabels(),
        datasets: [{
          ...this.analyticsChartData.datasets[0],
          label: label,
          data: dataPoints,
          borderColor: borderC,
          backgroundColor: bgC,
          pointBackgroundColor: borderC
        } as any]
      };
    }
  }

  // --- Data Initialization ---
  private initializeData(): void {
    const rangeDays = this.getDaysCount();

    this.kpis = [
      {
        title: 'Revenus Totaux',
        value: this.formatCurrency(this.calculateBaseRevenue(rangeDays)),
        change: '+14.2%',
        isPositive: true,
        iconName: 'currency-dollar',
        color: 'indigo',
        sparkline: [30, 45, 35, 60, 49, 91, 75]
      },
      {
        title: 'Utilisateurs Actifs',
        value: this.formatNumber(this.calculateBaseUsers(rangeDays)),
        change: '+8.4%',
        isPositive: true,
        iconName: 'users',
        color: 'emerald',
        sparkline: [20, 35, 40, 30, 45, 50, 68]
      },
      {
        title: 'Taux de Conversion',
        value: '3.82%',
        change: '-1.1%',
        isPositive: false,
        iconName: 'activity',
        color: 'amber',
        sparkline: [4.1, 4.0, 3.9, 3.8, 3.85, 3.75, 3.82]
      },
      {
        title: 'Bénéfice Net',
        value: this.formatCurrency(this.calculateBaseRevenue(rangeDays) * 0.42),
        change: '+16.8%',
        isPositive: true,
        iconName: 'trending-up',
        color: 'rose',
        sparkline: [12, 19, 15, 25, 21, 38, 31]
      }
    ];

    this.transactions = this.generateMockTransactions(rangeDays);
    this.lastUpdated = new Date();
  }

  private applyFilters(): void {
    this.filteredTransactions = [...this.transactions];
  }

  // --- Real-time Simulation ---
  private startLiveSync(): void {
    this.liveSyncInterval = setInterval(() => {
      this.kpis.forEach(kpi => {
        const percentChange = (Math.random() - 0.45) * 2;
        let numericVal = parseFloat(kpi.value.replace(/[^0-9.,]/g, '').replace(',', '.'));

        if (kpi.iconName === 'currency-dollar') {
          numericVal += numericVal * (percentChange / 100);
          kpi.value = this.formatCurrency(numericVal);
        } else if (kpi.iconName === 'users') {
          numericVal += Math.round(numericVal * (percentChange / 150));
          kpi.value = this.formatNumber(numericVal);
        } else if (kpi.iconName === 'activity') {
          numericVal += percentChange / 50;
          kpi.value = Math.max(1, Math.min(10, numericVal)).toFixed(2) + '%';
        } else if (kpi.iconName === 'trending-up') {
          numericVal += numericVal * (percentChange / 90);
          kpi.value = this.formatCurrency(numericVal);
        }

        kpi.sparkline = [...kpi.sparkline.slice(1), numericVal * 0.05 + Math.random() * 5];
        kpi.change = (percentChange >= 0 ? '+' : '') + percentChange.toFixed(1) + '%';
        kpi.isPositive = percentChange >= 0;
      });

      const categories = ['Logiciels', 'Consulting', 'Matériel', 'Abonnements'];
      const customers = ['Société Alpha', 'Ecorp', 'Julie Dubois', 'Marc Morel', 'Startup Hub', 'Global Tech'];
      const statusOptions: Transaction['status'][] = ['Completed', 'Pending', 'Cancelled'];

      const newTx: Transaction = {
        id: 'TX-' + Math.floor(10000 + Math.random() * 90000),
        date: new Date(),
        customer: customers[Math.floor(Math.random() * customers.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        amount: Math.floor(150 + Math.random() * 4500),
        status: statusOptions[Math.floor(Math.random() * statusOptions.length)]
      };

      this.transactions = [newTx, ...this.transactions.slice(0, 49)];
      this.applyFilters();
      this.lastUpdated = new Date();

      this.playNotificationSound();
      this.addLog(`Nouvelle transaction synchronisée : ${newTx.id} - ${newTx.customer} (${this.formatCurrency(newTx.amount)})`);

      this.updateChartDataRealTime();
    }, this.refreshInterval * 1000);
  }

  private stopLiveSync(): void {
    if (this.liveSyncInterval) {
      clearInterval(this.liveSyncInterval);
      this.liveSyncInterval = null;
    }
  }

  // --- Chart Setup & Theme Styling ---
  private setupCharts(): void {
    const isDark = this.isDarkMode;
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.07)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    this.revenueChartData = {
      labels: this.getChartLabels(),
      datasets: [
        {
          label: 'Revenus (€)',
          data: this.getRevenueChartDataPoints(),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: '#6366f1',
          pointHoverRadius: 7
        },
        {
          label: 'Dépenses (€)',
          data: this.getRevenueChartDataPoints().map(val => val * 0.58 + Math.random() * 200),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.05)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          borderDash: [5, 5],
          pointBackgroundColor: '#f59e0b'
        }
      ]
    };

    this.revenueChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { color: textColor, font: { family: 'Outfit, sans-serif' } }
        },
        tooltip: {
          padding: 12,
          cornerRadius: 8,
          bodyFont: { family: 'Outfit, sans-serif' }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { family: 'Outfit, sans-serif' } }
        },
        y: {
          grid: { color: gridColor },
          ticks: { color: textColor, font: { family: 'Outfit, sans-serif' } }
        }
      }
    };

    this.trafficChartData = {
      labels: ['Recherche Directe', 'Réseaux Sociaux', 'Emailing', 'Référencement'],
      datasets: [{
        data: [42, 25, 18, 15],
        backgroundColor: [
          '#6366f1',
          '#10b981',
          '#f59e0b',
          '#f43f5e'
        ],
        borderWidth: isDark ? 2 : 1,
        borderColor: isDark ? '#1e293b' : '#ffffff'
      }]
    };

    this.trafficChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: textColor, font: { family: 'Outfit, sans-serif' } }
        }
      },
      cutout: '70%'
    } as any;

    this.growthChartData = {
      labels: this.getChartLabels().slice(-6),
      datasets: [{
        label: 'Nouveaux Inscrits',
        data: this.getChartLabels().slice(-6).map(() => Math.floor(100 + Math.random() * 500)),
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        borderRadius: 6,
        hoverBackgroundColor: '#10b981'
      }]
    };

    this.growthChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { family: 'Outfit, sans-serif' } }
        },
        y: {
          grid: { color: gridColor },
          ticks: { color: textColor, font: { family: 'Outfit, sans-serif' } }
        }
      }
    };

    this.analyticsChartData = {
      labels: this.getChartLabels(),
      datasets: [
        {
          label: this.getAnalyticsChartLabel(),
          data: this.getAnalyticsChartDataPoints(),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: '#10b981',
          pointHoverRadius: 7
        }
      ]
    };

    this.analyticsChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { color: textColor, font: { family: 'Outfit, sans-serif' } }
        },
        tooltip: {
          padding: 12,
          cornerRadius: 8,
          bodyFont: { family: 'Outfit, sans-serif' }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: textColor, font: { family: 'Outfit, sans-serif' } }
        },
        y: {
          grid: { color: gridColor },
          ticks: { color: textColor, font: { family: 'Outfit, sans-serif' } }
        }
      }
    };

    this.deviceChartData = {
      labels: ['Ordinateur', 'Mobile', 'Tablette'],
      datasets: [{
        data: [55, 38, 7],
        backgroundColor: [
          '#6366f1',
          '#10b981',
          '#f59e0b'
        ],
        borderWidth: isDark ? 2 : 1,
        borderColor: isDark ? '#1e293b' : '#ffffff'
      }]
    };

    this.deviceChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: textColor, font: { family: 'Outfit, sans-serif' } }
        }
      },
      cutout: '70%'
    } as any;
  }

  private updateChartThemes(): void {
    const isDark = this.isDarkMode;
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.07)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    if (this.revenueChartOptions && this.revenueChartOptions.scales) {
      this.revenueChartOptions = {
        ...this.revenueChartOptions,
        plugins: {
          ...this.revenueChartOptions.plugins,
          legend: {
            ...this.revenueChartOptions.plugins?.legend,
            labels: { color: textColor }
          }
        },
        scales: {
          x: { ...this.revenueChartOptions.scales['x'], ticks: { color: textColor } },
          y: { ...this.revenueChartOptions.scales['y'], grid: { color: gridColor }, ticks: { color: textColor } }
        }
      };
    }

    if (this.trafficChartOptions && this.trafficChartOptions.plugins) {
      this.trafficChartOptions = {
        ...this.trafficChartOptions,
        plugins: {
          ...this.trafficChartOptions.plugins,
          legend: {
            ...this.trafficChartOptions.plugins.legend,
            labels: { color: textColor }
          }
        }
      };

      if (this.trafficChartData.datasets && this.trafficChartData.datasets[0]) {
        this.trafficChartData = {
          ...this.trafficChartData,
          datasets: [{
            ...this.trafficChartData.datasets[0],
            borderColor: isDark ? '#1e293b' : '#ffffff'
          }]
        };
      }
    }

    if (this.growthChartOptions && this.growthChartOptions.scales) {
      this.growthChartOptions = {
        ...this.growthChartOptions,
        scales: {
          x: { ...this.growthChartOptions.scales['x'], ticks: { color: textColor } },
          y: { ...this.growthChartOptions.scales['y'], grid: { color: gridColor }, ticks: { color: textColor } }
        }
      };
    }

    if (this.analyticsChartOptions && this.analyticsChartOptions.scales) {
      this.analyticsChartOptions = {
        ...this.analyticsChartOptions,
        plugins: {
          ...this.analyticsChartOptions.plugins,
          legend: {
            ...this.analyticsChartOptions.plugins?.legend,
            labels: { color: textColor }
          }
        },
        scales: {
          x: { ...this.analyticsChartOptions.scales['x'], ticks: { color: textColor } },
          y: { ...this.analyticsChartOptions.scales['y'], grid: { color: gridColor }, ticks: { color: textColor } }
        }
      };
    }

    if (this.deviceChartOptions && this.deviceChartOptions.plugins) {
      this.deviceChartOptions = {
        ...this.deviceChartOptions,
        plugins: {
          ...this.deviceChartOptions.plugins,
          legend: {
            ...this.deviceChartOptions.plugins.legend,
            labels: { color: textColor }
          }
        }
      };

      if (this.deviceChartData.datasets && this.deviceChartData.datasets[0]) {
        this.deviceChartData = {
          ...this.deviceChartData,
          datasets: [{
            ...this.deviceChartData.datasets[0],
            borderColor: isDark ? '#1e293b' : '#ffffff'
          }]
        };
      }
    }
  }

  private updateChartData(): void {
    const revenuePoints = this.getRevenueChartDataPoints();
    this.revenueChartData = {
      ...this.revenueChartData,
      labels: this.getChartLabels(),
      datasets: [
        {
          ...this.revenueChartData.datasets[0],
          data: revenuePoints
        },
        {
          ...this.revenueChartData.datasets[1],
          data: revenuePoints.map(val => val * 0.58 + Math.random() * 200)
        }
      ]
    };

    const growthLabels = this.getChartLabels().slice(-6);
    this.growthChartData = {
      ...this.growthChartData,
      labels: growthLabels,
      datasets: [{
        ...this.growthChartData.datasets[0],
        data: growthLabels.map(() => Math.floor(100 + Math.random() * 500))
      }]
    };
  }

  private updateChartDataRealTime(): void {
    if (this.revenueChartData.datasets && this.revenueChartData.datasets[0].data) {
      const dataCopy = [...this.revenueChartData.datasets[0].data];
      const change = (Math.random() - 0.45) * 50;
      dataCopy[dataCopy.length - 1] = Math.max(100, (dataCopy[dataCopy.length - 1] as number) + change);

      this.revenueChartData = {
        ...this.revenueChartData,
        datasets: [
          { ...this.revenueChartData.datasets[0], data: dataCopy },
          {
            ...this.revenueChartData.datasets[1],
            data: dataCopy.map((val, idx) => (this.revenueChartData.datasets[1].data![idx] as number) + (Math.random() - 0.5) * 20)
          }
        ]
      };
    }

    if (this.growthChartData.datasets && this.growthChartData.datasets[0].data) {
      const barDataCopy = [...this.growthChartData.datasets[0].data];
      barDataCopy[barDataCopy.length - 1] = (barDataCopy[barDataCopy.length - 1] as number) + Math.floor(Math.random() * 10);
      this.growthChartData = {
        ...this.growthChartData,
        datasets: [{ ...this.growthChartData.datasets[0], data: barDataCopy }]
      };
    }

    if (this.activeTab === 'analytics') {
      this.updateAnalyticsChartData();
    }
  }

  // --- Helper Methods ---
  private getDaysCount(): number {
    switch (this.dateFilter) {
      case '1d': return 1;
      case '7d': return 7;
      case '30d': return 30;
      default: return 90;
    }
  }

  public getFilterLabel(): string {
    switch (this.dateFilter) {
      case '1d': return 'Aujourd\'hui';
      case '7d': return '7 Derniers Jours';
      case '30d': return '30 Derniers Jours';
      default: return '90 Derniers Jours';
    }
  }

  private calculateBaseRevenue(days: number): number {
    return days * 1240 + 5200;
  }

  private calculateBaseUsers(days: number): number {
    return days * 45 + 320;
  }

  private formatCurrency(val: number): string {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  }

  private formatNumber(val: number): string {
    return new Intl.NumberFormat('fr-FR').format(val);
  }

  private showNotification(msg: string): void {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  private getChartLabels(): string[] {
    const range = this.getDaysCount();
    if (range === 1) {
      return ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
    }
    if (range === 7) {
      return ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    }
    if (range === 30) {
      return ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
    }
    return ['Mai', 'Juin', 'Juil'];
  }

  private getRevenueChartDataPoints(): number[] {
    const range = this.getDaysCount();
    if (range === 1) {
      return [120, 250, 480, 510, 680, 890, 1100];
    }
    if (range === 7) {
      return [1500, 2200, 1800, 3100, 2900, 4200, 5100];
    }
    if (range === 30) {
      return [12000, 15400, 13900, 19200];
    }
    return [38000, 45000, 52000];
  }

  private generateMockTransactions(days: number): Transaction[] {
    const categories = ['Logiciels', 'Consulting', 'Matériel', 'Abonnements'];
    const customers = [
      'Société Alpha', 'Solutions Bêta', 'Ecorp', 'Startup Hub', 'Global Tech',
      'Aydi Ala', 'Pierre Dupont', 'Julie Dubois', 'Marc Morel', 'Alice Martin'
    ];
    const statusOptions: Transaction['status'][] = ['Completed', 'Pending', 'Cancelled'];

    const count = Math.min(35, days * 3 + 5);
    const list: Transaction[] = [];

    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * days));

      list.push({
        id: 'TX-' + Math.floor(10000 + Math.random() * 90000),
        date: date,
        customer: customers[Math.floor(Math.random() * customers.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        amount: Math.floor(80 + Math.random() * 3500),
        status: statusOptions[Math.floor(Math.random() * 10) < 7 ? 0 : (Math.random() < 0.5 ? 1 : 2)]
      });
    }

    return list.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // --- Analytics Helper Methods ---
  getAnalyticsChartLabel(): string {
    switch (this.activeAnalyticsMetric) {
      case 'sessions': return 'Visites (Sessions)';
      case 'conversions': return 'Taux de Conversion (%)';
      case 'bounce': return 'Taux de Rebond (%)';
      case 'value': return 'Panier Moyen (€)';
      default: return 'Sessions';
    }
  }

  getAnalyticsChartDataPoints(): number[] {
    const range = this.getDaysCount();
    let baseData: number[] = [];

    if (this.activeAnalyticsMetric === 'sessions') {
      if (range === 1) baseData = [320, 480, 520, 610, 890, 1200, 950];
      else if (range === 7) baseData = [4500, 5200, 4900, 6100, 5800, 7200, 8500];
      else if (range === 30) baseData = [24000, 29000, 27500, 34000];
      else baseData = [78000, 92000, 105000];
    } else if (this.activeAnalyticsMetric === 'conversions') {
      if (range === 1) baseData = [2.4, 2.9, 3.1, 3.2, 3.5, 3.8, 3.6];
      else if (range === 7) baseData = [3.2, 3.4, 3.3, 3.6, 3.5, 3.8, 4.1];
      else if (range === 30) baseData = [3.1, 3.4, 3.2, 3.8];
      else baseData = [3.0, 3.3, 3.8];
    } else if (this.activeAnalyticsMetric === 'bounce') {
      if (range === 1) baseData = [48, 46, 45, 43, 40, 38, 41];
      else if (range === 7) baseData = [45, 43, 44, 41, 40, 38, 36];
      else if (range === 30) baseData = [45, 42, 43, 38];
      else baseData = [46, 43, 38];
    } else {
      if (range === 1) baseData = [58, 62, 60, 65, 68, 74, 71];
      else if (range === 7) baseData = [64, 68, 66, 72, 70, 78, 84];
      else if (range === 30) baseData = [65, 71, 68, 84];
      else baseData = [62, 70, 84];
    }
    return baseData;
  }
}
