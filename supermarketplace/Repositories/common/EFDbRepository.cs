using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

using System.Web;

namespace supermarketplace.Repositories.common
{
    public class EFDbRepository<T> : IRepository<T> where T : class
    {
        protected readonly DbSet<T> dbSet;
        
        private UnitOfWorkRepository _unitOfWork;
                
        public EFDbRepository(IUnitOfWork unitOfWork)
        {
            var efUnitOfWork = unitOfWork as UnitOfWorkRepository;
            _unitOfWork = efUnitOfWork;            
            dbSet = efUnitOfWork.GetDbSet<T>();
        }

        public T Insert(T item)
        {
            return dbSet.Add(item);
        }

        public T Update(T item)
        {
            int indicator = _unitOfWork.UpdateAnyEntity(item);  
            return indicator > 0 ? item : null;
        }

        public bool AddNewFriendAndRequest(T currentUser, T requestor)
        {
            try
            {
                _unitOfWork.AddNewFriendAndRequest(currentUser, requestor);
                return true;
            }catch
            {
                return false;
            }
        }

        public void Delete(T item)
        {
            dbSet.Remove(item);
        }

        public async Task<IEnumerable<T>> Select()
        {
            return await dbSet.ToListAsync();
        }

        public IQueryable<T> SelectQuery()
        {
            return dbSet;
        }

        public T Get(int id)
        {
            return dbSet.Find(id);
        }

        public async Task<T> GetAsync(int id)
        {
            return await dbSet.FindAsync(id);// direct to context
        }       

        public T Find(Expression<Func<T, bool>> match)//expression by name...
        {
            return dbSet.SingleOrDefault(match);
        }

        public async Task<T> FindAsync(Expression<Func<T, bool>> match)
        {
            return await dbSet.SingleOrDefaultAsync(match);
        }

        public List<T> FindAll(Expression<Func<T, bool>> match, int toSkip, int size, Expression<Func<T, int>> sort = null)
        {
            return BuildQuery(match, toSkip, size, sort).Take(size).ToList();
        }

        public async Task<List<T>> FindAllAsync(Expression<Func<T, bool>> match, int toSkip, int size, Expression<Func<T,int>> sort = null)
        {  
            return await BuildQuery(match,toSkip,size,sort).ToListAsync();
        }

        public IQueryable<T> BuildQuery(Expression<Func<T, bool>> match, int toSkip, int size, Expression<Func<T, int>> sort = null)
        {
            IQueryable<T> query = dbSet;

            if (match != null)
            {
                query = query.Where(match);
            }

            if (sort != null)
            {
                query = query.OrderByDescending(sort);
            }

            if (toSkip != 0)
            {
                query = query.Skip(toSkip);
            }

            if(size == 0)
            {
                return query;
            }

            return query.Take(size);
        }

        public int Count(Expression<Func<T,bool>> match)
        {
            return dbSet.Where(match).Count();
        }

        public async Task<int> CountAsync(Expression<Func<T, bool>> match)
        {
            return await dbSet.Where(match).CountAsync();
        }

        public int Count()
        {
            return dbSet.Count();
        }

        public async Task<int> CountAsync()
        {
            return await dbSet.CountAsync();
        }

    }
}