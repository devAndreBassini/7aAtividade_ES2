package com.example.service;

import com.example.model.Atendimento;
import com.example.model.ProfissionalDeSaude;
import com.example.repository.AtendimentoRepository;
import com.example.repository.ProfissionalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AtendimentoService {

    @Autowired
    private AtendimentoRepository atendimentoRepository;

    @Autowired
    private ProfissionalRepository profissionalRepository;

    public Atendimento inserir(Atendimento atendimento) {
        if (atendimento.getProfesional() == null || atendimento.getProfesional().getId() == null) {
            throw new IllegalArgumentException("O atendimento necessita de um profissional associado.");
        }

        ProfissionalDeSaude prof = profissionalRepository.findById(atendimento.getProfesional().getId())
                .orElseThrow(() -> new IllegalArgumentException("Profissional de saúde não encontrado."));
        
        atendimento.setProfesional(prof);
        String receita = atendimento.getReceitaSaude() != null ? atendimento.getReceitaSaude().toLowerCase() : "";

        // Regra de Negócio Obrigatória extraída diretamente da imagem da lousa
        switch (prof.getCategoria()) {
            case MEDICO:
                if (!receita.contains("remédio")) {
                    throw new IllegalArgumentException("Erro: Para Médicos, a receita deve conter obrigatoriamente a palavra 'Remédio'.");
                }
                break;
            case FISIOTERAPEUTA:
                if (!receita.contains("atividade física")) {
                    throw new IllegalArgumentException("Erro: Para Fisioterapeutas, a receita deve conter obrigatoriamente a expressão 'Atividade física'.");
                }
                break;
            case PSICOLOGO:
                if (!receita.contains("atividades mentais")) {
                    throw new IllegalArgumentException("Erro: Para Psicólogos, a receita deve conter obrigatoriamente a expressão 'Atividades mentais'.");
                }
                break;
        }

        // Mapeia bidirecionalmente os exames para salvar tudo em cascata
        if (atendimento.getExames() != null) {
            atendimento.getExames().forEach(exame -> exame.setAtendimento(atendimento));
        }

        return atendimentoRepository.save(atendimento);
    }
}