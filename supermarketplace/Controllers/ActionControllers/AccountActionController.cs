using System.Threading.Tasks;
using System.Web;
using System.Web.Security;
using System.Web.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using supermarketplace.Repositories.common;
using supermarketplace.Services;
using supermarketplace.ViewModels;
using databaseacesslevel.Models;
using supermarketplace.CustomFilters;

namespace supermarketplace.Controllers.ActionControllers
{
    public class AccountActionController : BaseActionController
    {
        public AccountActionController(IUnitOfWork unitOfWork, IProcutsClientService productService, IUserService userService, ISecuretyService securetyService, ICapthaService capthaService, IAdvertisingService advertising) : base(unitOfWork, productService, userService, securetyService, capthaService, advertising)
        {
        }      

        [HttpPost]
        [AllowAnonymous]
        public async Task<JsonResult> Login(UserLoginViewModel user)
        {            
            if(await _securetyService.LoginUser(user.UserName, user.Password))
            {
                return Json(true, JsonRequestBehavior.AllowGet);
            }

            return Json(false, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<JsonResult> RegisterNewUser(UserRegisterViewModel newUser)
        {  
            if (!ModelState.IsValid 
                || String.Compare(newUser.Password, 0, newUser.PasswordConfirm, 0, newUser.Password.Length, StringComparison.OrdinalIgnoreCase) != 0
                || !(await _capthaService.CheckIfCapthaValidationPassed(newUser.CustomValidator, newUser.CaptchaId)))
            {
                return Json(false, JsonRequestBehavior.AllowGet);
            }
            
            if(await _securetyService.RegisterNewUser(newUser))
            {
                _unitOfWork.Commit();                
                return Json(true, JsonRequestBehavior.AllowGet);
            }

            return Json(false, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [Authentication("Customer", "Administrator", true)]        
        public JsonResult LogOut()
        {
            _securetyService.Logout();
            return Json(true, JsonRequestBehavior.AllowGet);
        }

        //products start
        #region

        [HttpPost]
        [Authentication("Customer", "Administrator", true)]
        public async Task<JsonResult> CreateNewProduct(Product product, HttpPostedFileBase image)
        {
            if (!ModelState.IsValid)
            {
                return null;
            }
            if (image != null && image.ContentLength < 500000000 && (image.ContentType == "image/jpeg" || image.ContentType == "image/png"))
            {
                HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
                FormsAuthenticationTicket authTicket;
                authTicket = FormsAuthentication.Decrypt(authCookie.Value);
                var result = await _products.UpdateProductPicture(image, product, Server, "create", (await _userService.GetUserProfileByEmail(authTicket.Name)).UserId);
                await _unitOfWork.CommitAsync();
                return result != null ? Json(true, JsonRequestBehavior.AllowGet) : null;
            }
            return null;
        }

        [HttpPost]
        [Authentication("Customer", "Administrator", true)]
        public async Task<JsonResult> RemoveProductItem(Product product)
        {
            if (!ModelState.IsValid)
            {
                return null;
            }
            HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket;
            authTicket = FormsAuthentication.Decrypt(authCookie.Value);
            if (_products.RemoveProduct(product, (await _userService.GetUserProfileByEmail(authTicket.Name)).UserId, authTicket.UserData == "Administrator"))
            {
                _unitOfWork.Commit();
                return Json(true, JsonRequestBehavior.AllowGet);
            }
            return Json(false, JsonRequestBehavior.AllowGet);
        }

        #endregion
        //products end
        //user data
        #region 

        [HttpGet]
        [Authentication("Customer", "Administrator", true)]
        public ActionResult UserAccountData()
        {
            HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket;            
            authTicket = FormsAuthentication.Decrypt(authCookie.Value);           
           
            if (authTicket.UserData == "Customer")
            {              
                return RedirectToAction("AccountData");                
            }
            else if(authTicket.UserData == "Administrator")
            {                
                return RedirectToAction("AdminAccountData", "AdminAction");
            }

            return null;
        }
       
        [HttpGet]
        [Authentication("Customer")]
        public async Task<JsonResult> AccountData()
        {
            return Json(await _userService.GetUserControls(), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Authentication("Customer", "Administrator", true)]
        public async Task<JsonResult> GetUserProducts(PagerProductByCategory pageNumber)
        {
            HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket;
            authTicket = FormsAuthentication.Decrypt(authCookie.Value);

            var userProfile = await _userService.GetUserProfileByEmail(authTicket.Name);
            if(userProfile != null)
            {
                return Json(await _products.GetUserProducts(userProfile, pageNumber.page), JsonRequestBehavior.AllowGet);
            }

            return null;
        }

        [HttpPost]
        [Authentication("Customer", "Administrator", true)]
        public async Task<JsonResult> GetUserFriendProducts(PagerProductByCategory fiendPageNumber)
        {
            HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket;
            authTicket = FormsAuthentication.Decrypt(authCookie.Value);

            var userProfile = await _userService.GetUserProfileByEmail(authTicket.Name);
            if (userProfile != null)
            {
                return Json(await _products.GetUserFriendProducts(userProfile, fiendPageNumber), JsonRequestBehavior.AllowGet);
            }

            return null;
        }

        [HttpPost]
        [Authentication("Customer", "Administrator", true)]
        public async Task<JsonResult> GetUserProfileData(int pageNum = 1)
        {
            if (!ModelState.IsValid)
            {
                return null;
            }
            HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket;
            authTicket = FormsAuthentication.Decrypt(authCookie.Value);
            var result = await _userService.GetUserProfileData(authTicket.Name, pageNum);
            if (result != null)
            {
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            return null;
        }

        [HttpPost]
        [Authentication("Customer", "Administrator", true)]
        public async Task<JsonResult> GetUserFriendProfileData(UserViewModel userFriend, int pageNum = 1)
        {
            if (!ModelState.IsValid)
            {
                return null;
            }
            HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket;
            authTicket = FormsAuthentication.Decrypt(authCookie.Value);
            var result = await _userService.GetUserProfileData(userFriend, authTicket.Name, pageNum);
            if (result != null)
            {
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            return null;
        }

        [HttpGet]
        [Authentication("Customer", "Administrator", true)]
        public async Task<JsonResult> GetUserFriendsData()
        {
            HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket;
            authTicket = FormsAuthentication.Decrypt(authCookie.Value);
            var result = await _userService.GetUserFriendsData(authTicket.Name);
            if (result != null)
            {
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            return null;
        }
        
        [HttpPost]
        [Authentication("Customer", "Administrator", true)]
        public async Task<JsonResult> SearchForFriends(string input)
        {
            if (string.IsNullOrEmpty(input))
            {
                return null;
            }

            return Json(await _userService.FindNewFriends(input), JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Authentication("Customer", "Administrator", true)]
        public async Task<JsonResult> FriendRequest(UserViewModel newFriend)
        {
            if (!ModelState.IsValid)
            {
                return null;
            }
            HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket;
            authTicket = FormsAuthentication.Decrypt(authCookie.Value);
            if(await _userService.FriendRequest(authTicket.Name, newFriend.UserEmail)){
                await _unitOfWork.CommitAsync();
                return Json(newFriend, JsonRequestBehavior.AllowGet);
            }            

            return null;
        }

        [HttpPost]
        [Authentication("Customer", "Administrator", true)]
        public JsonResult RemoveFriendRequest(UserViewModel removeRequest)
        {
            if (!ModelState.IsValid)
            {
                return null;
            }
            HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket;
            authTicket = FormsAuthentication.Decrypt(authCookie.Value);
            if (_userService.RemoveFriendRequest(authTicket.Name, removeRequest.UserEmail))
            {
                _unitOfWork.Commit();
                return Json(removeRequest, JsonRequestBehavior.AllowGet);
            }
            return Json(null, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [Authentication("Customer", "Administrator", true)]
        public async Task<JsonResult> AddNewFriend(UserViewModel newFriend)
        {
            if (!ModelState.IsValid)
            {
                return null;
            }
            HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket;
            authTicket = FormsAuthentication.Decrypt(authCookie.Value);

            if(await _userService.AddNewFriend(authTicket.Name, newFriend.UserEmail))
            {
                await _unitOfWork.CommitAsync();
                return Json(newFriend, JsonRequestBehavior.AllowGet);
            }

            return null;
        }

        [HttpPost]
        [Authentication("Customer", "Administrator", true)]
        public async Task<JsonResult> RemoveFriend(UserViewModel friendToRemove)
        {
            if (!ModelState.IsValid)
            {
                return null;
            }
            HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket;
            authTicket = FormsAuthentication.Decrypt(authCookie.Value);

            if (await _userService.RemoveFriend(authTicket.Name, friendToRemove.UserEmail))
            {
                await _unitOfWork.CommitAsync();
                return Json(friendToRemove, JsonRequestBehavior.AllowGet);
            }

            return null;
        }
        #endregion
        //end userdata
        //messages start
        #region
        [HttpPost]
        [Authentication("Customer", "Administrator", true)]
        public async Task<JsonResult> SendUserMessage(MessageViewModel message)
        {
            if (!ModelState.IsValid)
            {
                return null;
            }
            HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket;
            authTicket = FormsAuthentication.Decrypt(authCookie.Value);

            if(await _userService.SendUserMessage(authTicket.Name, message))
            {
                await _unitOfWork.CommitAsync();
                return Json(message, JsonRequestBehavior.AllowGet);
            }

            return null;
        }
        #endregion
        //messages end
        [HttpPost]
        [Authentication("Customer", "Administrator", true)]
        public async Task<JsonResult> UpdateUserProfile(UserProfileUpdateViewModel user)
        {
            if (!ModelState.IsValid)
            {
                return null;
            }

            HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket;
            authTicket = FormsAuthentication.Decrypt(authCookie.Value);
            UserViewModel result = null;

            if (user != null && user.UserBackgroundImage == null && user.ImgUrl == null)
            {
                if (string.IsNullOrEmpty(user.NewPassword) && string.IsNullOrEmpty(user.NewPasswordConfirm) && string.IsNullOrEmpty(user.Password))
                {
                    result = await _userService.UpdateProfile(authTicket.Name, user);
                }
                else if (!string.IsNullOrEmpty(user.Password) && String.Compare(user.NewPassword, 0, user.NewPasswordConfirm, 0, user.Password.Length, StringComparison.OrdinalIgnoreCase) == 0)
                {
                    result = await _userService.UpdateProfile(authTicket.Name, user, true);
                }
                else
                {
                    return null;               
                }
                await _unitOfWork.CommitAsync();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            if ((user.ImgUrl != null && user.ImgUrl.ContentLength < 500000 && (user.ImgUrl.ContentType == "image/jpeg" || user.ImgUrl.ContentType == "image/png")) 
                && (user.UserBackgroundImage != null && user.UserBackgroundImage.ContentLength < 500000 && (user.UserBackgroundImage.ContentType == "image/jpeg" || user.UserBackgroundImage.ContentType == "image/png")))
            {
                result = await _userService.Update(authTicket.Name, Server, user.ImgUrl, user.UserBackgroundImage);
                await _unitOfWork.CommitAsync();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            if (user.ImgUrl != null && user.ImgUrl.ContentLength < 500000 && (user.ImgUrl.ContentType == "image/jpeg" || user.ImgUrl.ContentType == "image/png"))
            {               
                result = await _userService.Update(authTicket.Name, Server, user.ImgUrl);
                await _unitOfWork.CommitAsync();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            if (user.UserBackgroundImage != null && user.UserBackgroundImage.ContentLength < 500000 && (user.UserBackgroundImage.ContentType == "image/jpeg" || user.UserBackgroundImage.ContentType == "image/png"))
            {
                result = await _userService.Update(authTicket.Name, Server, null, user.UserBackgroundImage);
                await _unitOfWork.CommitAsync();
                return Json(result, JsonRequestBehavior.AllowGet);
            }           

            return null;
        }

    }
}