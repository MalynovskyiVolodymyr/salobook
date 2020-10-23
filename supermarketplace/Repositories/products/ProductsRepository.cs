using databaseacesslevel.Models;
using supermarketplace.Repositories.common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace supermarketplace.Repositories.products
{
    public class ProductsRepository : EFDbRepository<Product>, IProductRepository
    {                
        public ProductsRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }        
    }
}