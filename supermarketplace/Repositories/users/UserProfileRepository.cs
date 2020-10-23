using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using databaseacesslevel.Models;
using supermarketplace.Repositories.common;

namespace supermarketplace.Repositories.users
{
    public class UserProfileRepository : EFDbRepository<Profile>, IUserProfileRepository
    {
        public UserProfileRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
   
        public async Task<bool> FriendRequest(string myEmail, string requestor)
        {         
            var userProfile = await BuildQuery(myEmail, false, false, true, true); 
            var newFriend = Find(p => p.UserEmail == requestor);
            if (userProfile != null && newFriend != null && userProfile.UserEmail != newFriend.UserEmail && AddNewFriendAndRequest(userProfile, newFriend))
            {
                if (userProfile.FriendRequests.Contains(newFriend) || userProfile.MyFriendRequests.Contains(newFriend) || userProfile.MyFriends.Contains(newFriend))
                {
                    return false;
                }
                userProfile.MyFriendRequests.Add(newFriend);
                newFriend.FriendRequests.Add(userProfile);            
                return true;
            }
            return false;
        }

        public bool RemoveFriendRequest(string myEmail, string friendToRemove)
        {
            var userProfile = Find(p => p.UserEmail == myEmail);
            var friendRemove = Find(u => u.UserEmail == friendToRemove);

            if (userProfile != null && friendRemove != null && userProfile.UserEmail != friendRemove.UserEmail && AddNewFriendAndRequest(userProfile, friendRemove))
            {
                userProfile.MyFriendRequests.Remove(friendRemove);
                friendRemove.FriendRequests.Remove(userProfile);
                return true;
            }
            return false;
        }

        public async Task<bool> AddToFriends(string myEmail, string requestor)
        {
            var userProfile =  await BuildQuery(myEmail, false, false, true);
            var newFriend = userProfile.FriendRequests.Where(p => p.UserEmail == requestor).SingleOrDefault();
            if (userProfile != null && newFriend != null && AddNewFriendAndRequest(userProfile, newFriend))
            {                
                userProfile.MyFriends.Add(newFriend);
                newFriend.MyFriends.Add(userProfile);
                userProfile.FriendRequests.Remove(newFriend);
                newFriend.MyFriendRequests.Remove(userProfile);
                return true;
            }
            return false;
        }

        public async Task<bool> RemoveFromFriends(string myEmail, string requestor)
        {
            var userProfile = await BuildQuery(myEmail, true);
            var friendToRemove = userProfile.MyFriends.Where(p => p.UserEmail == requestor).SingleOrDefault();

            if (userProfile != null && friendToRemove != null && AddNewFriendAndRequest(userProfile, friendToRemove))
            {
                userProfile.MyFriends.Remove(friendToRemove);
                friendToRemove.MyFriends.Remove(userProfile);               
                return true;
            }
            return false;
        }

        public async Task<Profile> BuildQuery(string userEmail, bool includeFriends = false, bool includeFriendsOfMy = false, bool includeFriendRequests = false, bool includeMyFriendRequests = false)
        {
            var query = dbSet.AsQueryable();

            if (includeFriendRequests)
            {
                query = dbSet.Include(p => p.FriendRequests);
            }

            if (includeMyFriendRequests)
            {
                query = dbSet.Include(p => p.MyFriendRequests);
            }

            if (includeFriends)
            {
                query = dbSet.Include(p => p.MyFriends);
            }

            if (includeFriendsOfMy)
            {
                query = dbSet.Include(p => p.FriendsOfMy);
            }

            return await query.SingleOrDefaultAsync(p => p.UserEmail == userEmail);
        }
    }
}