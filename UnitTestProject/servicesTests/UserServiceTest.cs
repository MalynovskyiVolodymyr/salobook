//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using Microsoft.VisualStudio.TestTools.UnitTesting;
//using supermarketplace.Repositories.common;
//using databaseacesslevel.Models;
//using Microsoft.Practices.Unity;
//using supermarketplace.Services;
//using supermarketplace.ViewModels;

//namespace UnitTestProject.servicesTests
//{
//    [TestClass]
//    public class UserServiceTest
//    {
//        [TestMethod]
//        public void TestCreateUser()
//        {
//            var container = Bootstraper.Initialize();

//            using (var unitOfWork = container.Resolve<IUnitOfWork>() as UnitOfWorkRepository)
//            {
//                var userService = container.Resolve<IUserService>();

//                //userService.CreateNewUser(new UserProfileViewModel { UserEmail = "test2@test.com", Password = "123" });
//                unitOfWork.Commit();
//            }
//        }

//        [TestMethod]
//        public void AddNewFriendTest()
//        {
//            var container = Bootstraper.Initialize();

//            using (var unitOfWork = container.Resolve<IUnitOfWork>() as UnitOfWorkRepository)
//            {
//                var userService = container.Resolve<IUserService>();

//                //userService.AddNewFriend(1, new User { Id = 3 });
//                unitOfWork.Commit();
//            }
//        }

//        [TestMethod]
//        public void GetAllFriends()
//        {
//            var container = Bootstraper.Initialize();

//            using (var unitOfWork = container.Resolve<IUnitOfWork>() as UnitOfWorkRepository)
//            {
//                var userService = container.Resolve<IUserService>();

//                //var friends = userService.GetAllFriends(1);

//                Assert.IsTrue(friends.ToArray().Length > 2);
//                Assert.IsTrue(friends[0].Id == 1);
//                Assert.IsTrue(friends[1].Id == 2);
//                Assert.IsTrue(friends[2].Id == 3);

//            }
//        }

//    }
//}
