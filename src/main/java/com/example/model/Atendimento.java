package com.example.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "atendimento")
@Data
public class Atendimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private LocalDate data;
    private LocalTime horario;
    
    @Column(name = "problema_texto", columnDefinition = "TEXT")
    private String problemaTexto;
    
    @Column(name = "receita_saude", columnDefinition = "TEXT")
    private String receitaSaude;

    @ManyToOne
    @JoinColumn(name = "profissional_id", nullable = false)
    private ProfissionalDeSaude profesional;

    @OneToMany(mappedBy = "atendimento", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExameLab> exames = new ArrayList<>();
}