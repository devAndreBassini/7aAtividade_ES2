package com.example.repository;

import com.example.model.CategoriaProfissional;
import com.example.model.ProfissionalDeSaude;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProfissionalRepository extends JpaRepository<ProfissionalDeSaude, Long> {
    
    // Consultar(Nome)
    List<ProfissionalDeSaude> findByNomeContainingIgnoreCase(String nome);
    
    // Consultar(categoria)
    List<ProfissionalDeSaude> findByCategoria(CategoriaProfissional categoria);
}