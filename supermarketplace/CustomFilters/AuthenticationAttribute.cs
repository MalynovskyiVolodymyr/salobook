using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace supermarketplace.CustomFilters
{
    public class AuthenticationAttribute : ActionFilterAttribute
    {
        public string BasicRealm { get; set; }
        private string RoleType { get; set; }
        private string NextRoleType { get; set; }
        private bool CommonAccess { get; set; }

        public AuthenticationAttribute(string roletype, string nextroletype = "", bool commonAccess = false)
        {
            RoleType = roletype;
            NextRoleType = nextroletype;
            CommonAccess = commonAccess;         
        }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {     
        
            HttpCookie authCookie = HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            if (authCookie == null || authCookie.Value == "")
            {
                //filterContext.HttpContext.Response.AddHeader("WWW-Authenticate", String.Format("Basic realm=\"{0}\"", BasicRealm ?? "Ryadel"));
                /// thanks to eismanpat for this line: http://www.ryadel.com/en/http-basic-authentication-asp-net-mvc-using-custom-actionfilter/#comment-2507605761
                filterContext.Result = new HttpUnauthorizedResult();
                return;
            }
                

            FormsAuthenticationTicket authTicket;
            try
            {
                authTicket = FormsAuthentication.Decrypt(authCookie.Value);
            }
            catch
            {
                //filterContext.HttpContext.Response.AddHeader("WWW-Authenticate", String.Format("Basic realm=\"{0}\"", BasicRealm ?? "Ryadel"));
                // thanks to eismanpat for this line: http://www.ryadel.com/en/http-basic-authentication-asp-net-mvc-using-custom-actionfilter/#comment-2507605761
                filterContext.Result = new HttpUnauthorizedResult();
                return;
            }
            
            if (RoleType == "Customer" && authTicket.UserData == RoleType && !CommonAccess)
            {                
                return;
            }else if(RoleType == "Administrator" && authTicket.UserData == RoleType && !CommonAccess)
            {
                return;
            }else if (RoleType == "Customer" && NextRoleType == "Administrator" && CommonAccess)
            {
                return;
            }
            //filterContext.HttpContext.Response.AddHeader("WWW-Authenticate", String.Format("Basic realm=\"{0}\"", BasicRealm ?? "Ryadel"));
            /// thanks to eismanpat for this line: http://www.ryadel.com/en/http-basic-authentication-asp-net-mvc-using-custom-actionfilter/#comment-2507605761
            filterContext.Result = new HttpUnauthorizedResult();
        }
    }
}