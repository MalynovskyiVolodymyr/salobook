using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace supermarketplace.ViewModels
{
    public class UserProfileUpdateViewModel
    {
        public string UserName { get; set; }

        public string Password { get; set; }

        public string NewPassword { get; set; }

        public string NewPasswordConfirm { get; set; }

        public HttpPostedFileBase UserBackgroundImage { get; set; }

        public HttpPostedFileBase ImgUrl { get; set; }
    }
}