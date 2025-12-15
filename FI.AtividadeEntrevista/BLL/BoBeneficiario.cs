using FI.AtividadeEntrevista.DAL;
using FI.AtividadeEntrevista.DML;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoBeneficiario
    {
        private readonly DaoBeneficiario _dao;

        public BoBeneficiario()
        {
            _dao = new DaoBeneficiario();
        }

        public void Incluir(Beneficiario beneficiario)
        {
            _dao.Incluir(beneficiario);
        }

        public void Alterar(Beneficiario beneficiario)
        {
            _dao.Alterar(beneficiario);
        }

        public void Excluir(long idBeneficiario)
        {
            _dao.Excluir(idBeneficiario);
        }

        public bool ExistePorCpf(long idCliente, string cpf)
        {
            return _dao.ExistePorCpf(idCliente, cpf);
        }

        public Beneficiario Consultar(long idBeneficiario)
        {
            return _dao.Consultar(idBeneficiario);
        }
        public Beneficiario ConsultarPorCpf(string cpf)
        {
            return new DaoBeneficiario().ConsultarPorCpf(cpf);
        }
    }
}
