using databaseacesslevel.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace supermarketplace.ViewModels
{
    public class UserProfileViewModel
    {
        public int UserId { get; set; }

        public string UserEmail { get; set; }

        public string UserName { get; set; }

        public DateTime DateCreated { get; set; }

        public string UserBackgroundImage { get; set; }

        public string ImgUrl { get; set; }

        public IEnumerable<MessageViewModel> Messages { get; set; }

        public IEnumerable<UserViewModel> Friends { get; set; }

        public IEnumerable<UserViewModel> FriendRequests { get; set; }

        public IEnumerable<UserViewModel> MyFriendsRequests { get; set; }

        public ProductsPerOnePage MyProducts { get; set; }
    }
}