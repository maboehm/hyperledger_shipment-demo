import { Logger } from './../logger/logger';
import { ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class SimpleToast {
  constructor(private toastController: ToastController) {

  }
  /**
   * Presents a ionic toast message given the parameters
   * @param message - The message to display
   * @param time - Time in ms to show the message
   * @param onDismiss - Optional callback for when the message was dismissed, either after the timeout or by the user
   * @param position - Optional position ("top", "middle", "bottom"), default: "bottom"
   */
  public present(message: string, time: number, onDismiss?, position?: string) {
    let toast = this.toastController.create({
      message: message,
      duration: time,
      position: position ? position : 'bottom',
      showCloseButton: true,
      closeButtonText: "OK"
    });
    let onDidDismiss = onDismiss ? onDismiss : () => Logger.log('Dismissed toast')
    toast.onDidDismiss(onDidDismiss)

    toast.present();
  }
}
