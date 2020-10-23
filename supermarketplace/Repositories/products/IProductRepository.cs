using databaseacesslevel.Models;
using supermarketplace.Repositories.common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace supermarketplace.Repositories.products
{
    public interface IProductRepository : IRepository<Product>
    {
        
    }
}