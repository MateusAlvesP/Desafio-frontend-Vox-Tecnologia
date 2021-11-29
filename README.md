# Desafio Frontend para a empresa Vox Tecnologia

# O desafio
Construir um sistema de solicitações de abertura de empresa. Veja o mockup e use como base para as telas.

<p>
  <img src="https://user-content.gitlab-static.net/9fbb371c962c306ea8d7b27420ae44f81579c514/68747470733a2f2f692e6962622e636f2f7164434b3372342f6d6f636b75702d6465736166696f2d66726f6e742e706e67" width="1000"/>
</p>

# Resultado
Neste desafio foi desenvolvido um sistema de abertura de empresas utilizando a framework Angular (v12.2.5) e a biblioteca UI Bootsrap.

Para executar o projeto é necessário utilizar o seguinte comando na pasta raiz:
```
ng serve -o
```
Também é necessário instalar e rodar a api fake com:
```
npm install -g json-server
cd db
json-server --watch db.json
```
Se a api não for iniciada, o projeto não funcionará como esperado.

As imagens abaixo mostram algumas telas do sistema:

## 1) Tela Inicial
Nessa tela são listados todos os pedidos de abertura de empresa. É possível visualizar mais informações sobre o andamento de um pedido de abertura clicando no botão **Visualizar**, que mostra informações adicionais no lado direito da barra vertical azul. Clicando no botão **Solicitar Abertura** no canto superior direito é possível criar um novo de pedido de abertura de empresas. Também é possível editar informações de um pedido já existente clicando em **Editar**.

<p>
  <img src="https://i.imgur.com/2O7dp9H.png" width="1000"/>
</p>

## 2) Tela de solicitação ou edição de pedidos de abertura
Tanto solicitar um novo pedido como editar um já existente abrem a mesma tela. A diferença é que ao editar um pedido os campos já vem preenchidos.

<p>
  <img src="https://i.imgur.com/9Zs6tav.png" width="1000"/>
</p>

## 3) Modal com mensagem de sucesso.
Caso os dados inseridos pelo usuário passem pelas validações, é mostrado um modal com mensagem de sucesso. 

<p>
  <img src="https://i.imgur.com/o3ckrca.png" width="1000"/>
</p>
