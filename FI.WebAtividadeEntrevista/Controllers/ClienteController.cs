using FI.AtividadeEntrevista.BLL;
using FI.AtividadeEntrevista.DML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using WebAtividadeEntrevista.Models;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(ClienteModel model)
        {
            if (!ModelState.IsValid)
            {
                var erros = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }

            var cliente = new Cliente
            {
                CEP = model.CEP,
                Cidade = model.Cidade,
                Email = model.Email,
                Estado = model.Estado,
                Logradouro = model.Logradouro,
                Nacionalidade = model.Nacionalidade,
                Nome = model.Nome,
                Sobrenome = model.Sobrenome,
                Telefone = model.Telefone,
                CPF = model.CPF,
                Beneficiarios = model.Beneficiarios?.Select(b => new Beneficiario
                {
                    Id = b.Id,
                    Nome = b.Nome,
                    CPF = b.CPF
                }).ToList()
            };

            if (model.Beneficiarios != null)
            {
                var boBenef = new BoBeneficiario();

                foreach (var benef in model.Beneficiarios)
                {
                    if (boBenef.ExistePorCpf(0, benef.CPF))
                    {
                        Response.StatusCode = 400;
                        return Json($"CPF {benef.CPF} já está cadastrado.");
                    }
                }
            }

            new BoCliente().Incluir(cliente);

            return Json("Cadastro efetuado com sucesso");
        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            BoCliente bo = new BoCliente();
       
            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {
                if (model.Beneficiarios != null)
                {
                    var boBenef = new BoBeneficiario();

                    foreach (var benef in model.Beneficiarios)
                    {
                        bool existe = boBenef.ExistePorCpf(model.Id, benef.CPF);

                        if (existe)
                        {
                            var benefBanco = boBenef.Consultar(benef.Id);

                            if (benefBanco == null || benefBanco.CPF != benef.CPF)
                            {
                                Response.StatusCode = 400;
                                return Json($"CPF {benef.CPF} já está cadastrado para este cliente.");
                            }
                        }
                    }
                }

                bo.Alterar(new Cliente()
                {
                    Id = model.Id,
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone,
                    CPF = model.CPF,

                    Beneficiarios = model.Beneficiarios?.Select(b => new Beneficiario
                    {
                        Id = b.Id,
                        CPF = b.CPF,
                        Nome = b.Nome
                    }).ToList()
                });

                return Json("Cadastro alterado com sucesso");
            }
        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            var bo = new BoCliente();
            var cliente = bo.Consultar(id);

            ClienteModel model = null;

            if (cliente != null)
            {
                model = new ClienteModel
                {
                    Id = cliente.Id,
                    CEP = cliente.CEP,
                    Cidade = cliente.Cidade,
                    Email = cliente.Email,
                    Estado = cliente.Estado,
                    Logradouro = cliente.Logradouro,
                    Nacionalidade = cliente.Nacionalidade,
                    Nome = cliente.Nome,
                    Sobrenome = cliente.Sobrenome,
                    Telefone = cliente.Telefone,
                    CPF = cliente.CPF,

                    Beneficiarios = cliente.Beneficiarios?.Select(b => new BeneficiarioModel
                    {
                        Id = b.Id,
                        CPF = b.CPF,
                        Nome = b.Nome
                    }).ToList()
                };
            }

            return View(model);
        }

        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                //Return result to jTable
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult ValidarCpfBeneficiario(long idCliente, string cpf, long idBeneficiario = 0)
        {
            cpf = cpf.Replace(".", "").Replace("-", "");

            var bo = new BoBeneficiario();

            // Verifica se existe CPF no banco (GLOBAL)
            bool existe = bo.ExistePorCpf(idCliente, cpf);

            // Se estiver editando
            if (idBeneficiario > 0)
            {
                var benef = bo.Consultar(idBeneficiario);

                // Ignora somente se:
                // - o beneficiário existir
                // - o CPF for o mesmo
                // - o cliente for o mesmo
                if (benef != null &&
                    benef.CPF.Replace(".", "").Replace("-", "") == cpf &&
                    benef.IdCliente == idCliente)
                {
                    existe = false;
                }
            }

            return Json(new { existe }, JsonRequestBehavior.AllowGet);
        }

    }
}