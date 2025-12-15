using FI.AtividadeEntrevista.DML;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace FI.AtividadeEntrevista.DAL
{
    internal class DaoBeneficiario : AcessoDados
    {
        internal void Incluir(Beneficiario b)
        {
            var parametros = new List<SqlParameter>
            {
                new SqlParameter("Nome", b.Nome),
                new SqlParameter("CPF", b.CPF.Replace(".", "").Replace("-", "")),
                new SqlParameter("IdCliente", b.IdCliente)
            };

            base.Executar("FI_SP_IncBeneficiario", parametros);
        }


        internal void Alterar(Beneficiario b)
        {
            var parametros = new List<SqlParameter>
            {
                new SqlParameter("Id", b.Id),
                new SqlParameter("Nome", b.Nome),
                new SqlParameter("CPF", b.CPF.Replace(".", "").Replace("-", ""))
            };

            base.Executar("FI_SP_AltBeneficiario", parametros);
        }

        internal void Excluir(long idBeneficiario)
        {
            var parametros = new List<SqlParameter>
            {
                new SqlParameter("Id", idBeneficiario)
            };

            base.Executar("FI_SP_DelBeneficiario", parametros);
        }

        internal void ExcluirPorCliente(long idCliente)
        {
            var parametros = new List<SqlParameter>
            {
                new SqlParameter("IdCliente", idCliente)
            };

            base.Executar("FI_SP_DelBeneficiariosPorCliente", parametros);
        }

        internal List<Beneficiario> ListarPorCliente(long idCliente)
        {
            var parametros = new List<SqlParameter>
            {
                new SqlParameter("@IDCLIENTE", idCliente)
            };

            var ds = base.Consultar("FI_SP_ListBeneficiariosPorCliente", parametros);

            var lista = new List<Beneficiario>();

            if (ds == null || ds.Tables.Count == 0)
                return lista;

            foreach (System.Data.DataRow row in ds.Tables[0].Rows)
            {
                lista.Add(new Beneficiario
                {
                    Id = Convert.ToInt64(row["ID"]),
                    CPF = row["CPF"].ToString(),
                    Nome = row["NOME"].ToString(),
                    IdCliente = Convert.ToInt64(row["IDCLIENTE"])
                });
            }

            return lista;
        }

        internal Beneficiario Consultar(long idBeneficiario)
        {
            var parametros = new List<SqlParameter>
            {
                new SqlParameter("ID", idBeneficiario)
            };

            var ds = base.Consultar("FI_SP_ConsBeneficiario", parametros);

            if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                return null;

            var row = ds.Tables[0].Rows[0];

            return new Beneficiario
            {
                Id = Convert.ToInt64(row["ID"]),
                Nome = row["NOME"].ToString(),
                CPF = row["CPF"].ToString(),
                IdCliente = Convert.ToInt64(row["IDCLIENTE"])
            };
        }

        internal bool ExistePorCpf(long idCliente, string cpf)
        {
            var parametros = new List<SqlParameter>
            {
                new SqlParameter("IDCLIENTE", idCliente),
                new SqlParameter("CPF", cpf.Replace(".", "").Replace("-", ""))
            };

            var ds = base.Consultar("FI_SP_BeneficiarioExistePorCpf", parametros);

            return ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0;
        }

        internal Beneficiario ConsultarPorCpf(string cpf)
        {
            var parametros = new List<SqlParameter>
            {
                new SqlParameter("CPF", cpf.Replace(".", "").Replace("-", ""))
            };

            var ds = base.Consultar("FI_SP_ConsBeneficiarioPorCpf", parametros);

            if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                return null;

            var row = ds.Tables[0].Rows[0];

            return new Beneficiario
            {
                Id = Convert.ToInt64(row["ID"]),
                CPF = row["CPF"].ToString(),
                Nome = row["NOME"].ToString(),
                IdCliente = Convert.ToInt64(row["IDCLIENTE"])
            };
        }
    }
}
