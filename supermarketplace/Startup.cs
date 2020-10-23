using Owin;
using Microsoft.Owin;
using Microsoft.AspNet.SignalR;
using supermarketplace.CustomProviders;

[assembly: OwinStartup(typeof(supermarketplace.Startup))]
namespace supermarketplace
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //GlobalHost.DependencyResolver.Register(typeof(IUserIdProvider), () => new CustomUserIdProvider());
            app.MapSignalR();
        }
    }
}