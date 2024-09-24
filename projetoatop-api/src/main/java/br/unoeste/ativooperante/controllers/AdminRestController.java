package br.unoeste.ativooperante.controllers;


import br.unoeste.ativooperante.db.Conexao;
import br.unoeste.ativooperante.db.entities.*;
import br.unoeste.ativooperante.db.mongo.Imagem;
import br.unoeste.ativooperante.utils.ReportGenerator;
import org.springframework.http.*;
import br.unoeste.ativooperante.services.*;
import br.unoeste.ativooperante.utils.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.ResultSet;

@CrossOrigin
@RestController
@RequestMapping(value = "/api/admin")
public class AdminRestController {

    @Autowired
    private OrgaoService orgaoService;
    @Autowired
    private TipoService tipoService;
    @Autowired
    private ImagemService imagemService;
    @Autowired
    private DenunciaService denunciaService;
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private ResourceLoader resourceLoader;

    @PostMapping("/register")
    public ResponseEntity<Object> registrarAdmin(@RequestBody Usuario usuario) {
        Usuario usuarioExistente = usuarioService.findByEmail(usuario.getEmail());
        if(usuarioExistente != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email já cadastrado");
        }
        usuario.setNivel(1);
        usuario.setSenha(PasswordEncoder.hashPassword(usuario.getSenha()));
        this.usuarioService.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuario registrado com sucesso");
    }

    //CRUD ORGAOS
    @PostMapping("/orgao")
    public ResponseEntity<Object> addOrgao (@RequestBody Orgao orgao)
    {
        Orgao novo = this.orgaoService.save(orgao);
        return new ResponseEntity<>(novo,HttpStatus.OK);
    }
    @GetMapping("/orgao")
    public ResponseEntity<Object> buscarUm(@RequestParam("id") Long id) {
        Orgao orgao = this.orgaoService.getById(id);
        if(orgao != null)
            return new ResponseEntity<>(orgao,HttpStatus.OK);
        return new ResponseEntity<>("Órgão não existe.",HttpStatus.NOT_FOUND);
    }

    @GetMapping(value = "/orgao/all")
    public ResponseEntity<Object> buscarTodos()
    {
        return new ResponseEntity<>(this.orgaoService.getAll(),HttpStatus.OK);
    }

    @PatchMapping("/orgao")
    public ResponseEntity<Object> alteraOrgao(@RequestParam("id") Long id, @RequestBody Orgao orgaoUpdate)
    {
        Orgao aux = orgaoService.alterar(id, orgaoUpdate);
        if(aux != null)
            return new ResponseEntity<>(aux,HttpStatus.OK);
        return new ResponseEntity<>("",HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/orgao")
    public ResponseEntity<Object> excluirOrgao(@RequestParam(value = "id") Long id) {
        if(this.orgaoService.delete(id))
            return new ResponseEntity<>("",HttpStatus.OK);
        return new ResponseEntity<>("",HttpStatus.BAD_REQUEST);
    }


    //CRUD TIPOS
    @PostMapping(value = "/tipo")
    public ResponseEntity<Object> addTipoProblemas(@RequestBody Tipo tipo)
    {
        return new ResponseEntity<>(this.tipoService.saveTipo(tipo),HttpStatus.OK);
    }

//    @GetMapping("/tipo")
//    public ResponseEntity<Object> getTipo(@RequestParam("id") Long id) {
//        return new ResponseEntity<>(this.tipoService.getById(id),HttpStatus.OK);
//    }

    @GetMapping(value = "/tipo/all")
    public ResponseEntity<Object> listaTipos ()
    {return new ResponseEntity<>(this.tipoService.getAll(),HttpStatus.OK);
    }

    @PatchMapping(value = "/tipo")
    public ResponseEntity<Object> alterarTipo (@RequestParam(value = "id") Long id,@RequestBody Tipo tipoUpdate)
    {
        Tipo tipo = this.tipoService.alterar(id,tipoUpdate);
        if(tipo != null)
            return new ResponseEntity<>(tipo,HttpStatus.OK);
        return new ResponseEntity<>("Tipo não existe.",HttpStatus.NOT_FOUND);
    }

    @DeleteMapping(value = "/tipo")
    public ResponseEntity<Object> excluirTipo(@RequestParam(value = "id") Long id)
    {
        if(tipoService.delete(id))
            return new ResponseEntity<>("Tipo deletado.",HttpStatus.OK);
        return new ResponseEntity<>("Erro ao excluir.",HttpStatus.BAD_REQUEST);
    }

    //CRUD DENUNCIAS - ADMIN
    @GetMapping("/denuncia/all")
    public ResponseEntity<Object> getDenuncias() {
        return new ResponseEntity<>(this.denunciaService.findAll(),HttpStatus.OK);
    }

    @GetMapping("/denuncia")
    public ResponseEntity<Object> getDenuncia(@RequestParam(value = "id") Long id) {
        return new ResponseEntity<>(this.denunciaService.findById(id),HttpStatus.OK);
    }

    @GetMapping("/denuncia/imagem")
    public ResponseEntity<Object> getImagem(@RequestParam("id") Long id) {
        Imagem imagem = this.imagemService.findByDenuncia(id);
        if (imagem != null)
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imagem.getDados());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Imagem não foi fornecida.");
    }

    @PatchMapping("/denuncia")
    public ResponseEntity<Object> alterarDenuncia(@RequestParam("id") Long id, @RequestBody Denuncia denunciaUpdate) {
        Denuncia denuncia = this.denunciaService.update(id, denunciaUpdate);
        if (denuncia != null)
            return ResponseEntity.ok(denuncia);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Denúncia não encontrada.");
    }

//    @PutMapping("/denuncia/imagem")
//    public ResponseEntity<Object> alterarImagem(@RequestParam("id") Long id, @RequestParam MultipartFile imagemUpdate) throws IOException {
//        Denuncia denuncia = this.denunciaService.findById(id);
//        if(denuncia != null) {
//            Imagem imagem = this.imagemService.update(id, imagemUpdate.getBytes());
//            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imagem.getDados());
//        }
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Denúncia não encontrada.");
//    }

    @PatchMapping("/denuncia/feedback")
    public ResponseEntity<Object> adicionarFeedback(@RequestParam("id") Long id, @RequestBody Feedback feedback) {
        Denuncia denuncia = this.denunciaService.addFeedback(id, feedback);
        if(denuncia != null)
            return new ResponseEntity<>(denuncia, HttpStatus.OK);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Denúncia não encontrada.");
    }

    @GetMapping("/denuncia/feedbacks")
    public ResponseEntity<Object> getFeedback() {
        return new ResponseEntity<>(this.denunciaService.getFeedbacks(),HttpStatus.OK);
    }

    @GetMapping("/report")
    public ResponseEntity<byte[]> geraRelatorio () throws IOException, IOException {
        byte[] contents = ReportGenerator.gerarRelatorioPDF();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        ResponseEntity<byte[]> response = new ResponseEntity<>(contents, headers, HttpStatus.OK);
        return response;
    }


}
