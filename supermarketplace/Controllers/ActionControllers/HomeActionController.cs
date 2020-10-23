using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using supermarketplace.Repositories.common;
using supermarketplace.Services;
using System.Threading.Tasks;
using supermarketplace.ViewModels;

namespace supermarketplace.Controllers.ActionControllers
{
    public class HomeActionController : BaseActionController
    {
        public HomeActionController(IUnitOfWork unitOfWork, IProcutsClientService productService, IUserService userService, ISecuretyService securetyService, ICapthaService capthaService, IAdvertisingService advertising) : base(unitOfWork, productService, userService, securetyService, capthaService, advertising)
        {
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<JsonResult> GetCategoriesList()
        {
            try
            {
                var result = await _products.ListOfCategories();
                if (result != null)
                {
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception err)
            {
                var ret = err;
            }           
            
            return null;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<JsonResult> GetAddsList()
        {
            return Json(await _products.GetAddsList(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<JsonResult> GetProducts(PagerProductByCategory pager)
        {
            if (!ModelState.IsValid)
            {
                return Json(null, JsonRequestBehavior.AllowGet);
            }

            return Json(await _products.ListProductsPerPage(pager.page, pager.category), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<JsonResult> GetRandomCaptha()
        {
            return Json(await _capthaService.FindRandomCaptha(), JsonRequestBehavior.AllowGet);
        }
        
    }
}