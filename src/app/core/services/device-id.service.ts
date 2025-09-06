// src/app/core/services/device-id.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceIdService {

  private deviceId: string;

  constructor() {
    this.deviceId = this.getOrGenerateDeviceId();
  }

  /**
   * Obtiene el deviceId del localStorage. Si no existe, genera uno nuevo,
   * lo guarda y lo retorna.
   */
  private getOrGenerateDeviceId(): string {
    let storedId = localStorage.getItem('userDeviceId');

    if (!storedId) {
      storedId = this.generateUUID();
      localStorage.setItem('userDeviceId', storedId);
    }
    
    return storedId;
  }

  /**
   * Genera un Identificador Único Universal (UUID) simple.
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, 
            v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Método público para obtener el ID del dispositivo.
   */
  public getDeviceId(): string {
    return this.deviceId;
  }
}