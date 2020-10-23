using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace supermarketplace.ViewModels
{
    public class UsersViewModel
    {
        public IEnumerable<UserViewModel> UsersPerPage { get; set; }
        public int CountOfPages { get; set; }
    }
}