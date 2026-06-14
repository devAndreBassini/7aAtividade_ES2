package com.example.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "profissional_de_saude")
@Data
public class ProfissionalDeSaude {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    private String telefone;
    private String endereco;
    
    @Enumerated(EnumType.STRING)
    private CategoriaProfissional categoria;
}