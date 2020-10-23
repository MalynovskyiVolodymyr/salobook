using supermarketplace.App_Start;
using supermarketplace.Repositories.common;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Security;

namespace supermarketplace
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {            
            Database.SetInitializer(new CreateDatabaseIfNotExists<ApplicationDbContext>());
            AreaRegistration.RegisterAllAreas();
            UnityWebActivator.Start();            
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        //protected void Application_AuthenticateRequest(Object sender, EventArgs e)
        //{
        //    HttpCookie authCookie = Context.Request.Cookies[FormsAuthentication.FormsCookieName];
        //    if (authCookie == null || authCookie.Value == "")
        //        return;

        //    FormsAuthenticationTicket authTicket;
        //    try
        //    {
        //        authTicket = FormsAuthentication.Decrypt(authCookie.Value);
        //    }
        //    catch
        //    {
        //        return;
        //    }

        //    // retrieve roles from UserData
        //    if (authTicket.UserData == "Customer")
        //    {

        //    }
        //    else if (authTicket.UserData == "Administrator")
        //    {

        //    }
            //    string[] roles = new string[] { "Customer", "Administrator" };

            //    if (Context.User == null)
            //    {
            //        Context.User = new GenericPrincipal(Context.User.Identity, roles);
            //    }

            //}
        }
}
