using databaseacesslevel.Models;
using supermarketplace.Repositories.categories;
using supermarketplace.Repositories.common;
using supermarketplace.Repositories.products;
using supermarketplace.Services;
using supermarketplace.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace supermarketplace.Controllers
{
    public class HomeController : Controller
    {
       
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Error(string aspxerrorpath)
        {
            return RedirectToAction("Index");
        }       

    }
}