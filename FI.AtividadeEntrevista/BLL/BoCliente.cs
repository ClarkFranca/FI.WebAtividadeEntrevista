using FI.AtividadeEntrevista.DAL;
using FI.AtividadeEntrevista.DML;
using System.Collections.Generic;
using System.Linq;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoCliente
    {
        public long Incluir(Cliente cliente)
        {
            var daoCliente = new DaoCliente();
            var boBeneficiario = new BoBeneficiario();

            long idCliente = daoCliente.Incluir(cliente);

            if (cliente.Beneficiarios != null && cliente.Beneficiarios.Any())
            {
                foreach (var benef in cliente.Beneficiarios)
                {
                    benef.IdCliente = idCliente;
                    boBeneficiario.Incluir(benef);
                }
            }

            return idCliente;
        }

        public void Alterar(Cliente cliente)
        {
            var daoCliente = new DaoCliente();
            var boBenef = new BoBeneficiario();
            var daoBenef = new DaoBeneficiario();

            daoCliente.Alterar(cliente);

            var beneficiariosBanco = daoBenef.ListarPorCliente(cliente.Id)
                                     ?? new List<Beneficiario>();

            if (cliente.Beneficiarios == null || !cliente.Beneficiarios.Any())
            {
                foreach (var benef in beneficiariosBanco)
                {
                    boBenef.Excluir(benef.Id);
                }
                return;
            }

            foreach (var benefBanco in beneficiariosBanco)
            {
                if (!cliente.Beneficiarios.Any(b => b.Id == benefBanco.Id))
                {
                    boBenef.Excluir(benefBanco.Id);
                }
            }

            foreach (var benef in cliente.Beneficiarios)
            {
                benef.IdCliente = cliente.Id;

                if (benef.Id > 0)
                {
                    boBenef.Alterar(benef);
                }
                else
                {
                    boBenef.Incluir(benef);
                }
            }
        }

        public Cliente Consultar(long id)
        {
            var daoCliente = new DaoCliente();
            var daoBenef = new DaoBeneficiario();

            var cliente = daoCliente.Consultar(id);

            if (cliente != null)
            {
                cliente.Beneficiarios = daoBenef.ListarPorCliente(id)
                                        ?? new List<Beneficiario>();
            }

            return cliente;
        }
        public void Excluir(long id)
        {
            new DaoCliente().Excluir(id);
        }

        public List<Cliente> Listar()
        {
            return new DaoCliente().Listar();
        }

        public List<Cliente> Pesquisa(int iniciarEm, int quantidade, string campoOrdenacao, bool crescente, out int qtd)
        {
            return new DaoCliente().Pesquisa(iniciarEm, quantidade, campoOrdenacao, crescente, out qtd);
        }

        public bool VerificarExistencia(string CPF)
        {
            return new DaoCliente().VerificarExistencia(CPF);
        }

        public Cliente ConsultarPorCpf(string cpf)
        {
            cpf = cpf.Replace(".", "").Replace("-", "");
            return new DaoCliente().ConsultarPorCpf(cpf);
        }

    }
}
