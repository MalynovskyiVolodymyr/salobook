using System.Web;
using System.Web.Security;
using System.Web.Mvc;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Linq;
using supermarketplace.Repositories.common;
using supermarketplace.Services;
using databaseacesslevel.Models;
using supermarketplace.ViewModels;
using supermarketplace.CustomFilters;

namespace supermarketplace.Controllers.ActionControllers
{
    public class AdminActionController : BaseActionController
    {
        public AdminActionController(IUnitOfWork unitOfWork, IProcutsClientService productService, IUserService userService, ISecuretyService securetyService, ICapthaService capthaService, IAdvertisingService advertising) : base(unitOfWork, productService, userService, securetyService, capthaService, advertising)
        {
        }

        // GET: Admin
        [HttpGet]
        [Authentication("Administrator")]
        public async Task<ActionResult> AdminAccountData()
        {
            return Json(await _userService.GetAdminControls(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Authentication("Administrator")]
        public async Task<JsonResult> GetProducts(PagerProductByCategory pager)
        {
            if (!ModelState.IsValid)
            {
                return Json(null, JsonRequestBehavior.AllowGet);
            }

            return Json(await _products.ListAdminProductsPerPage(pager.page, pager.category), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Authentication("Administrator")]
        public async Task<JsonResult> UpdateProductImage(Product product, HttpPostedFileBase image)
        {
            if (!ModelState.IsValid)
            {
                return null;
            }
            Product result = null;
            HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket;
            authTicket = FormsAuthentication.Decrypt(authCookie.Value);
            if (image == null)
            {
                result = _products.UpdateProduct(product, (await _userService.GetUserProfileByEmail(authTicket.Name)).UserId, authTicket.UserData == "Administrator");
                await _unitOfWork.CommitAsync();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else if (image.ContentLength < 500000 && (image.ContentType == "image/jpeg" || image.ContentType == "image/png"))
            {
                result = await _products.UpdateProductPicture(image, product, Server, "update", (await _userService.GetUserProfileByEmail(authTicket.Name)).UserId, authTicket.UserData == "Administrator");
                await _unitOfWork.CommitAsync();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(false, JsonRequestBehavior.AllowGet);
            }

        }

        //advertising start
        #region
        [HttpPost]
        [Authentication("Administrator")]
        public async Task<JsonResult> CreateNewAdvertising(AdvertisingNewItemModel advertising)
        {
            if(!ModelState.IsValid)
            {
                return null;
            }
            var result = await _advertising.AddNew(new Advertising() { Title = advertising.Title, InnerText = advertising.InnerText }, advertising.InnerImage, advertising.BackroundImage, Server);
            await _unitOfWork.CommitAsync();

            return Json(result, JsonRequestBehavior.AllowGet);
        }    

        [HttpPost]
        [Authentication("Administrator")]
        public async Task<JsonResult> UpdateAddsImage(int Id, HttpPostedFileBase bannerItemfiles, HttpPostedFileBase backroundfiles)
        {
            
            if (!ModelState.IsValid)
            {
                return null;
            }
            
            if (bannerItemfiles != null && backroundfiles != null && (bannerItemfiles.ContentType == "image/jpeg" || bannerItemfiles.ContentType == "image/png") && (backroundfiles.ContentType == "image/jpeg" || backroundfiles.ContentType == "image/png"))
            {
                var result = await _advertising.Update(Id, bannerItemfiles, backroundfiles, Server);
                await _unitOfWork.CommitAsync();
                return Json(result, JsonRequestBehavior.AllowGet);
                
            }
            else if (bannerItemfiles != null && (bannerItemfiles.ContentType == "image/jpeg" || bannerItemfiles.ContentType == "image/png"))
            {
                var result = await _advertising.Update(Id, bannerItemfiles, null, Server);
                await _unitOfWork.CommitAsync();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else if (backroundfiles != null && (backroundfiles.ContentType == "image/jpeg" || backroundfiles.ContentType == "image/png"))
            {
                var result = await _advertising.Update(Id, null, backroundfiles, Server);
                await _unitOfWork.CommitAsync();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [Authentication("Administrator")]
        public JsonResult UpdateAddsContent(Advertising advertising)
        {
            if (!ModelState.IsValid)
            {
                return null;
            }

            var result = _advertising.Update(advertising);
            if(result != null)
            {
                _unitOfWork.Commit();
            }
            
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Authentication("Administrator")]
        public JsonResult RemoveAdvertisingItem(Advertising advertising)
        {
            if (!ModelState.IsValid)
            {
                return null;
            }

            if (_advertising.RemoveAdds(advertising))
            {
                _unitOfWork.Commit();
                return Json(true, JsonRequestBehavior.AllowGet);
            }
            return Json(false, JsonRequestBehavior.AllowGet);
        }
        #endregion
        //advertising end       

        //capthas start
        #region
        [HttpGet]
        [Authentication("Administrator")]
        public async Task<JsonResult> GetAllCapthas()
        {
            return Json(await _capthaService.GetAllCapthas(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Authentication("Administrator")]
        public JsonResult CreateNewCaptha(string verificationCode, HttpPostedFileBase image)
        {
            if (!ModelState.IsValid)
            {
                return null;
            }

            if(image != null && (image.ContentType == "image/jpeg" || image.ContentType == "image/png"))
            {
                if (_capthaService.AddNewCaptha(image, verificationCode, Server))
                {
                    _unitOfWork.Commit();
                    return Json(true, JsonRequestBehavior.AllowGet);
                };
                return null;
            }
            return null;
        }

        [HttpPost]
        [Authentication("Administrator")]
        public JsonResult EditCaptha(Captha capthaToEdit)
        {
            if (!ModelState.IsValid)
            {
                return null;
            }

            var result = _capthaService.UpdateCaptha(capthaToEdit);

            if(result != null)
            {
                _unitOfWork.Commit();
            }

            return Json(result, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        [Authentication("Administrator")]
        public JsonResult RemoveCaptha(Captha capthaToRemove)
        {
            if (!ModelState.IsValid)
            {
                return null;
            }

            if (_capthaService.DeleteCaptha(capthaToRemove))
            {
                _unitOfWork.Commit();
                return Json(true, JsonRequestBehavior.AllowGet);
            }

            return null;
        }
        #endregion
        //capthas end

        //start manage users
        #region
        [HttpPost]
        [Authentication("Administrator")]
        public async Task<JsonResult> ManageUsers(int page)
        {
            if (!ModelState.IsValid)
            {
                return null;
            }

            var result = await _userService.ListUsersPerPage(page);

            if(result != null)
            {
                return Json(result, JsonRequestBehavior.AllowGet);
            }

            return null;
        }

        [HttpPost]
        [Authentication("Administrator")]
        public async Task<JsonResult> RemoveUser(UserViewModel userToRemove)
        {
            if (!ModelState.IsValid)
            {
                return Json(false, JsonRequestBehavior.AllowGet);
            }
            
            HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket = FormsAuthentication.Decrypt(authCookie.Value);
           
            if (await _userService.RemoveUser(userToRemove, authTicket.Name))
            {
                
                await _unitOfWork.CommitAsync();                
                
                return Json(true, JsonRequestBehavior.AllowGet);
            }

            return Json(false, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        [Authentication("Administrator")]
        public async Task<JsonResult> ForsedAddToFriends(UserViewModel user)
        {
            if (!ModelState.IsValid)
            {
                return Json(false, JsonRequestBehavior.AllowGet);
            }

            HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket = FormsAuthentication.Decrypt(authCookie.Value);

            if (await _userService.ForsedAddToFriends(authTicket.Name, user))
            {
                await _unitOfWork.CommitAsync();
                return Json(true, JsonRequestBehavior.AllowGet);
            }

            return Json(false, JsonRequestBehavior.AllowGet);
        }

        #endregion
        //end manage users

        //start manage controlls 
        #region
        [HttpGet]
        [Authentication("Administrator")]
        public async Task<JsonResult> GetAllControlls()
        {
            var result = await _userService.GetAllUserControlls();
            if(result != null)
            {
                return Json(result, JsonRequestBehavior.AllowGet);
            }

            return Json(null, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Authentication("Administrator")]
        public async Task<JsonResult> UpdateUserControll(UserControls controllToUpdate)
        {
            if (!ModelState.IsValid)
            {
                return Json(null, JsonRequestBehavior.AllowGet);
            }

            var result = await _userService.UpdateUserControll(controllToUpdate);
            if (result != null)
            {
                await _unitOfWork.CommitAsync();
                return Json(result, JsonRequestBehavior.AllowGet);
            }

            return Json(null, JsonRequestBehavior.AllowGet);
        }
        #endregion
        //end manage controlls

    }
}