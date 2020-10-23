using databaseacesslevel.Models;
using supermarketplace.Repositories.common;
using supermarketplace.Repositories.messages;
using supermarketplace.Repositories.users;
using supermarketplace.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;

namespace supermarketplace.Services
{
    public class UserService : IUserService
    {
        private readonly IUsersRepository _users;
        private readonly IUserProfileRepository _userProfiles;
        private readonly IUserControlRepository _userControls;
        private readonly IRolesRepository _userRoles;
        private readonly IMessageRepository _messages;   
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProcutsClientService _products;
        private FileStream _FileStream = null;
        private const int PageSize = 10;

        public UserService(IUsersRepository users, IUserProfileRepository profiles, IUserControlRepository controls, IRolesRepository roles, IMessageRepository messages, IUnitOfWork unitOfWork, IProcutsClientService products)
        {
            _users = users;
            _userProfiles = profiles;
            _userControls = controls;
            _userRoles = roles;
            _messages = messages;
            _unitOfWork = unitOfWork;
            _products = products;
        }

        public async Task<int> InitAdminPager()
        {
            var result = 0;
            var count = await _userProfiles.CountAsync();
            if (count % PageSize >= 1)
            {
                return result = count / PageSize + 1;
            }
            return result = count / PageSize;
        }

        public async Task<UsersViewModel> ListUsersPerPage(int page)
        {
            int countOfPages = await InitAdminPager();
            List<Profile> users = null;
            if (page > 1)
            {
                users = await _userProfiles.FindAllAsync(null, (page - 1) * PageSize, PageSize, u => u.Id);
                return new UsersViewModel() { UsersPerPage = MapProfileToUser(users), CountOfPages = countOfPages };
            }
            users = await _userProfiles.FindAllAsync(null, 0, PageSize, u => u.Id);
            return new UsersViewModel() { UsersPerPage = MapProfileToUser(users), CountOfPages = countOfPages };
        }

        public async Task<bool> RemoveUser(UserViewModel userToRemove, string currentUser)
        {
            var remProfile = await GetUserProfileByEmail(userToRemove.UserEmail);

            if(remProfile != null && remProfile.UserEmail != currentUser)
            {
                var remUser = await _users.GetAsync(remProfile.UserId);
                var remRole = await _userRoles.GetAsync(remProfile.RoleId);

                try
                {
                    remProfile.MyFriendRequests.Clear();
                    remProfile.MyFriends.Clear();
                    remProfile.FriendsOfMy.Clear();
                    remProfile.FriendRequests.Clear();
                    remUser.Messages.Clear();
                    remUser.Products.Clear();
                    await _unitOfWork.CommitAsync();
                    _users.Delete(remUser);
                    _userRoles.Delete(remRole);
                    _userProfiles.Delete(remProfile);
                    return true;
                }catch
                {
                    return false;
                }
            }

            return false;            
        }

        public async Task<Role> GetRolesTypes()
        {
            return await _userRoles.FindAsync(r => r.RoleType == "Customer");
        }

        public async Task<Profile> CreateNewUser(UserRegisterViewModel user)
        {
            var userProfile = await _userProfiles.FindAsync(p => p.UserEmail == user.Email);

            if (userProfile != null)
            {
                return null;
            }           
            
            User newUser = _users.Insert(new User());                    

            Role newRole = _userRoles.Insert(new Role { RoleType = "Customer" });

            try { 
                _unitOfWork.Commit();
            }   catch(Exception ex)
            {
                return null;
            }        

            var newProfile = new Profile
            {
                DateCreated = DateTime.Now,
                UserEmail = user.Email,                
                UserId = newUser.Id,
                UserPassword = Crypto.HashPassword(user.Password),
                RoleId = newRole.Id,
                UserName = user.UserName,
                ImgUrl = "/Content/userProfileImages/14840859816.png",
                UserBackgroundImage = "/Content/userProfileImages/18847917.jpg"            
            };           

            return _userProfiles.Insert(newProfile); 
        }

        public async Task<bool> FriendRequest(string currentuser, string newfriend)
        {
            return await _userProfiles.FriendRequest(currentuser, newfriend);
        }

        public bool RemoveFriendRequest(string currentuser, string removerequest)
        {
            return _userProfiles.RemoveFriendRequest(currentuser, removerequest);
        }

        public async Task<Profile> GetUserProfileByEmail(string userEmail)
        {
            return await _userProfiles.FindAsync(up => up.UserEmail == userEmail);
        }

        public async Task<bool> AddNewFriend(string currentUser, string requestor)
        {
            return await _userProfiles.AddToFriends(currentUser, requestor);
        }

        public async Task<bool> RemoveFriend(string currentUser, string requestor)
        {
            return await _userProfiles.RemoveFromFriends(currentUser, requestor);
        }   

        public async Task<IEnumerable<UserControls>> GetAdminControls()
        {
            return await _userControls.GetAdminControlls();
        }

        public async Task<IEnumerable<UserControls>> GetUserControls()
        {
            return await _userControls.GetUserControlls();
        }  
        
        public async Task<Role> GetRoleForUser(int roleId)
        {
            return await _userRoles.GetAsync(roleId);
        } 
        
        public async Task<User> GetUserForProfile(int userId)
        {
            return await _users.GetAsync(userId);
        }  

        public async Task<UserProfileViewModel> GetUserProfileData(string userEmail, int pageNum)
        {
            var profile = await _userProfiles.BuildQuery(userEmail, true, false, false, false);

            if(profile == null)
            {
                return null;
            }

            return new UserProfileViewModel()
            {
                UserId = profile.UserId,
                UserEmail = profile.UserEmail,
                UserName = profile.UserName,
                DateCreated = profile.DateCreated,
                UserBackgroundImage = profile.UserBackgroundImage,
                ImgUrl = profile.ImgUrl,
                Messages = MapMessage(await _messages.FindAllAsync(m => m.AuthorId == profile.UserId, 0, 100)),
                Friends = MapProfileToUser(profile.MyFriends.ToList()),
                FriendRequests = null,
                MyFriendsRequests = null,
                MyProducts = await _products.GetUserProducts(profile, pageNum)
            };
        }

        public async Task<UserProfileViewModel> GetUserProfileData(UserViewModel userFriend, string userEmail, int pageNum)
        {
            var profile = await _userProfiles.BuildQuery(userEmail, true, false, false, false);
            var firnedProfile = profile.MyFriends.Where(uf => uf.UserEmail == userFriend.UserEmail).SingleOrDefault();

            if (firnedProfile == null)
            {
                return null;
            }

            return new UserProfileViewModel()
            {
                UserId = firnedProfile.UserId,
                UserEmail = firnedProfile.UserEmail,
                UserName = firnedProfile.UserName,
                DateCreated = firnedProfile.DateCreated,
                UserBackgroundImage = firnedProfile.UserBackgroundImage,
                ImgUrl = firnedProfile.ImgUrl,
                Messages = null,
                Friends = null,
                FriendRequests = null,
                MyFriendsRequests = null,
                MyProducts = await _products.GetUserProducts(firnedProfile, pageNum)
            };
        }

        public async Task<UserProfileViewModel> GetUserFriendsData(string userEmail)
        {
            var profile = await _userProfiles.BuildQuery(userEmail, false, false, true, true);

            if (profile == null)
            {
                return null;
            }

            return new UserProfileViewModel()
            {
                UserId = profile.UserId,
                UserEmail = profile.UserEmail,
                UserName = profile.UserName,
                DateCreated = profile.DateCreated,
                UserBackgroundImage = profile.UserBackgroundImage,
                ImgUrl = profile.ImgUrl,
                Messages = null,
                Friends = MapProfileToUser(profile.MyFriends.ToList()),
                FriendRequests = MapProfileToUser(profile.FriendRequests.ToList()),
                MyFriendsRequests = MapProfileToUser(profile.MyFriendRequests.ToList()),
                MyProducts = null
            };
        }

        public IEnumerable<MessageViewModel> MapMessage(List<Message> messages)
        {
            List<MessageViewModel> result = new List<MessageViewModel>();

            for(int i = 0; i < messages.Count; i++)
            {
                result.Add(new MessageViewModel()
                {
                    Id = messages[i].Id,
                    AuthorId = messages[i].AuthorId,
                    DateCreated = messages[i].DateCreated,
                    MessageText = messages[i].MessageText,
                    UserSenderId = messages[i].UserSenderId,
                    UserResiverId = messages[i].UserResiverId
                });
            }

            return result;
        }

        public IEnumerable<UserViewModel> MapProfileToUser(List<Profile> profiles)
        {
            List<UserViewModel> result = new List<UserViewModel>();

            for(int i = 0; i < profiles.Count; i++)
            {
                result.Add(new UserViewModel()
                {
                    DateCreated = profiles[i].DateCreated,
                    ImgUrl = profiles[i].ImgUrl,
                    UserBackgroundImage = profiles[i].UserBackgroundImage,
                    UserEmail = profiles[i].UserEmail,
                    UserName = profiles[i].UserName,
                    UserId = profiles[i].UserId
                });
            }

            return result;
        }

        public async Task<IEnumerable<UserViewModel>> FindNewFriends(string userToSearch)
        {
            var result = await _userProfiles.FindAllAsync(p => p.UserName.StartsWith(userToSearch), 0, 0);
            if(result != null)
            {               
                return MapProfileToUser(result.ToList());
            }
            return null;
        }

        public async Task<bool> SendUserMessage(string currentUser, MessageViewModel message)
        {
            var author = await _userProfiles.BuildQuery(currentUser, true);
            var userToWhom = author.MyFriends.Where(up => up.UserId == message.UserResiverId).SingleOrDefault();
            if(author != null && userToWhom != null)
            {
                var current = await _users.GetAsync(author.UserId);
                var toWhom = await _users.GetAsync(userToWhom.UserId);

                if(current != null && toWhom != null && _users.AddNewFriendAndRequest(current, toWhom))
                {
                    current.Messages.Add(new Message { AuthorId = current.Id, MessageText = message.MessageText, UserSenderId = 0, UserResiverId = toWhom.Id, DateCreated = DateTime.Now });
                    toWhom.Messages.Add(new Message { AuthorId = toWhom.Id, MessageText = message.MessageText, UserSenderId = current.Id, UserResiverId = 0, DateCreated = DateTime.Now });
                    return true;
                }
                return false;
            }
            return false;
        }

        public async Task<UserViewModel> UpdateProfile(string userProfile, UserProfileUpdateViewModel user, bool changePassword = false)
        {            
            var profile = await GetUserProfileByEmail(userProfile);
            if (profile != null)
            {
                if (changePassword && Crypto.VerifyHashedPassword(profile.UserPassword, user.Password))
                {
                    profile.UserPassword = Crypto.HashPassword(user.NewPassword);
                    return MapProfileToUser(new List<Profile>() { _userProfiles.Update(profile) }).FirstOrDefault();
                }else if (!string.IsNullOrEmpty(user.UserName) && !changePassword)
                {
                    profile.UserName = user.UserName;
                    return MapProfileToUser(new List<Profile>() { _userProfiles.Update(profile) }).FirstOrDefault();
                }
            }
            return null;
        }

        public async Task<UserViewModel> Update(string userProfile, HttpServerUtilityBase pathToFolder, HttpPostedFileBase inner = null , HttpPostedFileBase backround = null)
        {
            var existing = await GetUserProfileByEmail(userProfile);

            if (existing == null)
            {
                return null;
            }

            if (inner != null && backround != null)
            {
                HttpPostedFileBase[] images = { inner, backround };
                string[] filePath = await UpdateProfilePictures(images, pathToFolder);
                if (filePath != null)
                {
                    existing.ImgUrl = filePath[0];
                    existing.UserBackgroundImage = filePath[1];
                }
            }
            else if (inner != null)
            {
                HttpPostedFileBase[] images = { inner };
                string[] filePath = await UpdateProfilePictures(images, pathToFolder);
                if (filePath != null)
                {
                    existing.ImgUrl = filePath[0];
                }
            }
            else if (backround != null)
            {
                HttpPostedFileBase[] images = { backround };
                string[] filePath = await UpdateProfilePictures(images, pathToFolder);
                if (filePath != null)
                {
                    existing.UserBackgroundImage = filePath[0];
                }
            }

            return MapProfileToUser(new List<Profile>() { _userProfiles.Update(existing) }).FirstOrDefault();
        }

        public async Task<string[]> UpdateProfilePictures(HttpPostedFileBase[] images, HttpServerUtilityBase pathToFolder)
        {
            try
            {
                byte[] innerImageBytesData = null;
                byte[] backroundImageBytesData = null;
                double unic_one = 0;
                double unic_two = 0;
                string path_one = "";
                string path_two = "";
                if (images.Length == 2)
                {                  
                    innerImageBytesData = new byte[images[0].ContentLength];
                    backroundImageBytesData = new byte[images[1].ContentLength];
                    images[0].InputStream.Read(innerImageBytesData, 0, images[0].ContentLength);
                    images[1].InputStream.Read(backroundImageBytesData, 0, images[1].ContentLength);
                    unic_one = GetUnicNumber(1);
                    unic_two = GetUnicNumber(2);
                    path_one = Path.Combine(pathToFolder.MapPath("~/Content/userProfileImages/"), unic_one.ToString() + ".jpg");
                    path_two = Path.Combine(pathToFolder.MapPath("~/Content/userProfileImages/"), unic_two.ToString() + ".jpg");

                    using (_FileStream = new System.IO.FileStream(path_one, System.IO.FileMode.Create, System.IO.FileAccess.Write))
                    {
                        await _FileStream.WriteAsync(innerImageBytesData, 0, images[0].ContentLength);
                        _FileStream.Flush();
                    }
                    _FileStream = null;
                    using (_FileStream = new System.IO.FileStream(path_two, System.IO.FileMode.Create, System.IO.FileAccess.Write))
                    {
                        await _FileStream.WriteAsync(backroundImageBytesData, 0, images[1].ContentLength);
                        _FileStream.Flush();
                    }

                    return new string[] { "/Content/userProfileImages/" + unic_one + ".jpg", "/Content/userProfileImages/" + unic_two + ".jpg" };
                }
                else
                {
                    innerImageBytesData = new byte[images[0].ContentLength];
                    images[0].InputStream.Read(innerImageBytesData, 0, images[0].ContentLength);
                    unic_one = GetUnicNumber(11);
                    path_one = Path.Combine(pathToFolder.MapPath("~/Content/userProfileImages/"), unic_one.ToString() + ".jpg");

                    using (_FileStream = new System.IO.FileStream(path_one, System.IO.FileMode.Create, System.IO.FileAccess.Write))
                    {
                        await _FileStream.WriteAsync(innerImageBytesData, 0, images[0].ContentLength);
                        _FileStream.Flush();
                    }

                    return new string[] { "/Content/userProfileImages/" + unic_one + ".jpg" };
                }
            }
            catch
            {
                return null;
            }
        }

        public double GetUnicNumber(int num)
        {
            return Math.Round((new Random().NextDouble() * 100000 * new Random().NextDouble() * 199999) / 100) + num;
        }

        public async Task<IEnumerable<UserControls>> GetAllUserControlls()
        {
            return await _userControls.FindAllAsync(null, 0, 0);
        }

        public async Task<UserControls> UpdateUserControll(UserControls controllToUpdate)
        {
            var tempControll = await _userControls.GetAsync(controllToUpdate.Id);

            if(tempControll != null)
            {
                tempControll.Title = controllToUpdate.Title;

                return _userControls.Update(tempControll);
            }

            return null;
        }

        public async Task<bool> ForsedAddToFriends(string currentUser, UserViewModel newFriend)
        {
            var user = await GetUserProfileByEmail(currentUser);
            var friend = await GetUserProfileByEmail(newFriend.UserEmail);

            if(user != null && friend != null && !user.MyFriends.Contains(friend))
            {
                if(_userProfiles.AddNewFriendAndRequest(user, friend))
                {
                    try
                    {
                        user.MyFriends.Add(friend);
                        friend.MyFriends.Add(user);
                        return true;
                    }catch
                    {
                        return false;
                    }

                }else
                {
                    return false;
                }
            }

            return false;
            
        }

    }
}