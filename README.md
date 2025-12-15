📌 Teste Técnico – Cadastro de Clientes e Beneficiários

Este projeto tem como objetivo implementar melhorias e novas funcionalidades no módulo de Cadastro de Clientes, atendendo aos requisitos funcionais e técnicos propostos no teste.

A solução foi desenvolvida seguindo boas práticas de validação, separação de responsabilidades e padronização visual, garantindo integridade dos dados e uma boa experiência do usuário.

🚀 Funcionalidades Implementadas
1️⃣ Cadastro de CPF do Cliente

Foi incluído um novo campo CPF nas telas de Cadastro e Alteração de Cliente, com as seguintes características:

Campo obrigatório

Padrão visual consistente com os demais campos da tela

Máscara de entrada no formato 999.999.999-99

Validação de CPF utilizando o cálculo oficial dos dígitos verificadores

Validação de unicidade:

Não permite o cadastro de CPF já existente no banco de dados

Persistência no banco sem máscara, garantindo padronização e confiabilidade dos dados


2️⃣ Gerenciamento de Beneficiários

Foi adicionado um botão “Beneficiários” nas telas de Cadastro e Alteração de Cliente, permitindo o gerenciamento completo dos beneficiários vinculados ao cliente.

Funcionalidades disponíveis:

Inclusão de beneficiários via pop-up

Campos disponíveis:

CPF do Beneficiário

Nome do Beneficiário

Grid para exibição dos beneficiários já incluídos

Ações disponíveis no grid:

Alterar beneficiário

Excluir beneficiário

Regras e validações:

Campos seguem o mesmo padrão visual do sistema

CPF do beneficiário com máscara 999.999.999-99

Validação de CPF com cálculo do dígito verificador

Não permite:

CPF de beneficiário inválido

Cadastro de dois beneficiários com o mesmo CPF para o mesmo cliente

Validação de CPF também realizada contra o banco de dados

Beneficiários são persistidos somente ao acionar o botão “Salvar” na tela de Cadastro/Alteração do Cliente

Persistência do CPF do beneficiário no banco sem máscara


🧠 Validações Implementadas

Client-side (JavaScript)

Máscaras de CPF aplicadas apenas para exibição e entrada de dados

Validação de CPF antes do envio do formulário

Bloqueio de duplicidade de CPF de beneficiários na lista em memória

Validação assíncrona para verificar CPF existente no banco (AJAX)

Server-side (Controller)

Validação de CPF duplicado para cliente

Validação de CPF duplicado para beneficiários

Tratamento correto de inclusão vs alteração:

Não acusa duplicidade quando o CPF pertence ao próprio registro

Normalização de dados:

Remoção de máscara de CPF antes da persistência no banco

🏗️ Arquitetura e Boas Práticas

Separação clara de responsabilidades:

View / JavaScript: Experiência do usuário e validações visuais

Controller: Validações finais e normalização dos dados

BLL / DAL: Regras de negócio e persistência

Dados sensíveis (CPF) armazenados de forma padronizada (sem máscara)

Código organizado e de fácil manutenção


📦 Tecnologias Utilizadas

ASP.NET MVC
C#
JavaScript / jQuery
AJAX
SQL Server
Bootstrap (layout e padronização visual)
