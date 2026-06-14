package com.example.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "exame_lab")
@Data
public class ExameLab {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "atendimento_id", nullable = false)
    @JsonIgnore
    private Atendimento atendimento;
}