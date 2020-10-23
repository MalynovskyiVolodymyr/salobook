using System.Threading.Tasks;
using System.Web;
using databaseacesslevel.Models;
using System.Collections.Generic;

namespace supermarketplace.Services
{
    public interface ICapthaService
    {
        Task<IEnumerable<Captha>> GetAllCapthas();
        bool AddNewCaptha(HttpPostedFileBase image, string verificationCode, HttpServerUtilityBase pathToFolder);
        Task<bool> CheckIfCapthaValidationPassed(string verification, int capthaId);
        bool DeleteCaptha(Captha captha);
        Task<Captha> FindRandomCaptha();
        Captha UpdateCaptha(Captha captha);
    }
}