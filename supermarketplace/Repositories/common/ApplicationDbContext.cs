using databaseacesslevel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace supermarketplace.Repositories.common
{
    public class ApplicationDbContext: EFDbContext
    {
        public ApplicationDbContext() : base("DefaultConnectionString") { }
    }
}