using databaseacesslevel.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace supermarketplace
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapRoute(
               name: "Default",
               url: "{controller}/{action}/{id}",
               defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
           );
           
           

            // var publicEmbeddedModuleRoutes = routes.MapRoute(
            //    name: "Default",
            //    url: "ap/{controller}/{action}/{id}",
            //    defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
            //    namespaces: new string[] { "MicroNet.MMP.BackOfficeWeb.Controllers" }
            //);
            //adminRoute.DataTokens["UseNamespaceFallback"] = false;


            //var defaultRoute = routes.MapRoute(
            //    name: "Default",
            //    url: "{controller}/{action}/{id}",
            //    defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
            //    namespaces: new string[] { "supermarketplace.Controllers"}
            //);
            //defaultRoute.RouteHandler = publicModuleHandler;
            // defaultRoute.DataTokens["UseNamespaceFallback"] = false;

            //var publicDefaultRoute = routes.MapRoute(
            //    name: "Error",
            //    url: "{*url}",
            //    defaults: new { controller = "Home", action = "Index", aspxerrorpath = UrlParameter.Optional },
            //    namespaces: new string[] { "supermarketplace.Controllers" }
            //);
            //publicDefaultRoute.RouteHandler = publicModuleHandler;
            // publicDefaultRoute.DataTokens["UseNamespaceFallback"] = false;

        }
    }
}
