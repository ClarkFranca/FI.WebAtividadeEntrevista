using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace WebAtividadeEntrevista.Models
{
    /// <summary>
    /// Classe de Modelo de Cliente
    /// </summary>
    public class ClienteModel
    {
        public long Id { get; set; }
        
        /// <summary>
        /// CEP
        /// </summary>
        [Required]
        public string CEP { get; set; }

        /// <summary>
        /// Cidade
        /// </summary>
        [Required]
        public string Cidade { get; set; }

        /// <summary>
        /// E-mail
        /// </summary>
        [RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$", ErrorMessage = "Digite um e-mail válido")]
        public string Email { get; set; }

        /// <summary>
        /// Estado
        /// </summary>
        [Required]
        [MaxLength(2)]
        public string Estado { get; set; }

        /// <summary>
        /// Logradouro
        /// </summary>
        [Required]
        public string Logradouro { get; set; }

        /// <summary>
        /// Nacionalidade
        /// </summary>
        [Required]
        public string Nacionalidade { get; set; }

        /// <summary>
        /// Nome
        /// </summary>
        [Required]
        public string Nome { get; set; }

        /// <summary>
        /// Sobrenome
        /// </summary>
        [Required]
        public string Sobrenome { get; set; }

        /// <summary>
        /// Telefone
        /// </summary>
        public string Telefone { get; set; }

        /// <summary>
        /// CPF
        /// </summary>
        /// 
        [Required]
        [CpfValido(ErrorMessage = "CPF inválido")]
        public string CPF { get; set; }

        /// <summary>
        /// Validador de CPF interno
        /// </summary>
        private class CpfValidoAttribute : ValidationAttribute
        {
            public override bool IsValid(object value)
            {
                if (value == null)
                    return true;

                string cpf = value.ToString().Replace(".", "").Replace("-", "").Trim();

                if (cpf.Length != 11 || !long.TryParse(cpf, out _))
                    return false;

                // CPFs inválidos conhecidos
                string[] invalidos =
                {
                    "00000000000","11111111111","22222222222","33333333333","44444444444",
                    "55555555555","66666666666","77777777777","88888888888","99999999999"
                };

                if (invalidos.Contains(cpf))
                    return false;

                // Validação do 1º dígito
                int soma = 0;
                for (int i = 0; i < 9; i++)
                    soma += (cpf[i] - '0') * (10 - i);

                int resto = soma % 11;
                int digito1 = resto < 2 ? 0 : 11 - resto;

                if (digito1 != cpf[9] - '0')
                    return false;

                // Validação do 2º dígito
                soma = 0;
                for (int i = 0; i < 10; i++)
                    soma += (cpf[i] - '0') * (11 - i);

                resto = soma % 11;
                int digito2 = resto < 2 ? 0 : 11 - resto;

                if (digito2 != cpf[10] - '0')
                    return false;

                return true;
            }
        }

    }
}