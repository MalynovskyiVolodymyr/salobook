using databaseacesslevel.Models;
using supermarketplace.Repositories.common;
using supermarketplace.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;
using System.Web.Security;

namespace supermarketplace.Services
{
    public class SecuretyService : ISecuretyService
    {

        private readonly IUserService _userService;

        public SecuretyService(IUserService userservice)
        {
            _userService = userservice;
        }

        public async Task<Profile> Authenticate(string userEmail, string password)
        {
            var user = await _userService.GetUserProfileByEmail(userEmail);

            if(user == null)
            {
                return null;
            }

            if(Crypto.VerifyHashedPassword(user.UserPassword, password))
            {
                return user;
            }

            return null;
        }

        public async Task<bool> RegisterNewUser(UserRegisterViewModel newUser)
        {
            
            var newProfile = await _userService.CreateNewUser(newUser);
            
            if(newProfile == null)
            {
                return false;
            }           
            
            FormsAuthentication.SetAuthCookie(newProfile.UserEmail, true);            

            FormsAuthenticationTicket ticket =
               new FormsAuthenticationTicket(
                    1,                                   
                    newProfile.UserEmail,  
                    DateTime.Now,                        
                    DateTime.Now.AddMinutes(10000),        
                    true,      
                    (await _userService.GetRoleForUser(newProfile.RoleId)).RoleType   
                    );

            HttpCookie cookie = new HttpCookie(FormsAuthentication.FormsCookieName, FormsAuthentication.Encrypt(ticket));
           
            HttpContext.Current.Response.Cookies.Add(cookie);

            return true;      
        }
        
        public async Task<bool> LoginUser(string userEmail, string password)
        {            
            var user = await Authenticate(userEmail, password);

            if(user == null)
            {
                return false;
            }

            FormsAuthentication.SetAuthCookie(user.UserEmail, true);

            FormsAuthenticationTicket ticket =
                new FormsAuthenticationTicket(
                    1,
                    user.UserEmail,
                    DateTime.Now,
                    DateTime.Now.AddMinutes(10000),
                    true,
                    (await _userService.GetRoleForUser(user.RoleId)).RoleType
                    );

            HttpCookie cookie = new HttpCookie(FormsAuthentication.FormsCookieName, FormsAuthentication.Encrypt(ticket));

            HttpContext.Current.Response.Cookies.Add(cookie);

            return true;
        }

        public void Logout()
        {
            FormsAuthentication.SignOut();
        }
    }
}