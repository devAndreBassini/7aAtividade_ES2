package com.example.controller;

import com.example.model.CategoriaProfissional;
import com.example.model.ProfissionalDeSaude;
import com.example.repository.ProfissionalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/profissionais")
@CrossOrigin(origins = "*")
public class ProfissionalController {

    @Autowired
    private ProfissionalRepository repository;

    @PostMapping // Inserir
    public ProfissionalDeSaude inserir(@RequestBody ProfissionalDeSaude profissional) {
        return repository.save(profissional);
    }

    @PutMapping("/{id}") // Alterar(id)
    public ResponseEntity<ProfissionalDeSaude> alterar(@PathVariable Long id, @RequestBody ProfissionalDeSaude dados) {
        return repository.findById(id).map(p -> {
            p.setNome(dados.getNome());
            p.setTelefone(dados.getTelefone());
            p.setEndereco(dados.getEndereco());
            p.setCategoria(dados.getCategoria());
            return ResponseEntity.ok(repository.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}") // Consultar(id)
    public ResponseEntity<ProfissionalDeSaude> consultarPorId(@PathVariable Long id) {
        return repository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar-nome") // Consultar(Nome)
    public List<ProfissionalDeSaude> consultarPorNome(@RequestParam String nome) {
        return repository.findByNomeContainingIgnoreCase(nome);
    }

    @GetMapping("/buscar-categoria") // Consultar(categoria)
    public List<ProfissionalDeSaude> consultarPorCategoria(@RequestParam CategoriaProfissional categoria) {
        return repository.findByCategoria(categoria);
    }

    @DeleteMapping("/{id}") // Excluir(id)
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}