using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using supermarketplace.Repositories.common;
using supermarketplace.Repositories.products;
using databaseacesslevel.Models;
using Microsoft.Practices.Unity.Mvc;
using supermarketplace.Services;
using Microsoft.Practices.Unity;

namespace UnitTestProject.repositoryTests
{
    [TestClass]
    public class ProductRepoTests
    {

        [TestMethod]
        public void InsertAsyncTest()
        {
            var container = Bootstraper.Initialize();

            using (var unitOfWork = container.Resolve<IUnitOfWork>() as UnitOfWorkRepository)
            {
                var ProductsRepo = container.Resolve<IProductRepository>();
                ProductsRepo.Insert(new Product { CategoryId = 1, DateCreated = DateTime.Now, Description = "test", Title = "test", UserId = 1 });
                unitOfWork.Commit();
                var check = ProductsRepo.FindAll(p => p.Description == "test", 0, 10).ToArray();
                Assert.IsNotNull(check);
                Assert.IsTrue(check.Length > 1);
            }
        }

        [TestMethod]
        public void UpdateTest()
        {
            var container = Bootstraper.Initialize();

            using (var unitOfWork = container.Resolve<IUnitOfWork>() as UnitOfWorkRepository)
            {

                var ProductsRepo = container.Resolve<IProductRepository>();
                var item = ProductsRepo.Find(p => p.Description == "test" && p.ImgUrl == "test");
                item.Description = "test +++";
                item.Title = "O)O)O)O)O))O";
                ProductsRepo.Update(item);
                unitOfWork.Commit();

                var check = ProductsRepo.Find(p => p.Description == "test +++" && p.ImgUrl == "test");
                Assert.IsNotNull(check);
                Assert.IsTrue(check.Title == "O)O)O)O)O))O");
            }
        }

        [TestMethod]
        public void DeleteTests()
        {
            var container = Bootstraper.Initialize();

            using (var unitOfWork = container.Resolve<IUnitOfWork>() as UnitOfWorkRepository)
            {

                var ProductsRepo = container.Resolve<IProductRepository>();
                var item = ProductsRepo.Find(p => p.Description == "test" && p.ImgUrl == "delete");

                ProductsRepo.Delete(item);

                unitOfWork.Commit();

                var check = ProductsRepo.Find(p => p.Description == "test" && p.ImgUrl == "delete");
                Assert.IsNull(check);
            }
        }

    }
}
