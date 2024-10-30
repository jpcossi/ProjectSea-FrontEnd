# Projeto Sea

Este projeto consiste em um sistema de frontend e backend desenvolvido para gerenciar cadastro de usuários com funções de editar, deletar, adicionar e visualiza-los. Existem dois tipos de contas que são "usuário admin" e "usuário padrão". Dentro da aplicação é possivel cadastrar contas usuarios padrao ou admin na pagina de Login. Os usuários cadastrados como admin podem editar, deletar , visualizar uma lista de todos os usuarios e visualizar usuários especificos para ter informações mais detalhadas.

Tecnologias Utilizadas
Backend: Java, Spring Boot, Maven, Spring Security, MySQL, JWT, Hibernate


Frontend: JavaScript, TypeScript, React, Node, Axios, ShadCN UI, TailwindCSS, Vite, ViaCEP

## Sumário
- Pré-requisitos
- Instruções de Inicialização

## Pré-requisitos
Antes de iniciar, é necessário ter os seguintes programas instalados:

- Node.js e npm (para gerenciar pacotes do frontend)
- Java (JDK 17 ou superior)
- Maven (para gerenciamento de dependências do backend)
- MySQL (para o banco de dados)
- VSCode ou qualquer editor de código de sua preferência


## Instruções de Inicialização
### Backend
Observação: O projeto já tem um banco de dados usando o Aiaven com os dois cadastros solicitados, a abordagem abaixo seria para crir localmente. 
1. Configurar o Banco de Dados MySQL:
Crie um banco de dados no MySQL com o nome desejado e configure o arquivo application.properties (localizado em src/main/resources) com as informações do banco:
```js
spring.datasource.url=jdbc:mysql://localhost:3306/[NOME_DO_BANCO]
spring.datasource.username=[SEU_USUARIO]
spring.datasource.password=[SUA_SENHA]
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```
2. Inicializar o Backend:

- Abra o terminal e navegue até o diretório do projeto backend.
- Execute o comando Maven para baixar as dependências:
```js
mvn clean install
```
- Em seguida, inicie o servidor com:
```js
mvn spring-boot:run
```
- O backend estará disponível em http://localhost:8080.
3. Testar a Autenticação:
  O projeto utiliza JWT para autenticação. Para realizar login, você pode acessar o endpoint /auth/login e obter um token para acessar os demais endpoints protegidos.


## Frontend
1. Configurar o Ambiente:

- Navegue até o diretório do projeto frontend no terminal.
- Instale as dependências necessárias:
```js
npm install
```
2. Iniciar o Frontend:

- No terminal, execute:
```js
npm run dev
```
- O frontend estará acessível em http://localhost:5173 (ou outra porta especificada).

## Uso
Após iniciar ambos os servidores, você poderá acessar a aplicação no navegador através da URL do frontend (http://localhost:5173). Siga os passos para realizar login e testar as funcionalidades conforme o propósito do projeto.

## Contato
Em caso de dúvidas, entre em contato comigo através de jppcossi@gmail.com.
