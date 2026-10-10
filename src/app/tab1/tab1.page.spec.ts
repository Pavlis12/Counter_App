import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';
import { Tab1Page } from './tab1.page';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
     
        {
          provide: CounterService,
          useValue: {
            add: vi.fn().mockResolvedValue(undefined),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delegate saving to CounterService', async () => {
  
    const counterService = TestBed.inject(CounterService);
    const addSpy = vi.spyOn(counterService, 'add');

    const first: SavedCounter = {
      id: 'first',
      name: 'První',
      value: 1,
      createdAt: '2026-10-10T12:00:00.000Z',
    };

  
    await component.onSaved(first);

  
    expect(addSpy).toHaveBeenCalledWith(first);
    expect(addSpy).toHaveBeenCalledTimes(1);
  });
});