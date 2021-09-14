import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { InterfaceService } from '../interface.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  form = this.fb.group({
    responsavel: ['', [Validators.required, Validators.pattern('[a-zA-Z áéíóúãõâêîôûÁÉÍÓÚÃÕÂÊÎÔÛ]*')]],
    cpf: ['', [Validators.required, Validators.pattern('[0-9-.]*')]],
    dataNascimento: ['', Validators.required],
    nomeFantasia: ['', Validators.required],
    naturezaNome: ['', Validators.required],
    entidadeNome: ['', Validators.required],
    cep: ['', [Validators.required, Validators.pattern('[0-9-]*')]],
    endereco: ['', Validators.required],
    bairro: ['', Validators.required],
    complemento: [''],
    cidadeNome: ['', Validators.required],
    estadoNome: ['', Validators.required],
  });
  
  naturezas: any = [];
  naturezasNome: string[] = [];
  entidades: any = [];
  entidadesNome: string[] = [];
  estados: any = [];
  estadosNome: string[] = [];
  cidades: any = [];
  cidadesNome: string[] = [];

  naturezasUrl: string = "http://localhost:3000/natureza-juridica";
  entidadesUrl: string = "http://localhost:3000/entidade-registro";
  cepUrl: string = "http://viacep.com.br/ws/$/json/";
  cidadesUrl: string = "https://servicodados.ibge.gov.br/api/v1/localidades/estados/$/municipios";
  estadosUrl: string = "https://servicodados.ibge.gov.br/api/v1/localidades/estados/";
  postUrl: string = "http://localhost:3000/empresas";
  putUrl: string = "http://localhost:3000/empresas/$";

  post: boolean = true;
  modalText: string = "";

  loading: boolean = true;

  constructor(private http: HttpClient, private fb: FormBuilder, private Interface: InterfaceService) { }

  async ngOnInit(): Promise<void> {

    this.http.get<any>(this.naturezasUrl).subscribe(data => {
      this.naturezas = data;
      this.naturezasNome = this.naturezas.map((n: any) => n.value).sort();
    });

    this.http.get<any>(this.entidadesUrl).subscribe(data => {
      this.entidades = data;
      this.entidadesNome = this.entidades.map((e: any) => e.value).sort();
    });
    
    this.http.get<any>(this.estadosUrl).subscribe(data => {
      this.estados = data;
      this.estadosNome = this.estados.map((e: any) => e.nome).sort();
    });

    await new Promise(f => setTimeout(f, 300));

    const pedido: any = this.Interface.get();
    if(!(Object.keys(pedido).length === 0)){
      this.post = false;
      this.loadValues(pedido);
    }
    
    this.loading = false;
    
  }

  onSubmit(){

    if(this.form.invalid) return;
    

    const co_entidade = this.entidades.find((e: any) => e.value == this.entidadeNome!.value).key;
    const co_natureza = this.naturezas.find((n: any) => n.value == this.naturezaNome!.value).key;

    const co_municipio = this.cidades.find((c: any) => c.nome == this.cidadeNome!.value).id;
    const co_uf = this.estados.find((e: any) => e.nome == this.estadoNome!.value).id;
    
    const body = {
      "solicitante": {
        "ds_responsavel": this.responsavel!.value,
        "nu_cpf": this.cpf!.value,
        "date_nascimento": this.dataNascimento!.value
      },
      "empresa": {
        "ds_nome_fantasia": this.nomeFantasia!.value,
        "co_entidade_registro": co_entidade,
        "co_natureza_juridica": co_natureza,
        "endereco": {
          "co_cep": this.cep!.value,
          "ds_logradouro": this.endereco!.value,
          "co_numero": "233",
          "ds_complemento": this.complemento!.value,
          "ds_bairro": this.bairro!.value,
          "co_municipio": co_municipio,
          "co_uf": co_uf
        }
      }
    }
    
    if(this.post){
      this.modalText = "Solicitação cadastrada com sucesso";
      this.http.post<any>(this.postUrl, body).subscribe(data => {
        console.log(data);
      });
    }
    else{
      this.modalText = "Edição registrada com sucesso";
      this.http.put<any>(this.putUrl.replace('$', this.Interface.getId()), body).subscribe(data => {
        console.log(data);
      });
    }

    

  }

  async loadValues(pedido: any): Promise<void>{

    const estado = this.estados.find((e: any) => e.id == pedido.empresa.endereco.co_uf);
       
    this.http.get<any>(this.cidadesUrl.replace('$', estado.id)).subscribe(async (data) => {
      this.cidades = data;
      await new Promise(f => setTimeout(f, 100));
      this.cidadesNome = this.cidades.map((c: any) => c.nome).sort();
      const cidade = this.cidades.find((c: any) => c.id == pedido.empresa.endereco.co_municipio);
      
      this.cidadeNome!.setValue(cidade.nome);
    });

    const natureza = this.naturezas.find((n: any) => n.key == pedido.empresa.co_natureza_juridica);
    const entidade = this.entidades.find((e: any) => e.key == pedido.empresa.co_entidade_registro);

    this.responsavel!.setValue(pedido.solicitante.ds_responsavel);
    this.cpf!.setValue(pedido.solicitante.nu_cpf);
    this.dataNascimento!.setValue(pedido.solicitante.date_nascimento);
    this.nomeFantasia!.setValue(pedido.empresa.ds_nome_fantasia);
    this.naturezaNome!.setValue(natureza.value);
    this.entidadeNome!.setValue(entidade.value);
    this.cep!.setValue(pedido.empresa.endereco.co_cep);
    this.endereco!.setValue(pedido.empresa.endereco.ds_logradouro);
    this.bairro!.setValue(pedido.empresa.endereco.ds_bairro);
    this.complemento!.setValue(pedido.empresa.endereco.ds_complemento);
    this.estadoNome!.setValue(estado.nome);
  }

  cepChange(): void{
    const cep = this.cep!.value;
    if( (cep.length == 8 && !cep.includes('-')) || (cep.length == 9 && cep.includes('-')) ){
      this.http.get<any>(this.cepUrl.replace('$', cep)).subscribe(data => {
        if(!data.erro){
          this.endereco!.setValue(data.logradouro);
          this.bairro!.setValue(data.bairro);
          this.complemento!.setValue(data.complemento);
          const estado = this.estados.find((e: any) => e.sigla == data.uf);
          this.estadoNome!.setValue(estado.nome);
          this.http.get<any>(this.cidadesUrl.replace('$', estado.id)).subscribe(data2 => {
            this.cidades = data2;
            this.cidadesNome = this.cidades.map((c: any) => c.nome).sort();
            this.cidadeNome!.setValue(data.localidade);
          });
        }
      });
    }
  }

  estadoChange(): void{
    const estadoNome = this.estadoNome!.value;
    const estado = this.estados.find((e: any) => e.nome == estadoNome);
    if(estado){
      this.http.get<any>(this.cidadesUrl.replace('$', estado.id)).subscribe(data => {
        this.cidades = data;
        this.cidadesNome = this.cidades.map((c: any) => c.nome).sort();
      });
    }
    
  }

  get responsavel() {return this.form.get('responsavel');}
  get cpf() {return this.form.get('cpf');}
  get dataNascimento() {return this.form.get('dataNascimento');}
  get nomeFantasia() {return this.form.get('nomeFantasia');}
  get naturezaNome() {return this.form.get('naturezaNome');}
  get entidadeNome() {return this.form.get('entidadeNome');}
  get cep() {return this.form.get('cep');};
  get endereco() {return this.form.get('endereco');}
  get bairro() {return this.form.get('bairro');}
  get complemento() {return this.form.get('complemento');}
  get cidadeNome() {return this.form.get('cidadeNome');}
  get estadoNome() {return this.form.get('estadoNome');}

}
