using System.Threading.Tasks;
using databaseacesslevel.Models;
using supermarketplace.ViewModels;
using supermarketplace.Repositories.common;

namespace supermarketplace.Services
{
    public interface ISecuretyService
    {
        Task<Profile> Authenticate(string userEmail, string password);
        Task<bool> LoginUser(string userEmail, string password);
        Task<bool> RegisterNewUser(UserRegisterViewModel newUser);
        void Logout();
    }
}