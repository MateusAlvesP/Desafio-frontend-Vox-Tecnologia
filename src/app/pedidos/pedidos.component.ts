import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InterfaceService } from '../interface.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  idAtual: string = "";
  nomeEmpresa: string = "";
  responsavel: string = "";
  cpf: string = "";
  endereco: string = "";
  bairro: string = "";
  cidade: string = "";
  cep: string = "";
  complemento: string = "";
  uf: string = "";
  numero: string = "";

  visualiza: boolean = false;

  pedidos: any[] = [];

  pedidosUrl = "http://localhost:3000/empresas";
  pedidoUrl = "http://localhost:3000/empresas/$";
  cidadeUrl = "https://servicodados.ibge.gov.br/api/v1/localidades/municipios/$"
  estadoUrl = "https://servicodados.ibge.gov.br/api/v1/localidades/estados/$";
  
  constructor(private http: HttpClient, private Interface: InterfaceService) { }

  ngOnInit(): void {
    this.http.get<any>(this.pedidosUrl).subscribe(data => {
      this.pedidos = data;
    });
  }

  mostraDetalhes(id: string): void{
    
    if(this.idAtual == id){
      this.visualiza = !this.visualiza;
      return;
    }

    if(!this.visualiza) this.visualiza = !this.visualiza;

    this.idAtual = id;
    
    if(this.visualiza){
      this.http.get<any>(this.pedidoUrl.replace('$', id)).subscribe(data => {
        
        this.Interface.set(data);
        this.Interface.setId(data.id);

        this.nomeEmpresa = data.empresa.ds_nome_fantasia;
        this.responsavel = data.solicitante.ds_responsavel;
        this.cpf = data.solicitante.nu_cpf;
        this.endereco = data.empresa.endereco.ds_logradouro;
        this.bairro = data.empresa.endereco.ds_bairro;
        this.cep = data.empresa.endereco.co_cep;
        this.complemento = data.empresa.endereco.ds_complemento;
        this.numero = data.empresa.endereco.co_numero;
        this.http.get<any>(this.cidadeUrl.replace('$', data.empresa.endereco.co_municipio)).subscribe(data2 => {
          this.cidade = data2.nome;
        });
        this.http.get<any>(this.estadoUrl.replace('$', data.empresa.endereco.co_uf)).subscribe(data3 => {
          this.uf = data3.nome;
        });

      })
    }

  }

  resetPedido(){
    this.Interface.set({});
    this.Interface.setId('0');
  }

}
