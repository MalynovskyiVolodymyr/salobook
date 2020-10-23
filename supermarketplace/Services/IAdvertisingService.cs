using databaseacesslevel.Models;
using System.Threading.Tasks;
using System.Web;

namespace supermarketplace.Services
{
    public interface IAdvertisingService
    {
        Task<bool> AddNew(Advertising newItem, HttpPostedFileBase inner, HttpPostedFileBase backround, HttpServerUtilityBase pathToFolder);
        bool RemoveAdds(Advertising itemToRemove);
        Task<Advertising> Update(int Id, HttpPostedFileBase inner, HttpPostedFileBase backround, HttpServerUtilityBase pathToFolder);
        Advertising Update(Advertising itemToUpdate);
        double GetUnicNumber(int num);
        Task<string[]> WriteAnImage(HttpPostedFileBase[] images, HttpServerUtilityBase pathToFolder);
    }
}