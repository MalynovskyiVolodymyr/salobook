using databaseacesslevel.Models;
using supermarketplace.Repositories.common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace supermarketplace.Repositories.categories
{
    public interface ICategoriesRepository : IRepository<Category>
    {
    }
}