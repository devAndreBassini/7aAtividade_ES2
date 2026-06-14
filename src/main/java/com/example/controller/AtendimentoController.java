package com.example.controller;

import com.example.model.Atendimento;
import com.example.service.AtendimentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/atendimentos")
@CrossOrigin(origins = "*")
public class AtendimentoController {

    @Autowired
    private AtendimentoService atendimentoService;

    @PostMapping
    public ResponseEntity<?> criarAtendimento(@RequestBody Atendimento atendimento) {
        try {
            Atendimento novoAtendimento = atendimentoService.inserir(atendimento);
            return ResponseEntity.ok(novoAtendimento);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}