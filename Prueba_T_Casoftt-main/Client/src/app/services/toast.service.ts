import { Injectable, signal } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ToastType } from '../_types/toastType';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})

export class ToastService {
  toasts = signal<ToastType[]>([]);

  add(message: SafeHtml, type: "success" | "info" | "danger" | "warning", dismissible: boolean = true, duration: number = 3000) {
    const toasts = this.toasts();
    const toastId = uuidv4();
    toasts.push({ id: toastId, message, duration, type, dismissible });
    
    this.toasts.set(toasts);
    setTimeout(() => this.remove(toastId), duration);
   }
 
  remove(id: string) {
    const toasts = this.toasts().filter(x => x.id !== id);
    this.toasts.set(toasts);
  }

  constructor() { }
}