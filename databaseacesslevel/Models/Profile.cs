using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace databaseacesslevel.Models
{
    public class Profile
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string UserEmail { get; set; }

        public string UserPassword { get; set; }

        public int RoleId { get; set; }

        public DateTime DateCreated { get; set; }

        public string UserName { get; set; }

        public string UserBackgroundImage { get; set; }

        public string ImgUrl { get; set; }

        private ICollection<Profile> _myfriends;

        public virtual ICollection<Profile> MyFriends
        {
            get
            {
                return _myfriends ?? (_myfriends = new Collection<Profile>());
            }
            set
            {
                _myfriends = value;
            }
        }

        private ICollection<Profile> _friendsOfMy;

        public virtual ICollection<Profile> FriendsOfMy
        {
            get
            {
                return _friendsOfMy ?? (_friendsOfMy = new Collection<Profile>());
            }
            set
            {
                _friendsOfMy = value;
            }
        }

        private ICollection<Profile> _myFriendRequests;

        public virtual ICollection<Profile> MyFriendRequests
        {
            get
            {
                return _myFriendRequests ?? (_myFriendRequests = new Collection<Profile>());
            }
            set
            {
                _myFriendRequests = value;
            }
        }

        private ICollection<Profile> _friendRequests;

        public virtual ICollection<Profile> FriendRequests
        {
            get
            {
                return _friendRequests ?? (_friendRequests = new Collection<Profile>());
            }
            set
            {
                _friendRequests = value;
            }
        }
    }
}
