import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSpinner,
  IonTitle,
  IonToolbar,
  AlertController, 
  ToastController, 
  IonSearchbar, 
  IonSelect, 
  IonSelectOption,
} from '@ionic/angular';
import { CounterService } from '../services/counter.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    DatePipe,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSpinner,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
  ],
})
export class Tab2Page implements OnInit {
  readonly counterService = inject(CounterService);
  private readonly alertCtrl = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);

  searchQuery = signal('');
  sortOption = signal<'name' | 'value'>('name');

  totalSum = computed(() => {
    return this.counterService.counters().reduce((sum, item) => sum + item.value, 0);
  });

processedCounters = computed(() => {
    let currentCounters = this.counterService.counters();
    const query = this.searchQuery().toLowerCase();

    if (query) {
      currentCounters = currentCounters.filter(c => c.name.toLowerCase().includes(query));
    }

    return currentCounters.slice().sort((a, b) => {
      if (this.sortOption() === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return b.value - a.value;
      }
    });
  });

  async ngOnInit(): Promise<void> {
    await this.counterService.initialize();
  }

  async remove(id: string): Promise<void> {
    await this.counterService.remove(id);
    await this.showToast('Záznam byl odstraněn.');
  }

  async clear(): Promise<void> {
    await this.counterService.clear();
    await this.showToast('Historie byla úspěšně vymazána.');
  }

  async confirmClear(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Vymazat historii?',
      message: 'Tato akce je nevratná. Opravdu chcete smazat všechna uložená data?',
      buttons: [
        { text: 'Zrušit', role: 'cancel' },
        { 
          text: 'Smazat', 
          role: 'destructive', 
          handler: () => this.clear() 
        }
      ]
    });
    await alert.present();
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }
}