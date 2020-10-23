using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using supermarketplace.CustomFilters;
using supermarketplace.CustomProviders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Security;

namespace supermarketplace.Services
{
    [HubName("Messanger")]    
    public class MessagesService : Hub
    {
        private readonly static ConnectionMapping<string> _connections = new ConnectionMapping<string>();

        public MessagesService()
        {
            
        }

        [Authentication("Customer", "Administrator", true)]
        public void SendMessage(string usertoadd, string userEmail)
        {
            HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket;
            authTicket = FormsAuthentication.Decrypt(authCookie.Value);
            var userTosend = _connections.GetConnections(userEmail);

            Clients.Client(userTosend).sendMessage(usertoadd);
        }

        [Authentication("Customer", "Administrator", true)]
        public void SendFriedsRequest(string usertoadd, string userEmail)
        {
            HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket;
            authTicket = FormsAuthentication.Decrypt(authCookie.Value);
            var userTosend = _connections.GetConnections(userEmail);                                

            Clients.Client(userTosend).friendRequest(usertoadd);  
        }

        [Authentication("Customer", "Administrator", true)]
        public void RemoveFriedsRequest(string usertoadd, string userEmail)
        {
            HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket;
            authTicket = FormsAuthentication.Decrypt(authCookie.Value);
            var userTosend = _connections.GetConnections(userEmail);

            Clients.Client(userTosend).removeFriendRequest(usertoadd);
        }

        [Authentication("Customer", "Administrator", true)]
        public void AddToFriends(string usertoadd, string userEmail)
        {
            HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket;
            authTicket = FormsAuthentication.Decrypt(authCookie.Value);
            var userTosend = _connections.GetConnections(userEmail);

            Clients.Client(userTosend).addFriend(usertoadd);
        }

        [Authentication("Customer", "Administrator", true)]
        public void RemoveFromFriends(string usertoadd, string userEmail)
        {
            HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];
            FormsAuthenticationTicket authTicket;
            authTicket = FormsAuthentication.Decrypt(authCookie.Value);
            var userTosend = _connections.GetConnections(userEmail);

            Clients.Client(userTosend).removeFriend(usertoadd);
        }

        [Authentication("Customer", "Administrator", true)]
        public override Task OnConnected()
        {
            FormsAuthenticationTicket authTicket = null;
            try
            {
                HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];

                authTicket = FormsAuthentication.Decrypt(authCookie.Value);
            }
            catch
            {
                return null;
            }
            _connections.Add(authTicket.Name, Context.ConnectionId);

            return base.OnConnected();
        }

        [Authentication("Customer", "Administrator", true)]
        public override Task OnDisconnected(bool stopCalled)
        {    
            return base.OnDisconnected(stopCalled);
        }

        [Authentication("Customer", "Administrator", true)]
        public override Task OnReconnected()
        {
            FormsAuthenticationTicket authTicket = null;
            try
            {
                HttpCookie authCookie = System.Web.HttpContext.Current.Request.Cookies[FormsAuthentication.FormsCookieName];                
            
                authTicket = FormsAuthentication.Decrypt(authCookie.Value);
            }catch
            {
                return null;
            }
            _connections.Add(authTicket.Name, Context.ConnectionId);

            return base.OnReconnected();
        }
    }
}