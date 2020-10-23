using Microsoft.Practices.Unity;
using Microsoft.Practices.Unity.Mvc;
using supermarketplace.Repositories.advertising;
using supermarketplace.Repositories.captharepo;
using supermarketplace.Repositories.categories;
using supermarketplace.Repositories.messages;
using supermarketplace.Repositories.products;
using supermarketplace.Repositories.users;
using supermarketplace.Services;
//using System.Web.Http if Api Controller suold add GlobalConfiguratotr.Configuration.DependencyResolver = new Unity.WebApi.Uni... 
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace supermarketplace.Repositories.common
{
    public static class Bootstraper
    {
        public static IUnityContainer Initialize()
        {
            var container = BuildUnityContainer();
            System.Web.Mvc.DependencyResolver.SetResolver(new UnityDependencyResolver(container));
            return container;         
        }

        private static IUnityContainer BuildUnityContainer()
        {
            var container = new UnityContainer();

            //container.RegisterType<ApplicationDbContext>(new PerResolveLifetimeManager());
            container.RegisterType<IUnitOfWork>(new InjectionFactory(unit => UnitOfWorkRepository.GetUnitOfWork()));
            container.RegisterType(typeof(IRepository<>), typeof(EFDbRepository<>));
            container.RegisterType<IProductRepository, ProductsRepository>();
            container.RegisterType<ICategoriesRepository, CategoriesRepository>();            
            container.RegisterType<IUserProfileRepository, UserProfileRepository>();
            container.RegisterType<IUsersRepository, UsersRepository>();
            container.RegisterType<ICapthaRepository, CapthaRepository>();
            container.RegisterType<IUserControlRepository, UserControlRepository>();
            container.RegisterType<IAdvertisingRepository, AdvertisingRepository>();
            container.RegisterType<IRolesRepository, RolesRepository>();
            container.RegisterType<IMessageRepository, MessageRepository>();

            container.RegisterType<IProcutsClientService, ProcutsClientService>();
            container.RegisterType<IUserService, UserService>();
            container.RegisterType<ICapthaService, CapthaService>();
            container.RegisterType<IAdvertisingService, AdvertisingService>();
            container.RegisterType<ISecuretyService, SecuretyService>();

            return container;
        }
    }
}