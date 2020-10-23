using databaseacesslevel.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace supermarketplace.ViewModels
{
    public class ProductsPerOnePage
    {
        public List<Product> ProductsPerPage { get; set; }
        public int CountOfPages { get; set; }
    }
}