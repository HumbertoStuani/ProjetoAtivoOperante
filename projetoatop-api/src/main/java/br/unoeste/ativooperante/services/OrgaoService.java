package br.unoeste.ativooperante.services;

import br.unoeste.ativooperante.db.entities.Orgao;
import br.unoeste.ativooperante.db.repository.OrgaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrgaoService {

    @Autowired
    private OrgaoRepository orgaoRepository;

    public Orgao save(Orgao orgao)
    {
        return this.orgaoRepository.save(orgao);
    }

    public Orgao getById (Long id)
    {
        return this.orgaoRepository.findById(id).get();
    }

    public List<Orgao> getAll()
    {
        return this.orgaoRepository.findAll();
    }

    public boolean delete (Long id)
    {
        try {
            this.orgaoRepository.deleteById(id);
        }catch (Exception e)
        {
            return false;
        }
        return true;
    }

    public Orgao alterar (Long id,Orgao orgao)
    {
        Orgao aux = orgaoRepository.findById(id).orElse(null);
        if(aux != null)
        {
            aux.setNome(orgao.getNome());
            return this.orgaoRepository.save(aux);
        }
        return null;
    }
}
