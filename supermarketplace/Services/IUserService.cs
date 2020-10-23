using System.Collections.Generic;
using System.Threading.Tasks;
using databaseacesslevel.Models;
using supermarketplace.ViewModels;
using System.Web;

namespace supermarketplace.Services
{
    public interface IUserService
    {
        Task<int> InitAdminPager();
        Task<UsersViewModel> ListUsersPerPage(int page);
        Task<bool> RemoveUser(UserViewModel userToRemove, string currentUser);
        Task<IEnumerable<UserControls>> GetAllUserControlls();
        Task<UserControls> UpdateUserControll(UserControls controllToUpdate);
        Task<bool> ForsedAddToFriends(string currentUser, UserViewModel newFriend);
        Task<bool> AddNewFriend(string currentUser, string requestor);
        Task<bool> RemoveFriend(string currentUser, string requestor);
        Task<Profile> CreateNewUser(UserRegisterViewModel user);
        Task<bool> FriendRequest(string currentuser, string newfriend);
        bool RemoveFriendRequest(string currentuser, string removerequest);
        Task<IEnumerable<UserViewModel>> FindNewFriends(string userToSearch);
        Task<IEnumerable<UserControls>> GetAdminControls();           
        Task<Role> GetRoleForUser(int roleId);
        Task<Role> GetRolesTypes();
        Task<IEnumerable<UserControls>> GetUserControls();
        Task<User> GetUserForProfile(int userId);
        Task<Profile> GetUserProfileByEmail(string userEmail);
        Task<UserProfileViewModel> GetUserProfileData(string userEmail, int pageNum);
        Task<UserProfileViewModel> GetUserProfileData(UserViewModel userFriend, string userEmail, int pageNum);
        Task<UserProfileViewModel> GetUserFriendsData(string userEmail);
        IEnumerable<UserViewModel> MapProfileToUser(List<Profile> profiles);
        IEnumerable<MessageViewModel> MapMessage(List<Message> messages);
        Task<bool> SendUserMessage(string currentUser, MessageViewModel message);
        Task<UserViewModel> UpdateProfile(string userProfile, UserProfileUpdateViewModel user, bool changePassword = false);
        Task<string[]> UpdateProfilePictures(HttpPostedFileBase[] images, HttpServerUtilityBase pathToFolder);
        Task<UserViewModel> Update(string userProfile, HttpServerUtilityBase pathToFolder, HttpPostedFileBase inner = null, HttpPostedFileBase backround = null);
        double GetUnicNumber(int num);
    }
}