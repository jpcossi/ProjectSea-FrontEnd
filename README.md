# Projeto Sea

Este projeto consiste em um sistema de gerenciamento de usuários com funções para cadastro, edição, deleção e visualização de usuários. Há dois tipos de contas: "usuário admin" e "usuário padrão". Dentro da aplicação, é possível cadastrar contas de usuários padrão ou admin na página de login. Os usuários cadastrados como admin têm permissões adicionais, como:

- Editar, deletar e visualizar uma lista de todos os usuários
- Visualizar detalhes de usuários específicos

## Tecnologias Utilizadas
Backend: Java, Spring Boot, Maven, Spring Security, MySQL, JWT, Hibernate


Frontend: JavaScript, TypeScript, React, Node, Axios, ShadCN UI, TailwindCSS, Vite, ViaCEP

## Sumário
- Pré-requisitos
- Instruções de Inicialização

## Pré-requisitos
Antes de iniciar, é necessário ter os seguintes programas instalados:

- Node.js e npm (para gerenciar pacotes do frontend)
- Java JDK 8
- Maven (para gerenciamento de dependências do backend)
- MySQL (para o banco de dados)
- VSCode ou qualquer editor de código de sua preferência


## Instruções de Inicialização
### Backend
Observação: O projeto já tem um banco de dados usando o Aiaven com os dois cadastros solicitados, as instruções a seguir são para configurar o banco localmente, caso necessário. 
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


## Funcionalidades
- Cadastro de Usuários: Adicione novos usuários, especificando se são "admin" ou "usuário padrão".
- Gerenciamento de Usuários: Usuários com perfil admin podem editar, visualizar e deletar outros usuários.
- Autenticação JWT: A aplicação utiliza autenticação com JWT para proteger endpoints sensíveis.
- Consulta de Endereço via CEP: Implementação de consulta de endereço usando o ViaCEP

## Uso
Após iniciar ambos os servidores, você poderá acessar a aplicação no navegador através da URL do frontend (http://localhost:5173). Siga os passos para realizar login e testar as funcionalidades conforme o propósito do projeto.

## Contato
Em caso de dúvidas, entre em contato comigo através de jppcossi@gmail.com.
