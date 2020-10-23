using databaseacesslevel.Models;
using supermarketplace.Repositories.common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace supermarketplace.Repositories.users
{
    public class RolesRepository : EFDbRepository<Role>, IRolesRepository
    {
        public RolesRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
    }
}