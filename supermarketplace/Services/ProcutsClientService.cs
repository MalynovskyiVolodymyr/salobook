using databaseacesslevel.Models;
using supermarketplace.Repositories.advertising;
using supermarketplace.Repositories.categories;
using supermarketplace.Repositories.common;
using supermarketplace.Repositories.products;
using supermarketplace.ViewModels;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace supermarketplace.Services
{
    public class ProcutsClientService : IProcutsClientService
    {
        private readonly IProductRepository _products;
        private readonly ICategoriesRepository _categories;
        private readonly IAdvertisingRepository _advertising;        

        private const int PageSize = 10;
        private int Pager { get; set; }       
        private FileStream _FileStream = null;
 
        public ProcutsClientService(IProductRepository products, ICategoriesRepository categories, IAdvertisingRepository advertising)
        {            
            _products = products;
            _categories = categories;
            _advertising = advertising;        
        }

        public async Task<int> InitPager(int id)
        {
            var result = 0;
            var count = await _products.CountAsync(p => p.CategoryId == id && p.IsChecked == true);
            if (count % PageSize >= 1)
            {                
                return result = count / PageSize + 1;
            }            
            return result = count / PageSize;            
        }

        public async Task<int> InitAdminPager(int id)
        {
            var result = 0;
            var count = await _products.CountAsync(p => p.CategoryId == id);
            if (count % PageSize >= 1)
            {
                return result = count / PageSize + 1;
            }
            return result = count / PageSize;
        }

        public async Task<int> InitUserPager(int userId)
        {
            var result = 0;
            var count = await _products.CountAsync(p => p.UserId == userId);
            if (count % PageSize >= 1)
            {
                return result = count / PageSize + 1;
            }
            return result = count / PageSize;
        }

        public async Task<IEnumerable<Category>> ListOfCategories()
        {
            return await _categories.Select();
        }

        public async Task<IEnumerable<Advertising>> GetAddsList()
        {
            return await _advertising.Select();
        }

        public async Task<ProductsPerOnePage> ListProductsPerPage(int page, int category)
        {            
            int countOfPages = await InitPager(category);
            List<Product> products = null;
            if (page > 1)
            {
                products = await  _products.FindAllAsync(p => p.CategoryId == category && p.IsChecked, (page-1) * PageSize, PageSize, p => p.Id);
                return new ProductsPerOnePage {  ProductsPerPage = products, CountOfPages = countOfPages };
            }
            products = await _products.FindAllAsync(p => p.CategoryId == category && p.IsChecked, 0, PageSize, p => p.Id);
            return new ProductsPerOnePage { ProductsPerPage = products, CountOfPages = countOfPages };
        }

        public async Task<ProductsPerOnePage> ListAdminProductsPerPage(int page, int category)
        {
            int countOfPages = await InitAdminPager(category);
            List<Product> products = null;
            if (page > 1)
            {
                products = await _products.FindAllAsync(p => p.CategoryId == category, (page - 1) * PageSize, PageSize, p => p.Id);
                return new ProductsPerOnePage { ProductsPerPage = products, CountOfPages = countOfPages };
            }
            products = await _products.FindAllAsync(p => p.CategoryId == category, 0, PageSize, p => p.Id);
            return new ProductsPerOnePage { ProductsPerPage = products, CountOfPages = countOfPages };
        }

        public async Task<ProductsPerOnePage> GetUserProducts(Profile currentUser, int page = 1)
        {
            int countOfPages = await InitUserPager(currentUser.UserId);
            List<Product> products = null;
            if (page > 1)
            {
                products = await _products.FindAllAsync(p => p.UserId == currentUser.UserId, (page - 1) * PageSize, PageSize, p => p.Id);
                return new ProductsPerOnePage { ProductsPerPage = products, CountOfPages = countOfPages };
            }
            products = await _products.FindAllAsync(p => p.UserId == currentUser.UserId, 0, PageSize, p => p.Id);
            return new ProductsPerOnePage { ProductsPerPage = products, CountOfPages = countOfPages };
        }

        public async Task<ProductsPerOnePage> GetUserFriendProducts(Profile currentUser, PagerProductByCategory userFriend)
        {
            var friend = currentUser.MyFriends.Where(uf => uf.UserId == userFriend.category).SingleOrDefault();

            if(friend == null)
            {
                return null;
            }

            int countOfPages = await InitUserPager(friend.UserId);
            List<Product> products = null;
            if (userFriend.page > 1)
            {
                products = await _products.FindAllAsync(p => p.UserId == friend.UserId, (userFriend.page - 1) * PageSize, PageSize, p => p.Id);
                return new ProductsPerOnePage { ProductsPerPage = products, CountOfPages = countOfPages };
            }
            products = await _products.FindAllAsync(p => p.UserId == friend.UserId, 0, PageSize, p => p.Id);
            return new ProductsPerOnePage { ProductsPerPage = products, CountOfPages = countOfPages };
        }

        public Product UpdateProduct(Product product, int userId, bool ifAdmin = false)
        {
            var existing = _products.Get(product.Id);
            
            if(existing != null && (existing.UserId == userId || ifAdmin))
            {
                existing.RequestToPublic = false;            
                existing.IsChecked = true;
                existing.Title = product.Title;
                existing.Description = product.Description;
                existing.DateCreated = DateTime.Now;
                existing.ImgUrl = product.ImgUrl;
                existing.CategoryId = product.CategoryId;
                return _products.Update(existing);
            }
            return null;
        }
        

        public async Task<Product> UpdateProductPicture(HttpPostedFileBase image, Product product, HttpServerUtilityBase pathToFolder, string actionName, int userId, bool ifAdmin = false)
        {              
            try
            {
                var imageContentType = image.ContentType;
                var imaBytesData = new byte[image.ContentLength];
                image.InputStream.Read(imaBytesData, 0, image.ContentLength);

                var unic_number = Math.Round((new Random().NextDouble() * 100000 * new Random().NextDouble() * 199999) / 100);
                var path = Path.Combine(pathToFolder.MapPath("~/Content/images/"), unic_number.ToString() + ".jpg");

                using (_FileStream = new System.IO.FileStream(path, System.IO.FileMode.Create, System.IO.FileAccess.Write))
                {
                    await _FileStream.WriteAsync(imaBytesData, 0, image.ContentLength);
                    _FileStream.Flush();
                }

                //_FileDeleteStream = new FileInfo(pathToFolder.MapPath("~" +product.ImgUrl));
                //_FileDeleteStream.Delete();

                product.ImgUrl = "/Content/images/" + unic_number + ".jpg";
                product.DateCreated = DateTime.Now;                

                if(actionName == "update")
                {
                    UpdateProduct(product, userId, ifAdmin);
                }else if(actionName == "create")
                {
                    CreateNewProduct(product, userId);
                }                

                return product;
            }
            catch
            {
                return null;
            }        
        }

        public void CreateNewProduct(Product product, int userId)
        {
            product.UserId = userId;
            product.IsChecked = false;

            _products.Insert(new Product() { CategoryId = product.CategoryId, RequestToPublic = product.RequestToPublic, DateCreated = DateTime.Now, Description = product.Description, ImgUrl = product.ImgUrl, Title = product.Title, UserId = product.UserId });
        }     

        public bool RemoveProduct(Product itemToRemove, int userId, bool isAdmin)
        {
            var productToDelete = _products.Get(itemToRemove.Id);

            if(productToDelete != null && (productToDelete.UserId == userId || isAdmin))
            {
                try
                {
                    _products.Delete(productToDelete);
                    return true;
                }
                catch
                {
                    return false;
                }
            }

            return false;
        }

    }
}