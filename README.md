# App de Conversão de Moedas em Tempo Real com Ionic

Este é um aplicativo móvel híbrido desenvolvido com Ionic e Angular que permite aos usuários converter moedas em tempo real (com base em uma API de taxas diárias), visualizar a lista de moedas suportadas e gerenciar um histórico de conversões.

##  Funcionalidades Principais

* **Conversão de Moedas:** Converta valores entre diversas moedas globais.
* **Seleção Intuitiva de Moedas:** Interface de seleção de moedas amigável com busca e exibição de bandeiras.
* **Histórico de Conversões:** Armazena e exibe um histórico das suas conversões realizadas.
* **Modo Offline:** Capacidade de realizar conversões usando as últimas taxas de câmbio armazenadas em cache, mesmo sem conexão com a internet.
* **Notificações (Toasts):** Feedback visual para ações como conversão, erros e status de conexão.

##  Tecnologias Utilizadas

* **Framework:** Ionic Framework (v6+)
* **Front-end:** Angular (v15+)
* **Linguagem:** TypeScript
* **APIs:**
    * **ExchangeRate-API.com:** Para taxas de câmbio e códigos de moedas.
* **Gerenciamento de Estado/Dados:**
    * `@capacitor/network`: Para detecção de status da rede.
    * Serviço de cache local (OfflineDataService) para persistência de dados offline.

##  Configuração e Instalação

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente de desenvolvimento.

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

* [Node.js](https://nodejs.org/): Versão LTS recomendada.
* [npm](https://www.npmjs.com/): Vem com o Node.js.
* [Ionic CLI](https://ionicframework.com/docs/cli): `npm install -g @ionic/cli`
* [Angular CLI](https://angular.io/cli): `npm install -g @angular/cli`
* [Visual Studio Code](https://code.visualstudio.com/) (ou seu editor de código preferido)

### Chave de API

O projeto utiliza a [ExchangeRate-API.com](https://www.exchangerate-api.com/).

1.  Crie uma conta gratuita em [https://www.exchangerate-api.com/](https://www.exchangerate-api.com/).
2.  Obtenha sua **Chave de API (API Key)**.
3.  Abra o arquivo `src/app/services/currency.service.ts`.
4.  Substitua `'CHAVE_API'` pela chave de API:
    ```typescript
    private apiKey = 'CHAVE_API'; // Substitua por sua chave - Linha 12
    ```

### Passos de Instalação

1.  **Clone o repositório (se aplicável) ou descompacte o projeto.**
    (Ex: `git clone https://github.com/joaofelipelira/App-de-Convers-o-de-Moedas-em-Tempo-Real-com-Ionic.git`)

2.  **Navegue até o diretório do projeto no seu terminal (CMD/PowerShell/Bash):**
    ```bash
    cd /caminho/para/o/seu/projeto/ConversorDeMoedas
    ```

3.  **Instale as dependências do Node.js:**
    ```bash
    npm install
    ```

4.  **Limpe o cache do Angular CLI (opcional, mas recomendado após reinstalação):**
    ```bash
    ng cache clean --force
    ```

