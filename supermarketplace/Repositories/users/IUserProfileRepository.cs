using System.Threading.Tasks;
using databaseacesslevel.Models;
using supermarketplace.Repositories.common;

namespace supermarketplace.Repositories.users
{
    public interface IUserProfileRepository : IRepository<Profile>
    {
        Task<bool> AddToFriends(string myEmail, string requestor);
        Task<Profile> BuildQuery(string userEmail, bool includeFriends = false, bool includeFriendsOfMy = false, bool includeFriendRequests = false, bool includeMyFriendRequests = false);
        Task<bool> FriendRequest(string myEmail, string requestor);
        bool RemoveFriendRequest(string myEmail, string friendToRemove);
        Task<bool> RemoveFromFriends(string myEmail, string requestor);
    }
}