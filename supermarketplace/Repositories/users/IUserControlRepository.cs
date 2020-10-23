using System.Collections.Generic;
using System.Threading.Tasks;
using databaseacesslevel.Models;
using supermarketplace.Repositories.common;

namespace supermarketplace.Repositories.users
{
    public interface IUserControlRepository : IRepository<UserControls>
    {
        Task<IEnumerable<UserControls>> GetAdminControlls();
        Task<IEnumerable<UserControls>> GetUserControlls();
    }
}