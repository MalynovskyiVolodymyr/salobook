using databaseacesslevel.Models;
using supermarketplace.Repositories.common;
using supermarketplace.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace supermarketplace.Repositories.users
{
    public class UserControlRepository : EFDbRepository<UserControls>, IUserControlRepository
    {
        public UserControlRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public async Task<IEnumerable<UserControls>> GetAdminControlls()
        {
            return await FindAllAsync(uc => uc.AccessType == 2,0,0);            
        }

        public async Task<IEnumerable<UserControls>> GetUserControlls()
        {
            return await FindAllAsync(uc => uc.AccessType == 1, 0, 0);
        }
    }
}