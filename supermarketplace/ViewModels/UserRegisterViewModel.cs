using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace supermarketplace.ViewModels
{
    public class UserRegisterViewModel
    {
        public int CaptchaId { get; set; }

        public string UserName { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string PasswordConfirm { get; set; }

        public string CustomValidator { get; set; }

    }

}