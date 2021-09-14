import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InterfaceService {
  
  pedido: object = {};
  id: string = '0';

  set(p: object){
    this.pedido = p;
  }
  get(){
    return this.pedido;
  }

  setId(id: string){
    this.id = id;
  }
  getId(){
    return this.id;
  }

}
