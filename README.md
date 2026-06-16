# Trabalho 7 - Engenharia de Software II
---
## Principais Funcionalidades
### 1. Gestão de Profissionais de Saúde
 * **Cadastro Completo:** Registro de nome, telefone, endereço e categoria do profissional.
 * **Operações CRUD:** Criação, leitura, atualização e remoção de registros de profissionais.
 * **Busca Inteligente:** Consulta de profissionais por nome, ID ou categoria.
### 2. Gestão de Atendimentos
 * **Histórico de Consultas:** Registro de data, horário e descrição do problema relatado.
 * **Receituário Dinâmico:** Registro de orientações personalizadas baseadas na especialidade:
   * *Médico:* Prescrição de medicamentos.
   * *Fisioterapeuta:* Indicação de atividades físicas.
   * *Psicólogo:* Indicação de atividades mentais.
### 3. Gestão de Exames
 * **Vinculação:** Possibilidade de anexar diversos exames laboratoriais a um único atendimento, mantendo o histórico clínico organizado.
## Tecnologias Utilizadas
 * **Backend:** Java com Spring Boot.
 * **Banco de Dados:** H2 Database
 * **Build:** Maven.
