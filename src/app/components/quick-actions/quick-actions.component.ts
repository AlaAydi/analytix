import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

export type QuickActionId = 'new-report' | 'add-transaction' | 'invite-member' | 'export-backup' | 'open-settings';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.css']
})
export class QuickActionsComponent {
  @Output() actionSelected = new EventEmitter<QuickActionId>();

  actions: Array<{ id: QuickActionId; title: string; description: string; icon: string }> = [
    {
      id: 'new-report',
      title: 'Nouveau rapport',
      description: 'Créer un rapport PDF ou CSV en un clic',
      icon: 'report'
    },
    {
      id: 'add-transaction',
      title: 'Ajouter une transaction',
      description: 'Préparer la saisie d’un flux ou d’une vente',
      icon: 'transaction'
    },
    {
      id: 'invite-member',
      title: 'Inviter un membre',
      description: 'Ouvrir la gestion du profil et des accès',
      icon: 'member'
    },
    {
      id: 'export-backup',
      title: 'Exporter une sauvegarde',
      description: 'Télécharger la configuration du workspace',
      icon: 'backup'
    },
    {
      id: 'open-settings',
      title: 'Paramètres avancés',
      description: 'Accéder aux intégrations et préférences',
      icon: 'settings'
    }
  ];

  selectAction(id: QuickActionId): void {
    this.actionSelected.emit(id);
  }
}
