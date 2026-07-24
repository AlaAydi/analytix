Analytix 📊

Analytix est un tableau de bord d'analyse de données (dashboard) développé avec Angular. Il permet de visualiser des données sous forme de graphiques interactifs et d'exporter les rapports au format PDF.

✨ Fonctionnalités
📈 Visualisation de données via des graphiques interactifs (basés sur Chart.js)
🖼️ Capture d'écran des vues du dashboard (via html2canvas)
📄 Export des rapports/graphiques en PDF (via jsPDF)
⚡ Application mono-page (SPA) construite avec Angular 18
🛠️ Stack technique
Techno	Usage
Angular 18.2	Framework front-end
Chart.js	Génération des graphiques
html2canvas	Capture DOM → image
jsPDF	Génération de fichiers PDF
TypeScript / RxJS	Logique applicative
📋 Prérequis
Node.js (version LTS recommandée)
Angular CLI installé globalement :
bash
npm install -g @angular/cli
🚀 Installation
Cloner le dépôt :
bash
git clone https://github.com/AlaAydi/analytix.git
cd analytix
Installer les dépendances :
bash
npm install
💻 Démarrage en local

Lancer le serveur de développement :

bash
ng serve

Puis ouvrir votre navigateur sur http://localhost:4200/. L'application se recharge automatiquement à chaque modification des fichiers sources.

🏗️ Build

Pour générer une version de production :

bash
ng build

Les fichiers compilés seront placés dans le dossier dist/.

🧪 Tests

Exécuter les tests unitaires (via Karma) :

bash
ng test
📁 Structure du projet
analytix/
├── .vscode/          # Configuration de l'éditeur
├── public/           # Fichiers statiques publics
├── src/               # Code source de l'application
│   ├── app/           # Composants, services, modules Angular
│   └── ...
├── angular.json       # Configuration Angular CLI
├── package.json       # Dépendances et scripts npm
└── tsconfig*.json     # Configuration TypeScript
🤝 Contribution

Les contributions sont les bienvenues !

Forkez le projet
Créez votre branche (git checkout -b feature/ma-fonctionnalite)
Committez vos changements (git commit -m 'Ajout de ma fonctionnalité')
Poussez la branche (git push origin feature/ma-fonctionnalite)
Ouvrez une Pull Request
📄 Licence

Ce projet n'a pas encore de licence définie. Ajoutez un fichier LICENSE si vous souhaitez en spécifier une (MIT, Apache 2.0, etc.).

👤 Auteur
AlaAydi – GitHub