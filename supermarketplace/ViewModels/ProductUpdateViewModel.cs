using databaseacesslevel.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace supermarketplace.ViewModels
{
    public class ProductUpdateViewModel
    {
        public HttpPostedFileBase PriductImage { get; set; }
        public Product ProductToUpdate { get; set; }
    }
}