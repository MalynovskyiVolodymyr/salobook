using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace supermarketplace.ViewModels
{
    public class UserViewModel
    {
        public int UserId { get; set; }

        public string UserEmail { get; set; }     

        public DateTime DateCreated { get; set; }

        public string UserName { get; set; }

        public string UserBackgroundImage { get; set; }

        public string ImgUrl { get; set; }
    }
}