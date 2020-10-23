using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace supermarketplace.Repositories.common
{
    public interface IRepository<T> where T : class
    {
        int Count();
        Task<int> CountAsync();
        int Count(Expression<Func<T, bool>> match);
        Task<int> CountAsync(Expression<Func<T, bool>> match);
        void Delete(T item);
        T Find(Expression<Func<T, bool>> match);
        bool AddNewFriendAndRequest(T currentUser, T requestor);
        Task<T> FindAsync(Expression<Func<T, bool>> match);
        List<T> FindAll(Expression<Func<T, bool>> match, int toSkip, int size, Expression<Func<T, int>> sort = null);
        Task<List<T>> FindAllAsync(Expression<Func<T, bool>> match, int toSkip, int size, Expression<Func<T, int>> sort = null);
        IQueryable<T> BuildQuery(Expression<Func<T, bool>> match, int toSkip, int size, Expression<Func<T, int>> sort = null);
        T Get(int id);
        Task<T> GetAsync(int id);
        T Insert(T item);
        Task<IEnumerable<T>> Select();
        IQueryable<T> SelectQuery();
        T Update(T item);
    }
}