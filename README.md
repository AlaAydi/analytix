# Analytix 📊

**Analytix** est une application web de visualisation et d'analyse de données développée avec **Angular 18**.  
Elle permet de créer un tableau de bord interactif (*dashboard*) avec des graphiques dynamiques, d'analyser les données et d'exporter les rapports au format PDF.

---

## ✨ Fonctionnalités

- 📈 Visualisation des données avec des graphiques interactifs grâce à **Chart.js**
- 📊 Tableau de bord analytique avec indicateurs clés (KPI)
- 🖼️ Capture des composants du dashboard via **html2canvas**
- 📄 Génération et export des rapports en format **PDF** avec **jsPDF**
- 🔔 Système de notifications utilisateur
- ⚡ Application **Single Page Application (SPA)** développée avec Angular 18
- 📱 Interface responsive adaptée aux différents écrans

---

## 🛠️ Stack technique

| Technologie | Utilisation |
|------------|-------------|
| Angular 18.2 | Framework Front-end |
| TypeScript | Langage principal |
| Chart.js | Création des graphiques interactifs |
| html2canvas | Capture des vues du dashboard |
| jsPDF | Export des rapports PDF |
| RxJS | Gestion des flux asynchrones |
| HTML5 / CSS3 | Structure et design de l'interface |

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version LTS recommandée)
- **Angular CLI**

Installation d'Angular CLI :

```bash
npm install -g @angular/cli
```

Vérifier les versions :

```bash
node -v
ng version
```

---

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/AlaAydi/analytix.git
```

Accéder au dossier :

```bash
cd analytix
```

### 2. Installer les dépendances

```bash
npm install
```

---

## 💻 Lancer l'application en local

Démarrer le serveur Angular :

```bash
ng serve
```

Puis ouvrir votre navigateur :

```
http://localhost:4200/
```

L'application se recharge automatiquement après chaque modification du code source.

---

## 🏗️ Build de production

Pour générer la version optimisée de production :

```bash
ng build --configuration production
```

Les fichiers générés seront disponibles dans :

```
dist/
```

---

## 🧪 Tests

Lancer les tests unitaires :

```bash
ng test
```

Les tests utilisent :

- **Karma**
- **Jasmine**

---

## 📁 Structure du projet

```
analytix/
│
├── public/                     # Ressources statiques
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── kpi-grid/
│   │   │   ├── reports-view/
│   │   │   ├── transaction-table/
│   │   │   └── toast-notification/
│   │   │
│   │   ├── services/           # Services Angular
│   │   └── models/             # Interfaces et modèles TypeScript
│   │
│   ├── assets/                 # Images et ressources
│   └── environments/           # Configuration environnement
│
├── angular.json                # Configuration Angular CLI
├── package.json                # Dépendances npm
├── tsconfig.json               # Configuration TypeScript
└── README.md
```

---

## 🌐 Déploiement

L'application peut être déployée facilement sur :

- **Vercel**
- **Netlify**
- **Firebase Hosting**

Exemple avec Vercel :

```bash
ng build --configuration production
```

Puis connecter le repository GitHub à Vercel.

---

## 🤝 Contribution

Les contributions sont les bienvenues.

Étapes :

1. Forker le projet
2. Créer une nouvelle branche :

```bash
git checkout -b feature/nouvelle-fonctionnalite
```

3. Ajouter vos modifications :

```bash
git add .
```

4. Créer un commit :

```bash
git commit -m "Ajout d'une nouvelle fonctionnalité"
```

5. Envoyer les changements :

```bash
git push origin feature/nouvelle-fonctionnalite
```

6. Créer une Pull Request.

---

## 📄 Licence

Ce projet est actuellement sans licence.

Vous pouvez ajouter une licence comme :

- MIT
- Apache 2.0

selon vos besoins.

---

## 👤 Auteur

**Ala Aydi**

🔗 GitHub :  
https://github.com/AlaAydi
