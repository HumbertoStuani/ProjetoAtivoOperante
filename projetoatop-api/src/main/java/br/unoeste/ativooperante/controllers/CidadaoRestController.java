package br.unoeste.ativooperante.controllers;

import br.unoeste.ativooperante.db.entities.Denuncia;
import br.unoeste.ativooperante.db.entities.Orgao;
import br.unoeste.ativooperante.db.entities.Tipo;
import br.unoeste.ativooperante.db.entities.Usuario;
import br.unoeste.ativooperante.db.mongo.Imagem;
import br.unoeste.ativooperante.services.*;
import br.unoeste.ativooperante.utils.JWTTokenProvider;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;

@CrossOrigin
@RestController
@RequestMapping(value = "/api/cidadao")
public class CidadaoRestController {

    @Autowired
    private TipoService tipoService;
    @Autowired
    private OrgaoService orgaoService;
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private DenunciaService denunciaService;
    @Autowired
    private ImagemService imagemService;

    @GetMapping(value = "/tipos")
    public ResponseEntity<Object> buscarTodosTipos()
    {
        return new ResponseEntity<>(this.tipoService.getAll(), HttpStatus.OK);
    }

    @GetMapping(value = "/orgaos")
    public ResponseEntity<Object> buscarTodosOrgaos() {
        return new ResponseEntity<>(this.orgaoService.getAll(), HttpStatus.OK);
    }

    @GetMapping(value = "/denuncia")
    public ResponseEntity<Object> buscarDenunciasUsuario(@RequestHeader(value = "Authorization", required = true) String token) {
        long id = JWTTokenProvider.getAllClaimsFromToken(token).get("id", Long.class);
        return new ResponseEntity<>(this.denunciaService.findByUsuario(id), HttpStatus.OK);
    }

    @GetMapping("/denuncia/imagem")
    public ResponseEntity<Object> getImagem(@RequestParam("id") Long id) {
        Imagem imagem = this.imagemService.findByDenuncia(id);
        if (imagem != null)
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imagem.getDados());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Imagem não foi fornecida.");
    }

    @PostMapping("/denuncia")
    public ResponseEntity<Object> enviarDenuncia(@RequestHeader(value = "Authorization", required = true) String token, @RequestParam String titulo, @RequestParam String texto,
                                                 @RequestParam int urgencia, @RequestParam int idOrgao, @RequestParam int idTipo, @RequestParam(required = false) MultipartFile imagem) {
        Denuncia denuncia = new Denuncia(0L, titulo, texto, urgencia, LocalDate.now(),null,null, null);
        Orgao orgao = this.orgaoService.getById((long)idOrgao);
        Tipo tipo = this.tipoService.getById((long)idTipo);
        Usuario usuario = this.usuarioService.findById(JWTTokenProvider.getAllClaimsFromToken(token).get("id", Long.class));
        denuncia.setTipo(tipo);
        denuncia.setOrgao(orgao);
        denuncia.setUsuario(usuario);
        try {
            if(JWTTokenProvider.verifyToken(token)) {
                ResponseEntity<Object> response = ResponseEntity.status(HttpStatus.CREATED).body(this.denunciaService.save(denuncia));
                if (imagem != null) {
                    long id_denuncia = ((Denuncia) response.getBody()).getId();
                    Imagem img = new Imagem(id_denuncia, imagem.getBytes());
                    if (!this.imagemService.save(img))
                        throw new BadRequestException("Erro ao salvar imagem.");
                }
                return response;
            }
            return new ResponseEntity<>("Sessão expirada.", HttpStatus.UNAUTHORIZED);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Erro ao registrar denúncia, " + e);
        }

    }
    @DeleteMapping("/denuncia")
    public ResponseEntity<Object> deletarDenuncia(@RequestHeader(value = "Authorization", required = true) String token, @RequestParam Long id) {
        long usuario_id = JWTTokenProvider.getAllClaimsFromToken(token).get("id", Long.class);
        Denuncia denuncia = this.denunciaService.findById(id);
        if (denuncia != null ) {
            if(usuario_id == denuncia.getUsuario().getId()) {
                if(this.denunciaService.delete(denuncia))
                    return ResponseEntity.ok().body("Denúncia deletada com sucesso.");
                return ResponseEntity.badRequest().body("Erro ao exlcuir denúncia.");
            }
            return ResponseEntity.badRequest().body("Denúncia não foi feita por este usuário.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Denúncia não encontrada.");
    }
}
