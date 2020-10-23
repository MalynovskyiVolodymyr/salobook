using System.Collections.Generic;
using System.Threading.Tasks;
using databaseacesslevel.Models;
using supermarketplace.ViewModels;
using System.Web;

namespace supermarketplace.Services
{
    public interface IProcutsClientService
    {        
        Task<IEnumerable<Category>> ListOfCategories();
        Task<ProductsPerOnePage> ListProductsPerPage(int page, int category);
        Task<ProductsPerOnePage> ListAdminProductsPerPage(int page, int category);
        Task<ProductsPerOnePage> GetUserProducts(Profile currentUser, int page = 1);
        Task<ProductsPerOnePage> GetUserFriendProducts(Profile currentUser, PagerProductByCategory userFriend);
        Task<IEnumerable<Advertising>> GetAddsList();
        Task<int> InitPager(int id);
        Task<int> InitUserPager(int userId);
        Task<int> InitAdminPager(int id);
        Product UpdateProduct(Product product, int userId, bool ifAdmin = false);
        Task<Product> UpdateProductPicture(HttpPostedFileBase image, Product product, HttpServerUtilityBase pathToFolder, string actionName, int userId, bool ifAdmin = false);
        void CreateNewProduct(Product product, int userId);
        bool RemoveProduct(Product itemToRemove, int userId, bool isAdmin);
    }
}